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
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const analized = widgetStore?.getAnalyzedWidgetOptions(widgetID);
    if (!analized) return;

    stateStore?.initializeDynamicOptions(
      widgetID,
      analized,
      (options) => {
        setData(options?.data);
      },
      _getInitialTextWidgetState()
    );
  }, []);

  return (
    <div>
      <RunningText>{JSON.stringify(data ?? "no data")}</RunningText>
    </div>
  );
};

const _getInitialTextWidgetState = (): TextWidgetState => {
  const textState = {
    isLoading: null,
  } as TextWidgetState;

  return textState as TextWidgetState;
};

export default inject("widgetStore", "stateStore")(observer(TextWidget));
