"use client";

import { useMemo } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

type Dataset = {
  id: string;
  name: string;
  description: string;
  task: string;
  columns: string[];
  rows: Array<Array<string | number>>;
  referenceHints: string[];
};

type BusinessDatasetSheetProps = {
  dataset: Dataset;
  resetKey: number;
};

function toCellData(dataset: Dataset) {
  const values = [dataset.columns, ...dataset.rows];
  return values.flatMap((row, r) =>
    row.map((value, c) => ({
      r,
      c,
      v: {
        v: value,
        m: String(value),
        ct: { fa: "General", t: typeof value === "number" ? "n" : "g" },
      },
    }))
  );
}

export default function BusinessDatasetSheet({ dataset, resetKey }: BusinessDatasetSheetProps) {
  const data = useMemo(
    () => [
      {
        name: dataset.name,
        id: "business-dataset",
        status: 1,
        order: 0,
        row: Math.max(dataset.rows.length + 20, 30),
        column: Math.max(dataset.columns.length, 8),
        defaultRowHeight: 28,
        defaultColWidth: 120,
        celldata: toCellData(dataset),
      },
    ],
    [dataset, resetKey]
  );

  return (
    <div className="dataset-sheet-shell">
      <Workbook
        key={`${dataset.id}-${resetKey}`}
        data={data}
        allowEdit
        showToolbar
        showFormulaBar
        showSheetTabs={false}
        lang="en"
      />
      <style jsx>{`
        .dataset-sheet-shell {
          height: 520px;
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          background: #fff;
        }
        .dataset-sheet-shell :global(.fortune-sheet-container) {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        @media (max-width: 760px) {
          .dataset-sheet-shell { height: 440px; }
        }
      `}</style>
    </div>
  );
}
