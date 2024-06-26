import Skeleton from "react-loading-skeleton";
import Column from "../../../../private/general.components/ui.components/column.component/column.component";
import Spacer from "../../../../private/general.components/ui.components/spacer.component/spacer.component";
import styles from "./table.widget.loading.component.module.scss";
import "react-loading-skeleton/dist/skeleton.css";
interface TableWidgetLoadingComponentProps {
  count?: number;
}

const TableWidgetLoadingComponent = ({
  count = 1,
}: TableWidgetLoadingComponentProps): JSX.Element => {
  return (
    <>
      <div className={styles.skeletonTableHeaderWrapper}>
        <Skeleton
          count={1}
          baseColor="#e1e3e3"
          className={styles.skeletonTableHeader}
          height={35}
        />
      </div>
      {Array(count)
        .fill(count)
        .map((_, i) => {
          return (
            <Column key={i} alignItems="center">
              <div className={styles.skeletonDataItemWrapper}>
                <div>
                  <Skeleton
                    count={1}
                    width={50}
                    height={50}
                    baseColor="#e1e3e3"
                  />
                </div>
                <div className={styles.skeletonDataItemTextContainer}>
                  <Skeleton count={1} baseColor="#e1e3e3" />
                  <Skeleton count={1} baseColor="#e1e3e3" />
                </div>
              </div>
              <Spacer width="100%" />
            </Column>
          );
        })}
    </>
  );
};

export default TableWidgetLoadingComponent;
