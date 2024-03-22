import React from "react";
import styles from "./dashboard.page.layout.component.module.scss";
import {
  AreaOptions,
  LayoutOptions,
} from "../../../../schemas/page.schemas/page.schema";

interface DashboardPageLayoutProps {
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
}: DashboardPageLayoutProps): JSX.Element => {
  const layoutType = (options?.layoutType as LayoutType) || "sidebarFirst";

  const computeAreaStyle = (areaID: string) => {
    const areaOptions = areas?.[areaID];
    return {
      backgroundColor: areaOptions?.backgroundColor || options.backgroundColor,
      height: areaOptions?.height,
      width: areaOptions?.width,
      padding: areaOptions?.padding,
      margin: areaOptions?.margin,
      maxHeight: areaOptions?.maxHeight,
      minHeight: areaOptions?.minHeight,
      maxWidth: areaOptions?.maxWidth,
      minWidth: areaOptions?.minWidth,
      border: areaOptions?.border,
      borderRadius: areaOptions?.borderRadius,
    };
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
