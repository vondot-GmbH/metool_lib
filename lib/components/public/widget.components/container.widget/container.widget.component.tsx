/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import styles from "./container.widget.component.module.scss";

interface ContainerWidgetProps {
  widgetID: string;
}

const ContainerWidget: React.FC<ContainerWidgetProps> = ({
  widgetID,
}): JSX.Element => {
  return <div className={styles.containerWidget}>{widgetID}</div>;
};

export default inject("widgetStore", "stateStore")(observer(ContainerWidget));
