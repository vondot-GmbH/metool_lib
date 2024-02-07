import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../stores/widget.store";

interface TableWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
}

const TableWidget: React.FC<TableWidgetProps> = ({
  widgetID,
  widgetStore,
}): JSX.Element => {
  console.log("widgetStore");
  console.log(widgetStore);

  return <div>Table Widget {widgetID}</div>;
};

export default inject("widgetStore")(observer(TableWidget));
