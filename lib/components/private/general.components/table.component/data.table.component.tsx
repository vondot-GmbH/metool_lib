import classNames from "classnames";
import styles from "./data.table.component.module.scss";
import Skeleton from "react-loading-skeleton";
import React, { useState } from "react";

interface TableColumn {
  label: string;
  source: string;
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  textAlign?: "left" | "center" | "right";
  headerBackgroundColor?: string;
  rowBackgroundColor?: string;
  borderBottomColor?: string;
  render?: (text: any, record: any, index: number) => JSX.Element;
}

interface TableProps<T> {
  columns: TableColumn[];
  data: T[];
  rowKey: keyof T;
  isLoading?: boolean;
  noDataText?: string;
}

function Table<T extends { [key: string]: any }>({
  columns,
  data,
  rowKey,
  isLoading = false,
  noDataText = "Keine Daten verfügbar",
}: TableProps<T>): JSX.Element {
  const [columnWidths, setColumnWidths] = useState(
    columns.map((column) => column.minWidth || 100)
  );

  const handleMouseDown = (columnIndex: number, event: React.MouseEvent) => {
    const startX = event.clientX;
    const startWidth = columnWidths[columnIndex];

    const handleMouseMove = (e: MouseEvent) => {
      let currentWidth = startWidth + e.clientX - startX;
      const minWidth = columns[columnIndex].minWidth || 50; // in case of no minWidth, use 50 as default
      const maxWidth = columns[columnIndex].maxWidth || Infinity; // in case of no maxWidth, use Infinity as default

      // consider min and max width of the column
      currentWidth = Math.max(minWidth, Math.min(maxWidth, currentWidth));

      const newWidths = [...columnWidths];
      newWidths[columnIndex] = currentWidth;
      setColumnWidths(newWidths);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const renderResizableHandle = (columnIndex: number) => (
    <div
      className={styles.resizeHandle}
      onMouseDown={(e) => handleMouseDown(columnIndex, e)}
    />
  );

  const renderTableBody = () => (
    <tbody>
      {isLoading
        ? renderLoadingState()
        : data.length > 0
        ? renderDataRows()
        : renderNoData()}
    </tbody>
  );

  const renderLoadingState = () => (
    <tr>
      <td colSpan={columns.length}>
        <Skeleton count={1} />
      </td>
    </tr>
  );

  const renderTableHeader = () => (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th
            key={column.label + index}
            style={{
              width: `${columnWidths[index]}px`,
              textAlign: column.textAlign || "left",
              backgroundColor: column.headerBackgroundColor || "#f5f5f5",
            }}
          >
            {column.label}
            {column.resizable && renderResizableHandle(index)}
          </th>
        ))}
        <th className={styles.fillColumnHeader} />
      </tr>
    </thead>
  );

  const renderDataRows = () =>
    data.map((record, index) => (
      <tr key={record[rowKey]}>
        {columns.map((column) => (
          <td
            key={column.source}
            style={{
              textAlign: column.textAlign || "left",
              backgroundColor: column.rowBackgroundColor || "transparent",
              borderBottom:
                "1px solid " + (column.borderBottomColor || "transparent"),
            }}
          >
            {column.render
              ? column.render(record[column.source], record, index)
              : record[column.source]}
          </td>
        ))}
        <td className={styles.fillColumn} />
      </tr>
    ));

  const renderNoData = () => (
    <tr>
      <td colSpan={columns.length}>{noDataText}</td>
    </tr>
  );

  return (
    <div className={classNames(styles.tableContainer)}>
      <table className={classNames(styles.table)}>
        {renderTableHeader()}
        {renderTableBody()}
      </table>
    </div>
  );
}

export default Table;
