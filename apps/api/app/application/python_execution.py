from __future__ import annotations

import csv
import json
import os
import subprocess
import tempfile
from pathlib import Path


class PythonExecutionError(RuntimeError):
    """Raised when the isolated Python runner cannot execute a submission."""


MAX_CODE_BYTES = 20_000
MAX_DATASET_BYTES = 200_000
TIMEOUT_SECONDS = 8
EXECUTOR_IMAGE = os.getenv("ILMOS_PYTHON_EXECUTOR_IMAGE", "ilm-os-python-executor:latest")


def execute_python(code: str, columns: list[str], rows: list[list[object]]) -> dict[str, object]:
    if not code.strip():
        raise PythonExecutionError("Python code cannot be empty.")
    if len(code.encode("utf-8")) > MAX_CODE_BYTES:
        raise PythonExecutionError("Code exceeds the 20 KB exercise limit.")

    if not columns or len(columns) > 50 or len(rows) > 5000:
        raise PythonExecutionError("Dataset is outside the allowed exercise size.")
    if any(len(row) != len(columns) for row in rows):
        raise PythonExecutionError("Dataset rows do not match the column count.")

    with tempfile.TemporaryDirectory(prefix="ilmos-python-") as temp_dir:
        root = Path(temp_dir)
        code_path = root / "main.py"
        csv_path = root / "sales.csv"
        result_path = root / "result.json"

        code_path.write_text(code, encoding="utf-8")
        with csv_path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.writer(handle)
            writer.writerow(columns)
            writer.writerows(rows)

        if csv_path.stat().st_size > MAX_DATASET_BYTES:
            raise PythonExecutionError("Dataset exceeds the 200 KB exercise limit.")

        command = [
            "docker",
            "run",
            "--rm",
            "--network=none",
            "--read-only",
            "--cap-drop=ALL",
            "--security-opt=no-new-privileges",
            "--memory=256m",
            "--cpus=0.5",
            "--pids-limit=64",
            "--tmpfs=/tmp:rw,noexec,nosuid,size=32m",
            "-v",
            f"{code_path}:/workspace/main.py:ro",
            "-v",
            f"{csv_path}:/workspace/sales.csv:ro",
            "-v",
            f"{result_path}:/workspace/result.json",
            EXECUTOR_IMAGE,
        ]

        try:
            completed = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=TIMEOUT_SECONDS,
                check=False,
            )
        except FileNotFoundError as exc:
            raise PythonExecutionError("Docker is not installed or is not available to the API service.") from exc
        except subprocess.TimeoutExpired as exc:
            raise PythonExecutionError("Execution timed out after 8 seconds.") from exc

        stdout = completed.stdout[-20_000:]
        stderr = completed.stderr[-10_000:]

        if completed.returncode != 0:
            return {
                "status": "error",
                "stdout": stdout,
                "stderr": stderr or "Python execution failed.",
                "exit_code": completed.returncode,
            }

        result: dict[str, object] = {
            "status": "success",
            "stdout": stdout,
            "stderr": stderr,
            "exit_code": 0,
        }
        if result_path.exists():
            try:
                parsed = json.loads(result_path.read_text(encoding="utf-8"))
                if isinstance(parsed, dict):
                    result.update(parsed)
            except json.JSONDecodeError:
                pass
        return result
