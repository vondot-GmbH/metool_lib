import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore from "../../../../../stores/state.store";
import { TextWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect, useState } from "react";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";

interface TextWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
}

const TextWidget = ({
  widgetID,
  widgetStore,
  stateStore,
}: TextWidgetProps): JSX.Element => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // stateStore?.initializeStates(widgetID, _getInitialTextWidgetState());
  }, [widgetID]);

  useEffect(() => {
    const widgetOptions = widgetStore?.getAllOptionsForWidget(widgetID);

    stateStore?.initializeDynamicOptions(widgetOptions, (updatedOptions) => {
      setDisplayText(updatedOptions?.data);
    });
  }, [widgetID, stateStore]);

  return <RunningText>{displayText?.toString()}</RunningText>;
};

const _getInitialTextWidgetState = (): TextWidgetState => {
  const textState = {
    disabled: null,
    hidden: null,
    isLoading: null,
    data: "initialData",
  } as TextWidgetState;

  return textState as TextWidgetState;
};

export default inject("widgetStore", "stateStore")(observer(TextWidget));
