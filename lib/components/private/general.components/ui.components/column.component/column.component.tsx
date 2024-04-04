import classNames from "classnames";
import React from "react";
import styles from "./column.component.module.scss";

interface ColumnProps {
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onClick?: () => void;
  key?: React.Key | null | undefined;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Column = ({
  justifyContent,
  alignItems,
  children,
  className,
  onClick,
  key,
  draggable = false,
  onDragStart,
}: ColumnProps): JSX.Element => {
  const columnContainerClassName = classNames(
    styles.columnContainer,
    className
  );

  return (
    <div
      onDragStart={onDragStart}
      draggable={draggable}
      key={key}
      className={columnContainerClassName}
      style={{ justifyContent, alignItems }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Column;
