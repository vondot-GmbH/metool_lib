/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from "classnames";
import styles from "./data.table.component.module.scss";
import Skeleton from "react-loading-skeleton";
import React, { useState } from "react";
import Checkbox from "../checkbox.component/checkbox.component";

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
  defaultHeaderBackgroundColor?: string;
  defaultRowBackgroundColor?: string;
  defaultBorderBottomColor?: string;
  rowHoverColor?: string;
  rowSelectionType?: "single" | "multiple" | "none";
  rowSelectionBackgroundColor?: string;
  onSelectionDataChange?: (selectedData: T[]) => void;
  onSelectionIndexChange?: (selectedIndexes: number[]) => void;
}

function Table<T extends { [key: string]: any }>({
  columns,
  data,
  rowKey,
  isLoading = false,
  noDataText = "Keine Daten verfügbar",
  defaultHeaderBackgroundColor = "transparent",
  defaultRowBackgroundColor = "transparent",
  defaultBorderBottomColor = "transparent",
  rowHoverColor = "transparent",
  rowSelectionType = "none",
  rowSelectionBackgroundColor = "transparent",
  onSelectionDataChange,
  onSelectionIndexChange,
}: TableProps<T>): JSX.Element {
  const [columnWidths, setColumnWidths] = useState(
    columns.map((column) => column.minWidth || 100)
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<
    Array<string | number>
  >([]);

  const tableRowStyle = {
    "--row-hover-color": rowHoverColor,
    "--row-selected-color": rowSelectionBackgroundColor,
  } as React.CSSProperties;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRowSelectionChange = (
    recordKey: string | number,
    recordIndex: number
  ): void => {
    let newSelectedRowKeys: Array<string | number> = [];

    if (rowSelectionType === "multiple") {
      newSelectedRowKeys = selectedRowKeys.includes(recordKey)
        ? selectedRowKeys.filter((key) => key !== recordKey)
        : [...selectedRowKeys, recordKey];
    } else if (rowSelectionType === "single") {
      newSelectedRowKeys = [recordKey];
    }

    setSelectedRowKeys(newSelectedRowKeys);

    const newSelectedData: T[] = [];
    const newSelectedIndexes: number[] = [];

    newSelectedRowKeys.forEach((key) => {
      const index = data.findIndex((item) => item[rowKey] === key);
      if (index !== -1) {
        newSelectedData.push(data[index]);
        newSelectedIndexes.push(index);
      }
    });

    // call the callback functions
    onSelectionDataChange && onSelectionDataChange(newSelectedData);
    onSelectionIndexChange && onSelectionIndexChange(newSelectedIndexes);
  };

  const renderSelectionCheckbox = (
    recordKey: string | number,
    index: number
  ): JSX.Element => (
    <td className={styles.selectionColumn}>
      <Checkbox
        checked={selectedRowKeys.includes(recordKey)}
        onChange={() => handleRowSelectionChange(recordKey, index)}
      />
    </td>
  );

  const renderRowSelectionProps = (
    recordKey: string | number,
    index: number
  ) => {
    const isSelected = selectedRowKeys.includes(recordKey);
    const props: any = {
      className: classNames(styles.rowHover, {
        [styles.rowSelected]: isSelected && rowSelectionType !== "multiple",
      }),
      style: tableRowStyle,
    };

    if (rowSelectionType === "single") {
      props.onClick = () => handleRowSelectionChange(recordKey, index);
    }

    return props;
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
        {/* if table is selectable type multiple, render a selection column */}
        {rowSelectionType === "multiple" && (
          <th className={styles.selectionColumn}></th>
        )}

        {columns.map((column, index) => (
          <th
            className={styles.tableCell}
            key={column.label + index}
            style={{
              width: `${columnWidths[index]}px`,
              textAlign: column.textAlign || "left",
              backgroundColor:
                column.headerBackgroundColor || defaultHeaderBackgroundColor,
            }}
          >
            {column.label}
            {column.resizable && renderResizableHandle(index)}
          </th>
        ))}
        <th
          className={styles.fillColumnHeader}
          style={{
            backgroundColor: defaultHeaderBackgroundColor,
          }}
        />
      </tr>
    </thead>
  );

  const renderDataRows = () =>
    data.map((record, index) => {
      const rowSelectionProps = renderRowSelectionProps(record[rowKey], index);

      return (
        <tr key={record[rowKey]} {...rowSelectionProps}>
          {rowSelectionType === "multiple" &&
            renderSelectionCheckbox(record[rowKey], index)}
          {columns.map((column) => (
            <td
              className={styles.tableCell}
              key={column.source}
              style={{
                textAlign: column.textAlign || "left",
                backgroundColor:
                  column.rowBackgroundColor || defaultRowBackgroundColor,
                borderBottom:
                  "1px solid " +
                  (column.borderBottomColor || defaultBorderBottomColor),
              }}
            >
              {column.render
                ? column.render(record[column.source], record, index)
                : record[column.source]}
            </td>
          ))}
          <td
            className={styles.fillColumn}
            style={{
              backgroundColor: defaultRowBackgroundColor,
              borderBottom: "1px solid " + defaultBorderBottomColor,
            }}
          />
        </tr>
      );
    });

  const renderNoData = () => (
    <tr>
      <td colSpan={columns.length}>{noDataText}</td>
    </tr>
  );

  return (
    <div className={classNames(styles.tableWrapper)}>
      <table className={classNames(styles.tableContainer)}>
        {renderTableHeader()}
        {renderTableBody()}
      </table>
    </div>
  );
}

export default Table;
