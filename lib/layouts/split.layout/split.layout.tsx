import classNames from "classnames";
import React from "react";
import styles from "./split.layout.module.scss";

interface Splitlayout {
  leftChild: React.ReactNode;
  leftGrow?: number;
  rightChild: React.ReactNode;
  rightGrow?: number;
  flexDirection?: "row" | "column";
  className?: string;
  maxWidthLeft?: number;
  maxWidthRight?: number;
  minWidthLeft?: number;
  minWidthRight?: number;
  useAsPage?: boolean;
  collapseable?: boolean;
  placeholder?: React.ReactNode;
  disableFlexColumnOnMobile?: boolean;
}

const SplitLayout = ({
  leftChild,
  leftGrow = 1,
  rightChild,
  rightGrow = 1,
  flexDirection = "row",
  maxWidthLeft,
  maxWidthRight,
  minWidthLeft,
  minWidthRight,
  useAsPage = false,
  collapseable = false,
  placeholder,
  className,
  disableFlexColumnOnMobile = false,
}: Splitlayout): JSX.Element => {
  let splitLayoutClassName = classNames(styles.splitLayoutWrapper, className);

  if (flexDirection === "column") {
    splitLayoutClassName += ` ${styles.splitLayoutFlexColumn}`;
  }

  if (!disableFlexColumnOnMobile) {
    splitLayoutClassName += ` ${styles.splitLayoutWrapperReverseOnMobile}`;
  }

  return (
    <div className={splitLayoutClassName}>
      {((useAsPage && rightChild == null) ||
        window.innerWidth > 830 ||
        !useAsPage) && (
        <div
          className={styles.splitContainerWrapper}
          style={{
            flex:
              collapseable && useAsPage && rightChild != null ? 0 : leftGrow,
            maxWidth: window.innerWidth > 830 ? maxWidthLeft ?? "none" : "none",
            opacity:
              collapseable && useAsPage && rightChild != null ? "0" : "1",
            minWidth:
              collapseable && useAsPage && rightChild != null
                ? "0px"
                : minWidthLeft ?? "none",
          }}
        >
          {leftChild}
        </div>
      )}
      {(rightChild != null || window.innerWidth > 830) && (
        <div
          className={styles.splitContainerWrapper}
          style={{
            flex: rightGrow,
            maxWidth:
              window.innerWidth > 830 ? maxWidthRight ?? "none" : "none",
            minWidth: minWidthRight ?? "none",
            zIndex: 2,
          }}
        >
          {rightChild ?? placeholder}
        </div>
      )}
    </div>
  );
};

export default SplitLayout;
