import React from "react";
import styles from "./dashboard.page.layout.component.module.scss";
import classNames from "classnames";
import {
  AreaOptions,
  LayoutOptions,
} from "../../../../schemas/page.schemas/page.schema";

interface DashboardPageLayoutProps {
  options?: LayoutOptions; // Grundeinstellungen für das Layout
  areas?: Record<string, AreaOptions>; // Einstellungen für spezifische Bereiche
  children: React.ReactNode;
  sideBar: React.ReactNode;
  topBar: React.ReactNode;
}

const defaultLayoutOptions: LayoutOptions = {
  backgroundColor: "grey",
};

const DashboardPageLayout = ({
  options = defaultLayoutOptions,
  areas,
  children,
  sideBar,
  topBar,
}: DashboardPageLayoutProps): JSX.Element => {
  const layoutType = options?.layoutType || "topbarFirst";

  const containerClass = classNames(styles.pageContainerWrapper, {
    [styles.sidebarFirst]: layoutType === "sidebarFirst",
    [styles.topbarFirst]: layoutType === "topbarFirst",
  });

  const computeAreaStyle = (areaID: string) => {
    const areaOptions = areas?.[areaID];
    return {
      backgroundColor: areaOptions?.backgroundColor || options.backgroundColor,
      height: areaOptions?.height,
      width: areaOptions?.width,
      padding: areaOptions?.padding || "",
      margin: areaOptions?.margin || "",
    };
  };

  return (
    <div
      className={containerClass}
      style={{ backgroundColor: options.backgroundColor }}
    >
      {layoutType === "sidebarFirst" && sideBar && (
        <div
          className={styles.pageContainerSidebar}
          style={computeAreaStyle("sidebar")}
        >
          {sideBar}
        </div>
      )}

      <div className={styles.topbarsBodyContainer}>
        {topBar && (
          <div
            className={styles.pageContainerTopbar}
            style={computeAreaStyle("topbar")}
          >
            {topBar}
          </div>
        )}

        <div className={styles.pageContainerBody}>{children}</div>
      </div>

      {layoutType === "topbarFirst" && sideBar && (
        <div
          className={styles.pageContainerSidebar}
          style={computeAreaStyle("sidebar")}
        >
          {sideBar}
        </div>
      )}
    </div>
  );
};

export default DashboardPageLayout;
