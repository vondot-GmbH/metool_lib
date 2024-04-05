import React, { useState } from "react";
import styles from "./data.table.component.module.scss";
import TableWidgetLoadingComponent from "../../../../public/widget.components/table.widget/table.widget.loading.component/table.widget.loading.component";
import Checkbox from "../../input.components/checkbox.component/checkbox.component";

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

const Table = <T,>({
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
}: TableProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<T[keyof T]>>([]);

  const handleRowSelectionChange = (recordKey: T[keyof T]) => {
    if (rowSelectionType === "none") return;

    let newSelectedRowKeys = [...selectedRowKeys];
    if (rowSelectionType === "single") {
      newSelectedRowKeys = [recordKey];
    } else if (rowSelectionType === "multiple") {
      if (newSelectedRowKeys.includes(recordKey)) {
        newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(recordKey), 1);
      } else {
        newSelectedRowKeys.push(recordKey);
      }
    }

    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionDataChange?.(
      data.filter((record) => newSelectedRowKeys.includes(record[rowKey]))
    );
  };

  const renderHeader = () => (
    <div className={styles.header} style={{ ...headerStyles }}>
      {rowSelectionType !== "none" && (
        <div className={styles.headerCell} style={{ ...headerCellStyles }}>
          #
        </div>
      )}
      {columns.map((column, index) => (
        <div
          key={index}
          className={styles.headerCell}
          style={{ ...headerCellStyles, ...column.columnStyles }}
        >
          {column.label}
        </div>
      ))}
    </div>
  );

  const renderRow = (record: T) => (
    <div
      key={record[rowKey] as React.Key}
      className={styles.row}
      style={{ ...bodyRowStyles }}
      onClick={() => handleRowSelectionChange(record[rowKey])}
    >
      {rowSelectionType !== "none" && (
        <div className={styles.cell} style={{ ...bodyCellStyles }}>
          <Checkbox
            checked={selectedRowKeys.includes(record[rowKey])}
            onChange={() => handleRowSelectionChange(record[rowKey])}
          />
        </div>
      )}
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className={styles.cell}
          style={{ ...bodyCellStyles, ...column.columnStyles }}
        >
          {column.render
            ? column.render(record[column.source], record)
            : (record[column.source] as React.ReactNode)}
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <TableWidgetLoadingComponent count={7} />;
  }

  return (
    <div className={styles.table}>
      {renderHeader()}
      {data.length > 0 ? (
        data.map(renderRow)
      ) : (
        <div className={styles.noData}>{noDataText}</div>
      )}
    </div>
  );
};

export default Table;
