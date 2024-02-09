/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import classNames from "classnames";
import styles from "./data.table.component.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";
import Skeleton from "react-loading-skeleton";

interface DataTableHeader {
  flex?: number;
  child?: JSX.Element;
}

interface DataRow {
  children: DataTableRowCell[];
  className?: string;
  key: string;
}

interface DataTableRowCell {
  child: JSX.Element;
  className?: string;
}

interface ListDataTableProps<T> {
  data: T[];
  columns: DataTableHeader[];
  dataTableItemBuilder: (data: T, index: number) => DataRow;
  itemClassName?: string;
  tableClassName?: string;
  onClick?: (data: T) => void;
  gap?: number;
  disableHeader?: boolean;
  sortable?: boolean;
  onSortEnd?: (oldIndex: number, newIndex: number) => void;
  noDataMessage?: string;
  isLoading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const ListDataTable = <T extends unknown>({
  data,
  columns,
  gap = 0,
  dataTableItemBuilder,
  itemClassName,
  tableClassName,
  onClick,
  disableHeader = false,
  sortable = false,
  onSortEnd,
  noDataMessage,
  isLoading,
}: ListDataTableProps<T>): JSX.Element => {
  const listDataTableClassName = classNames(
    styles.listDataTable,
    tableClassName
  );

  const _prepareHeader = (): JSX.Element => {
    const headersAreSet = columns.find((column) => column.child != null);

    if (!headersAreSet) {
      return <></>;
    }

    return (
      <div className={styles.listDataTableHeader} style={{ gap: gap ?? 0 }}>
        {columns.map((column, index) => {
          return (
            <div
              key={index}
              className={styles.listDataTableHeaderItem}
              style={{
                flex: column.flex ?? 1,
              }}
            >
              {column.child}
            </div>
          );
        })}
      </div>
    );
  };

  const _prepareRows = (): JSX.Element => {
    return (
      <div className={styles.listDataTableBody}>
        <div className={styles.listDataTableBodyItemWrapper}>
          {isLoading && <SkeletonListDataTableItem count={4} />}

          {!isLoading &&
            noDataMessage != null &&
            (data == null || data.length === 0) && (
              <div className={styles.listDataTableBodyItem}>
                <RunningText>{noDataMessage}</RunningText>
              </div>
            )}

          {!isLoading &&
            data.map((dataItem: any, index) => {
              if (dataItem == null) {
                return <></>;
              }
              return (
                <React.Fragment key={dataItem.key || index}>
                  {_prepareDataTableItem(
                    dataTableItemBuilder(dataItem, index),
                    dataItem
                  )}
                  {index !== data.length - 1 && (
                    <div className={styles.listDataTableBodyItemSeparator} />
                  )}
                </React.Fragment>
              );
            })}
        </div>
      </div>
    );
  };

  // const _prepareSortableRows = (): JSX.Element => {
  //   if (data == null) {
  //     return <></>;
  //   }
  //   return (
  //     <div className={styles.listDataTableBody}>
  //       <div className={styles.listDataTableBodyItemWrapper}>
  //         <SortableList
  //           data={data}
  //           onSortEnd={onSortEnd}
  //           itemBuilder={(dataItem, index) => {
  //             return (
  //               <>
  //                 <div style={{ zIndex: 100 }}>
  //                   {_prepareDataTableItem(
  //                     dataTableItemBuilder(dataItem, index),
  //                     dataItem
  //                   )}
  //                 </div>
  //                 <Spacer />
  //               </>
  //             );
  //           }}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  const _prepareSortableRows = (): JSX.Element => {
    return <div>sortable</div>;
  };

  const _prepareDataTableItem = (
    dataRow: DataRow,
    dataItem: any
  ): JSX.Element => {
    return (
      <div
        key={dataRow.key}
        className={classNames(
          styles.listDataTableBodyItem,
          dataRow.className,
          itemClassName
        )}
        style={{ gap: gap ?? 0 }}
        onClick={() => onClick?.(dataItem)}
      >
        {dataRow.children.map((dataRowItem, index) => {
          return (
            <div
              className={classNames(
                styles.listDataTableBodyItemCell,
                dataRowItem.className
              )}
              key={index}
              style={{
                flex: columns[index].flex ?? 1,
              }}
            >
              {dataRowItem.child}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={listDataTableClassName}>
      {!isLoading &&
        data != null &&
        data.length !== 0 &&
        !disableHeader &&
        _prepareHeader()}
      {!sortable ? _prepareRows() : _prepareSortableRows()}
    </div>
  );
};

export default ListDataTable;

export const SkeletonListDataTableItem = ({
  count = 1,
}: {
  count?: number;
}): JSX.Element => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.skeletonListDataItemWrapper}>
          <Skeleton count={1} width={40} height={40} />
          <div className={styles.skeletonListDataItemTextContainer}>
            <Skeleton
              count={1}
              style={{
                fontSize: "15px",
              }}
            />
            <Skeleton
              count={1}
              style={{
                fontSize: "15px",
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};
