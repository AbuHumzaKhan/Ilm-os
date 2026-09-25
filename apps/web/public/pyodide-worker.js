const PYODIDE_VERSION = "0.314.0.7";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;

function loadRuntime() {
  if (!pyodidePromise) {
    importScripts(`${PYODIDE_INDEX_URL}pyodide.js`);
    pyodidePromise = loadPyodide({ indexURL: PYODIDE_INDEX_URL }).then(async (runtime) => {
      await runtime.loadPackage(["numpy", "pandas"]);
      return runtime;
    });
  }
  return pyodidePromise;
}

function serializeDataset(columns, rows) {
  const records = rows.map((row) => {
    const record = {};
    columns.forEach((column, index) => {
      record[column] = row[index] ?? null;
    });
    return record;
  });
  return JSON.stringify(records);
}

self.onmessage = async (event) => {
  const message = event.data;

  if (message.type === "load") {
    try {
      await loadRuntime();
      self.postMessage({ type: "ready", pythonVersion: "3.14" });
    } catch (error) {
      self.postMessage({ type: "error", message: error instanceof Error ? error.message : String(error) });
    }
    return;
  }

  if (message.type !== "run") return;

  try {
    const runtime = await loadRuntime();
    const stdout = [];
    const stderr = [];

    runtime.setStdout({ batched: (text) => stdout.push(text) });
    runtime.setStderr({ batched: (text) => stderr.push(text) });

    const datasetJson = serializeDataset(message.columns, message.rows);
    runtime.globals.set("__ILMOS_DATASET_JSON__", datasetJson);
    runtime.globals.set("__ILMOS_COLUMNS__", message.columns);

    const bootstrap = `
import json
from io import StringIO
import pandas as pd
import numpy as np

__records = json.loads(__ILMOS_DATASET_JSON__)
df = pd.DataFrame(__records, columns=__ILMOS_COLUMNS__)

# Friendly aliases used throughout Ilm-os exercises.
data = df
sales = df
`;

    runtime.runPython(bootstrap);
    runtime.runPython(message.code);

    self.postMessage({
      type: "result",
      status: "success",
      stdout: stdout.join(""),
      stderr: stderr.join(""),
    });
  } catch (error) {
    self.postMessage({
      type: "result",
      status: "error",
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    });
  }
};
