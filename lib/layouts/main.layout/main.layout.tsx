import React from "react";
import styles from "./main.layout.module.scss";

interface MainLayoutProps {
  sideBars?: React.ReactNode[];
  topBars?: React.ReactNode[];
  children: React.ReactNode;
  layoutType?: "sidebarFirst" | "topbarFirst";
}

const MainLayout = ({
  sideBars = [],
  topBars = [],
  children,
  layoutType = "sidebarFirst",
}: MainLayoutProps): JSX.Element => {
  const containerClass =
    layoutType === "sidebarFirst" ? styles.sidebarFirst : styles.topbarFirst;

  return (
    <div className={`${styles.pageContainerWrapper} ${containerClass}`}>
      {layoutType === "sidebarFirst" &&
        sideBars.map((sideBar, index) => (
          <div key={index} className={styles.pageContainerSidebar}>
            {sideBar}
          </div>
        ))}

      <div className={styles.topbarsBodyContainer}>
        {topBars.map((topBar, index) => (
          <div key={index} className={styles.pageContainerTopbar}>
            {topBar}
          </div>
        ))}

        <div className={styles.pageContainerBody}>{children}</div>
      </div>

      {layoutType === "topbarFirst" &&
        sideBars.map((sideBar, index) => (
          <div key={index} className={styles.pageContainerSidebar}>
            {sideBar}
          </div>
        ))}
    </div>
  );
};

export default MainLayout;
