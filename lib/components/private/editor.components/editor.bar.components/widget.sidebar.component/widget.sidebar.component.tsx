/* eslint-disable no-empty-pattern */
import Image from "../../../general.components/image.component/image.component";
import styles from "./widget.sidebar.component.module.scss";
import RunningText from "../../../general.components/text.components/running.text.component/running.text.component";
import Wrap from "../../../general.components/wrap.component/wrap.component";
import fallbackImage from "../../../../../assets/icons/fallback_image.png";
import Column from "../../../general.components/column.component/column.component";
import ComponentWrapper from "../../../general.components/component.wrapper.component/component.wrapper.component";

interface WidgetSidebarProps {}

const WidgetSidebar = ({}: WidgetSidebarProps): JSX.Element => {
  const _buildWidgetItem = (): JSX.Element => {
    return (
      <Column
        className={styles.widgetPreviewContainer}
        alignItems="center"
        draggable={true}
        onDragStart={(e) => e.dataTransfer.setData("text/plain", "TEST_TEST")}
      >
        <div className={styles.imageWrapper}>
          <Image size="S" imageUrl={fallbackImage} />
        </div>
        <RunningText className={styles.widgetTitle}>WIDGET</RunningText>
      </Column>
    );
  };

  return (
    <ComponentWrapper title={"Widgets"}>
      <Wrap className={styles.widgetSidebar} justifyContent="center">
        {_buildWidgetItem()}
        {_buildWidgetItem()}
        {_buildWidgetItem()}
        {_buildWidgetItem()}
        {_buildWidgetItem()}
        {_buildWidgetItem()}
      </Wrap>
    </ComponentWrapper>
  );
};

export default WidgetSidebar;
