import React, { useState } from "react";
import styles from "./data.table.component.module.scss";
import Checkbox from "../checkbox.component/checkbox.component";

export interface TableColumn<T> {
  label: string;
  source: keyof T;
  textAlign?: "left" | "center" | "right";
  columnStyles?: React.CSSProperties;
  render?: (value: any, record: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T;
  isLoading?: boolean;
  noDataText?: string;
  rowSelectionType?: "single" | "multiple" | "none";
  onSelectionDataChange?: (selectedData: T[]) => void;
  headerStyles?: React.CSSProperties;
  headerCellStyles?: React.CSSProperties;
  bodyRowStyles?: React.CSSProperties;
  bodyCellStyles?: React.CSSProperties;
}

function Table<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  noDataText = "No data available",
  rowSelectionType = "none",
  onSelectionDataChange,
  headerStyles,
  headerCellStyles,
  bodyRowStyles,
  bodyCellStyles,
}: TableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<T[keyof T]>>([]);

  const handleRowSelectionChange = (recordKey: T[keyof T]) => {
    if (rowSelectionType === "none") return;

    let newSelectedRowKeys = [...selectedRowKeys];
    if (rowSelectionType === "single") {
      newSelectedRowKeys = [recordKey];
    } else if (rowSelectionType === "multiple") {
      newSelectedRowKeys.includes(recordKey)
        ? newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(recordKey), 1)
        : newSelectedRowKeys.push(recordKey);
    }

    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionDataChange &&
      onSelectionDataChange(
        data.filter((record) => newSelectedRowKeys.includes(record[rowKey]))
      );
  };

  const buildHeader = () => (
    <thead>
      <tr style={{ ...headerStyles }}>
        {rowSelectionType !== "none" && (
          <th
            className={styles.selectionColumn}
            style={{ ...headerCellStyles }}
          >
            #
          </th>
        )}
        {columns.map((column, index) => (
          <th
            key={index}
            style={{ ...headerCellStyles, ...column?.columnStyles }}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );

  const buildRow = (record: T) => {
    const isSelected = selectedRowKeys.includes(record[rowKey]);
    const rowClass = isSelected ? styles.selectedRow : "";

    return (
      <tr
        key={record[rowKey] as React.Key}
        className={rowClass}
        style={{ ...bodyRowStyles }}
        onClick={() => handleRowSelectionChange(record[rowKey])}
      >
        {rowSelectionType !== "none" && buildSelectionCell(record)}
        {columns.map((column, colIndex) => buildCell(column, record, colIndex))}
      </tr>
    );
  };

  const buildSelectionCell = (record: T) => (
    <td className={styles.selectionCell} style={{ ...bodyCellStyles }}>
      <Checkbox
        checked={selectedRowKeys.includes(record[rowKey])}
        onChange={() => handleRowSelectionChange(record[rowKey])}
      />
    </td>
  );

  const buildCell = (column: TableColumn<T>, record: T, colIndex: number) => (
    <td
      key={colIndex}
      className={styles.cell}
      style={{ ...bodyCellStyles, ...column?.columnStyles }}
    >
      {column.render
        ? column.render(record[column.source], record)
        : (record[column.source] as React.ReactNode)}
    </td>
  );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        {buildHeader()}
        <tbody>
          {!isLoading && data.length > 0 && data.map(buildRow)}
          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ ...bodyRowStyles }}>
                {noDataText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
