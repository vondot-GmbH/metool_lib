import styles from "./dashboard.page.layout.component.module.scss";

interface DashboardPageLayoutProps {
  sideBar?: React.ReactNode;
  topBar?: React.ReactNode;
  children: React.ReactNode;
  layoutType?: "sidebarFirst" | "topbarFirst";
}

const DashboardPageLayout = ({
  sideBar,
  topBar,
  children,
  layoutType = "sidebarFirst",
}: DashboardPageLayoutProps): JSX.Element => {
  const containerClass =
    layoutType === "sidebarFirst" ? styles.sidebarFirst : styles.topbarFirst;

  return (
    <div className={`${styles.pageContainerWrapper} ${containerClass}`}>
      {layoutType === "sidebarFirst" && sideBar && (
        <div
          key="DashboardPageLayoutSidebar"
          className={styles.pageContainerSidebar}
        >
          {sideBar}
        </div>
      )}

      <div className={styles.topbarsBodyContainer}>
        {topBar && (
          <div
            key="DashboardPageLayoutTopbar"
            className={styles.pageContainerTopbar}
          >
            {topBar}
          </div>
        )}

        <div
          className={styles.pageContainerBody}
          key="DashboardPageLayoutContent"
        >
          {children}
        </div>
      </div>

      {layoutType === "topbarFirst" && sideBar && (
        <div
          key="DashboardPageLayoutTopbarFirst"
          className={styles.pageContainerSidebar}
        >
          {sideBar}
        </div>
      )}
    </div>
  );
};

export default DashboardPageLayout;
