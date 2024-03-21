import ViewStore from "../../../../../stores/view.store";
import WidgetStore from "../../../../../stores/widget.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import EditorStore from "../../../../../stores/editor.store";
import MainLayout from "../../../../../layouts/main.layout/main.layout";
import RenderView from "../render.view.component/render.view.conponent";
import RunningText from "../../../general.components/text.components/running.text.component/running.text.component";

interface RenderPageProps {
  readonly?: boolean;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
  editorStore?: EditorStore;
  resourceStore?: ResourceStore;

  showVisualWidgetOutline?: boolean;
  viewToRender: string;
}

const RenderPage = ({
  viewToRender,
  readonly = true,
  showVisualWidgetOutline = false,
}: RenderPageProps): JSX.Element => {
  const buildTopBar = () => {
    return (
      <div>
        <RunningText> render bar</RunningText>
        <RunningText> render bar</RunningText>
      </div>
    );
  };

  return (
    <MainLayout topBars={[buildTopBar()]} sideBars={[buildTopBar()]}>
      <RenderView
        viewToRender={viewToRender}
        readonly={readonly}
        showVisualWidgetOutline={showVisualWidgetOutline}
      />
    </MainLayout>
  );
};

export default inject(
  "viewStore",
  "widgetStore",
  "queryStore",
  "resourceStore",
  "editorStore"
)(observer(RenderPage));
