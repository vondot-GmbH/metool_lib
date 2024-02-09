import { inject, observer } from "mobx-react";
import StateStore from "../../../../../stores/state.store";
import WidgetStore from "../../../../../stores/widget.store";
import ComponentWrapper from "../../../general.components/component.wrapper.component/component.wrapper.component";

interface StateSidebarProps {
  stateStore?: StateStore;
  widgetStore?: WidgetStore;
}

const StateSidebar = ({
  stateStore,
  widgetStore,
}: StateSidebarProps): JSX.Element => {
  const widget = widgetStore?.getSelectedWidget();
  const widgetID = widget?.widget.widgetID ?? ""; // TODO make this dynamic as dropdown

  const widgetStates = stateStore?.getAllWidgetStates(widgetID);

  if (!widgetStates) {
    return (
      <ComponentWrapper title={"State"}>
        <p>No state available</p>
      </ComponentWrapper>
    );
  }

  return (
    <ComponentWrapper title={"State"}>
      <ul>
        {widgetStates &&
          Object.entries(widgetStates).map(([key, value]) => (
            <li key={key}>
              {key}: {JSON.stringify(value)}
            </li>
          ))}
      </ul>
    </ComponentWrapper>
  );
};

export default inject("stateStore", "widgetStore")(observer(StateSidebar));
