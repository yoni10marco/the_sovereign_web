import type { ComparisonTableProps } from "@/lib/morphing/config-schema";

export function ComparisonTable({ title, columns, rows }: ComparisonTableProps) {
  if (!columns || !rows || rows.length === 0) return null;

  return (
    <div className="px-6 py-12">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: "var(--morph-primary)" }}>
          {title}
        </h2>
      )}
      <div className="overflow-x-auto max-w-4xl mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th
                className="px-4 py-3 text-left font-semibold"
                style={{ background: "var(--morph-secondary)" }}
              >
                Feature
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-center font-semibold"
                  style={{
                    background: i === 0 ? "var(--morph-accent)" : "var(--morph-secondary)",
                    color: i === 0 ? "var(--morph-background)" : undefined,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t" style={{ borderColor: "rgba(128,128,128,0.15)" }}>
                <td className="px-4 py-3 font-medium">{row.feature}</td>
                {row.values.map((val, vi) => (
                  <td key={vi} className="px-4 py-3 text-center">
                    {val === true ? (
                      <span style={{ color: "var(--morph-accent)" }}>✓</span>
                    ) : val === false ? (
                      <span className="opacity-30">✗</span>
                    ) : (
                      String(val)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
