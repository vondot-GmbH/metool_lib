import classNames from "classnames";
import React from "react";
import styles from "./sized.container.component.module.scss";

interface SizedContainerProps {
  children?: React.ReactNode | React.ReactNode[];
  size?: "s" | "m" | "l" | "xml" | "xl" | "xxl" | "CUSTOM";
  className?: string;
  customSize?: number;
}

const SizedContainer = ({
  children,
  size,
  className,
  customSize,
}: SizedContainerProps): JSX.Element => {
  let contentContainerClassName = classNames(styles.sizedContainer, className);

  if (size) {
    contentContainerClassName += ` ${styles[size]}`;
  }

  if (size === "CUSTOM") {
    return (
      <div className="sized-container" style={{ maxWidth: `${customSize}px` }}>
        {children}
      </div>
    );
  }

  return <div className={contentContainerClassName}>{children}</div>;
};

export default SizedContainer;
