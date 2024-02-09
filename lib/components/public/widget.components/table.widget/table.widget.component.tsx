import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../stores/widget.store";
import StateStore from "../../../../stores/state.store";
import { TableWidgetState } from "../../../../globals/interfaces/widget.state.interface";
import FilledButton from "../../../private/general.components/filled.button.component/filled.button.component";
import { useEffect } from "react";

interface TableWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
}

const TableWidget: React.FC<TableWidgetProps> = ({
  widgetID,
  widgetStore,
  stateStore,
}): JSX.Element => {
  console.log("widgetStore");
  console.log(widgetStore);

  useEffect(() => {
    stateStore?.initializeWidgetStates(widgetID, _getInitialTableWidgetState());
  }, []);

  return (
    <div>
      Table Widget {widgetID}{" "}
      <FilledButton
        label="selectItem"
        onClick={(e) => {
          e.preventDefault();
          stateStore?.setWidgetStateValue(widgetID, "selectedItem", {
            _id: "1",
            name: "item1",
          });
        }}
      />
      <FilledButton
        label="sub"
        onClick={(e) => {
          e.preventDefault();
          stateStore?.subscribeToWidgetStateValue(
            "customerDataTableRoot",
            "selectedItem",
            (value) => {
              console.log("subscribed value ----- change", value);
            }
          );
        }}
      />
    </div>
  );
};

const _getInitialTableWidgetState = (): TableWidgetState => {
  return {
    disabled: null,
    hidden: null,
    isLoading: null,
    selectedItem: null,
  } as TableWidgetState;
};

export default inject("widgetStore", "stateStore")(observer(TableWidget));
