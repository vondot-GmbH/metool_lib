import React from "react";
import styles from "./dashboard.page.layout.component.module.scss";
import {
  AreaOptions,
  LayoutOptions,
} from "../../../../schemas/page.schemas/page.schema";

interface DashboardPageLayoutProps {
  currentBreakpoint: string;
  options?: LayoutOptions;
  areas?: Record<string, AreaOptions>;
  children: React.ReactNode;
  sideBar: React.ReactNode;
  topBar: React.ReactNode;
}

const defaultLayoutOptions: LayoutOptions = {
  backgroundColor: "grey",
};

type LayoutType = "sidebarFirst" | "topbarFirst";

const DashboardPageLayout = ({
  options = defaultLayoutOptions,
  areas,
  children,
  sideBar,
  topBar,
  currentBreakpoint,
}: DashboardPageLayoutProps): JSX.Element => {
  const layoutType = (options?.layoutType as LayoutType) || "sidebarFirst";

  const computeAreaStyle = (areaID: string) => {
    const areaOptions = areas?.[areaID];
    const breakpointOptions = areaOptions ? areaOptions[currentBreakpoint] : {};

    return {
      backgroundColor:
        breakpointOptions.backgroundColor || options.backgroundColor,
      height: breakpointOptions.height,
      width: breakpointOptions.width,
      padding: breakpointOptions.padding,
      margin: breakpointOptions.margin,
      border: breakpointOptions.border,
      borderRadius: breakpointOptions.borderRadius,
    } as React.CSSProperties;
  };

  if (layoutType === "sidebarFirst") {
    return (
      <div className={styles.sidebarFirstContainer}>
        <div className={styles.sidebar} style={computeAreaStyle("sidebar")}>
          {sideBar}
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.topbar} style={computeAreaStyle("topbar")}>
            {topBar}
          </div>
          <div className={styles.pageContent}>{children}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.topbarFirstContainer}>
        <div className={styles.topbar} style={computeAreaStyle("topbar")}>
          {topBar}
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.sidebar} style={computeAreaStyle("sidebar")}>
            {sideBar}
          </div>
          <div className={styles.pageContent}>{children}</div>
        </div>
      </div>
    );
  }
};

export default DashboardPageLayout;
