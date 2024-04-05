import classNames from "classnames";
import React from "react";
import styles from "./sized.container.component.module.scss";

interface SizedContainerProps {
  children?: React.ReactNode | React.ReactNode[];
  size?: "s" | "m" | "l" | "xml" | "xl" | "xxl" | "CUSTOM";
  className?: string;
  customSize?: number | string;
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
    // if number use pixels, if string use string
    const sizeValue =
      typeof customSize === "number" ? `${customSize}px` : customSize;

    return (
      <div className="sized-container" style={{ maxWidth: sizeValue }}>
        {children}
      </div>
    );
  }

  return <div className={contentContainerClassName}>{children}</div>;
};

export default SizedContainer;
