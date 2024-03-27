import { inject, observer } from "mobx-react";
import StateStore, { StateSelector } from "../../../../../stores/state.store";
import WidgetStore from "../../../../../stores/widget.store";
import ComponentWrapper from "../../../general.components/component.wrapper.component/component.wrapper.component";
import SelectDropDown from "../../../general.components/select.dropdown.component/select.dropdown.component";
import { useEffect, useState } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import ResizableSidebar from "../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import { faCode, faTable } from "@fortawesome/pro-light-svg-icons";

interface StateSidebarProps {
  stateStore?: StateStore;
  widgetStore?: WidgetStore; // TODO check if needed
}

const StateSidebar = ({ stateStore }: StateSidebarProps): JSX.Element => {
  const [preparedWidgets, setPreparedWidgets] = useState<any[] | undefined>(
    undefined
  );

  const [selectedWidgetState, setSelectedWidgetState] = useState<
    Record<string, any> | undefined
  >(undefined);

  useEffect(() => {
    initialize();
  }, []);

  const getStateIcon = (selector: StateSelector) => {
    switch (selector) {
      case StateSelector.WIDGETS:
        return faTable;
      case StateSelector.QUERIES:
        return faCode;
      default:
        return faCode;
    }
  };

  const initialize = async () => {
    const stateSummary = stateStore?.getStateSummary();
    const preparedItems = stateSummary?.flatMap((category) =>
      category?.entities?.map((entity) => ({
        label: `${entity.label}`,
        value: `${category.category}.${entity.id}`,
        icon: getStateIcon(category.category as StateSelector),
      }))
    );

    setPreparedWidgets(preparedItems);
  };

  // handle selection change and get the state for the selected entity
  const handleSelectionChange = (selectedItem: any) => {
    const [selector, entityId] = selectedItem.value.split(".");
    const selectedStates = stateStore?.getStatesForEntity(selector, entityId);
    setSelectedWidgetState(selectedStates);
  };

  if (!preparedWidgets) {
    return (
      <ComponentWrapper title={"State"}>
        <p>No widgets available</p>
      </ComponentWrapper>
    );
  }

  return (
    <ResizableSidebar initialWidth={330} minWidth={200} maxWidth={450}>
      <ComponentWrapper title={"State"}>
        <SelectDropDown
          items={preparedWidgets}
          onChange={(item) => {
            if (!item?.value) return;
            handleSelectionChange(item);
          }}
          placeholder={"Select Entity"}
        />

        {selectedWidgetState && (
          <JsonView
            src={selectedWidgetState}
            enableClipboard={false}
            dark={true}
            theme="vscode"
          />
        )}
      </ComponentWrapper>
    </ResizableSidebar>
  );
};

export default inject("stateStore", "widgetStore")(observer(StateSidebar));
