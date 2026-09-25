"use client";

import { useMemo } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";

type PythonDataset = {
  name: string;
  columns: string[];
  rows: Array<Array<string | number>>;
};

type Props = {
  dataset: PythonDataset;
  resetKey: number;
};

function toCellData(dataset: PythonDataset) {
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

export default function PythonDatasetSheet({ dataset, resetKey }: Props) {
  const data = useMemo(
    () => [
      {
        name: dataset.name,
        id: "python-sales-data",
        status: 1,
        order: 0,
        row: Math.max(dataset.rows.length + 20, 30),
        column: Math.max(dataset.columns.length, 8),
        defaultRowHeight: 28,
        defaultColWidth: 118,
        celldata: toCellData(dataset),
      },
    ],
    [dataset, resetKey]
  );

  return (
    <div className="python-sheet">
      <Workbook
        key={`${dataset.name}-${resetKey}`}
        data={data}
        allowEdit
        showToolbar
        showFormulaBar
        showSheetTabs={false}
        lang="en"
      />
      <style jsx>{`
        .python-sheet {
          height: 470px;
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
          background: #fff;
        }
        .python-sheet :global(.fortune-sheet-container) {
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        @media (max-width: 760px) { .python-sheet { height: 400px; } }
      `}</style>
    </div>
  );
}
