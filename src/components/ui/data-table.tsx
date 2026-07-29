import React from "react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  activeRowId?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No records found.",
  className,
  onRowClick,
  activeRowId,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full p-8 border border-dashed border-[#EAEAEA] rounded-xl flex flex-col items-center justify-center text-center bg-[#FAFAFA]">
        <p className="text-ink/50 font-body-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-[#EAEAEA] bg-white shadow-sm", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#EAEAEA] bg-[#F9F9F9]">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={cn(
                  "py-3 px-4 text-xs font-label-caps uppercase tracking-wider text-ink/50",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right"
                )}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EAEAEA]">
          {data.map((row) => {
            const id = keyExtractor(row);
            const isActive = activeRowId === id;
            return (
              <tr 
                key={id} 
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "group transition-colors",
                  onRowClick && "cursor-pointer",
                  isActive ? "bg-coral/5" : "hover:bg-[#F9F9F9]"
                )}
              >
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={cn(
                      "py-4 px-4 text-sm text-ink",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
