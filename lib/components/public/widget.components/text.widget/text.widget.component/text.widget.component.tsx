import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore from "../../../../../stores/state.store";
import { TextWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect } from "react";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import { TextWidgetOptions } from "../schemas/text.widget.schema";

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
  useEffect(() => {
    stateStore?.initializeWidgetStates(widgetID, _getInitialTextWidgetState());
  }, [widgetID]);

  const textWidgetOptions: TextWidgetOptions =
    widgetStore?.getAllOptionsForWidget(widgetID);

  return <RunningText>{textWidgetOptions.data}</RunningText>;
};

const _getInitialTextWidgetState = (): TextWidgetState => {
  const textState = {
    disabled: null,
    hidden: null,
    isLoading: null,
    data: "",
  } as TextWidgetState;

  return textState as TextWidgetState;
};

export default inject("widgetStore", "stateStore")(observer(TextWidget));
