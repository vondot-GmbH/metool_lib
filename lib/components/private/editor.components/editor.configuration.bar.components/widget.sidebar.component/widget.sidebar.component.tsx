/* eslint-disable no-empty-pattern */
import Image from "../../../general.components/image.component/image.component";
import styles from "./widget.sidebar.component.module.scss";
import RunningText from "../../../general.components/text.components/running.text.component/running.text.component";
import Wrap from "../../../general.components/wrap.component/wrap.component";
import fallbackImage from "../../../../../assets/icons/fallback_image.png";
import Column from "../../../general.components/column.component/column.component";
import ComponentWrapper from "../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../general.components/row.component/row.component";
import ConfigProvider from "../../../../../config/config.provider";

interface WidgetSidebarProps {}

const WidgetSidebar = ({}: WidgetSidebarProps): JSX.Element => {
  const registeredWidgets = ConfigProvider.getInstance().getRegisteredWidgets();

  const _buildWidgetItem = (args: {
    type: string;
    icon: string;
    name: string;
  }): JSX.Element => {
    return (
      <Column
        key={args.type}
        className={styles.widgetPreviewContainer}
        alignItems="center"
        draggable={true}
        onDragStart={(e) => e.dataTransfer.setData("text/plain", args.type)}
      >
        <Row
          className={styles.imageWrapper}
          justifyContent="center"
          alignItems="center"
        >
          <Image size="S" imageUrl={args.icon} className={styles.widgetIcon} />
        </Row>
        <RunningText className={styles.widgetTitle}>{args.name}</RunningText>
      </Column>
    );
  };

  return (
    <ComponentWrapper title={"Widgets"}>
      <Wrap
        className={styles.widgetSidebar}
        justifyContent="center"
        gap="12px 8px"
      >
        {registeredWidgets.map((widget) => {
          return (
            <>
              {_buildWidgetItem({
                icon: widget.icon || fallbackImage,
                name: widget.name,
                type: widget.type,
              })}
            </>
          );
        })}
      </Wrap>
    </ComponentWrapper>
  );
};

export default WidgetSidebar;
