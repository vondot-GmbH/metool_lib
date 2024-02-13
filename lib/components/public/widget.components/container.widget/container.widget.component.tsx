/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import styles from "./container.widget.component.module.scss";

interface ContainerWidgetProps {
  widgetID: string;
  children?: React.ReactNode;
}

const ContainerWidget: React.FC<ContainerWidgetProps> = ({
  widgetID,
  children,
}): JSX.Element => {
  return (
    <div className={styles.containerWidget}>
      {widgetID}

      {children}
    </div>
  );
};

export default inject("widgetStore", "stateStore")(observer(ContainerWidget));
