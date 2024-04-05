/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import styles from "./container.widget.component.module.scss";
import WidgetStore from "../../../../../stores/widget.store";
import { ContainerOptions } from "../schemas/container.widget.schema";
import NavigationStore from "../../../../../stores/navigation.store";

interface ContainerWidgetProps {
  widgetID: string;
  children?: React.ReactNode;
  widgetStore?: WidgetStore;
  navigationStore?: NavigationStore;
}

const ContainerWidget = ({
  widgetID,
  children,
  widgetStore,
}: ContainerWidgetProps): JSX.Element => {
  const containerOptions: ContainerOptions =
    widgetStore?.getAllOptionsForWidget(widgetID);

  return (
    <div
      className={styles.containerWidget}
      style={{
        ...containerOptions?.containerStyles,
      }}
    >
      {children}
    </div>
  );
};

export default inject(
  "widgetStore",
  "stateStore",
  "navigationStore"
)(observer(ContainerWidget));
