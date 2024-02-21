import { inject, observer } from "mobx-react";
import StateStore from "../../../../../stores/state.store";
import WidgetStore from "../../../../../stores/widget.store";
import ComponentWrapper from "../../../general.components/component.wrapper.component/component.wrapper.component";
import SelectDropDown from "../../../general.components/select.dropdown.component/select.dropdown.component";
import { useEffect, useMemo, useState } from "react";
import { WidgetHierarchy } from "../../../../../schemas/widget.schemas/widget.schema";

interface StateSidebarProps {
  stateStore?: StateStore;
  widgetStore?: WidgetStore;
}

const StateSidebar = ({
  stateStore,
  widgetStore,
}: StateSidebarProps): JSX.Element => {
  const widgets = widgetStore?.getStructuredData();

  const [preparedWidgets, setPreparedWidgets] = useState<any[] | undefined>(
    undefined
  );

  const [selectedWidgetID, setSelectedWidgetID] = useState<string | undefined>(
    undefined
  );

  const [selectedWidgetState, setSelectedWidgetState] = useState<
    Record<string, any> | undefined
  >(undefined);

  // TODO -- fix the problem that the states will be rerendered when the widget is
  const widgetStates = useMemo(() => {
    const widgetStates = stateStore?.getAllWidgetStates(selectedWidgetID);
    return widgetStates;
  }, [selectedWidgetID, stateStore]);

  useEffect(() => {
    if (!selectedWidgetID) return;

    setSelectedWidgetState(widgetStates);
  }, [selectedWidgetID]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    if (!widgets) return;

    const widgetsArray = Array.from(widgets.values());
    const prepared = widgetsArray.map((widgetHierarchy: WidgetHierarchy) => ({
      label: widgetHierarchy.widget.widgetType,
      value: widgetHierarchy.widget.widgetID,
    }));

    setPreparedWidgets(prepared);
  };

  if (!preparedWidgets) {
    return (
      <ComponentWrapper title={"State"}>
        <p>No widgets available</p>
      </ComponentWrapper>
    );
  }

  return (
    <ComponentWrapper title={"State"}>
      <SelectDropDown
        items={preparedWidgets}
        onChange={(item) => {
          if (!item?.value) return;
          setSelectedWidgetID(item.value);
        }}
        placeholder={"Select Widget"}
      />

      {selectedWidgetState && (
        <div>
          <h3>State</h3>
          <pre>{JSON.stringify(selectedWidgetState, null, 2)}</pre>
        </div>
      )}
    </ComponentWrapper>
  );
};

export default inject("stateStore", "widgetStore")(observer(StateSidebar));
