import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import RenderWidget from "../render.widget.component/render.widget.component";
import { WidgetHierarchyMap } from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import { getFilteredRootLevelWidgets } from "../../../../../globals/helpers/widget.helper";
import ViewStore from "../../../../../stores/view.store";
import WidgetStore from "../../../../../stores/widget.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import { useEffect, useState } from "react";
import EditorStore from "../../../../../stores/editor.store";
import NavigationStore from "../../../../../stores/navigation.store";
import { NavigationActionType } from "../../../../../globals/interfaces/navigation.interface";

interface RenderViewProps {
  readonly?: boolean;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
  editorStore?: EditorStore;
  resourceStore?: ResourceStore;
  navigationStore?: NavigationStore;

  showVisualWidgetOutline?: boolean;
  viewToRender: string;
}

const RenderView = ({
  readonly = true,
  widgetStore,
  showVisualWidgetOutline = false,
  viewToRender,
  viewStore,
  editorStore,
  navigationStore,
}: RenderViewProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [structuredWidgets, setStructuredWidgets] = useState<
    WidgetHierarchyMap | undefined
  >(undefined);

  useEffect(() => {
    const initializeRenderView = async () => {
      if (viewToRender) {
        // set the viewID in the viewStore
        await viewStore?.intializeView(viewToRender);

        // Initialize navigation states for the current view
        navigationStore?.initializeCurrentNavigationStates({
          targetID: viewToRender,
          actionType: NavigationActionType.NAV_TO_VIEW,
        });

        await widgetStore?.initWidgetsAndProcess(viewToRender);
        const structuredData = widgetStore?.getStructuredData();
        setStructuredWidgets(structuredData);

        setIsLoading(false);
      }
    };

    initializeRenderView();
  }, [viewStore, viewToRender, widgetStore]);

  if (isLoading) {
    return <div></div>;
  }

  const rootLevelWidgets = getFilteredRootLevelWidgets(
    structuredWidgets as WidgetHierarchyMap
  );

  const preparedRootLevelWidgets = Array.from(rootLevelWidgets.values());
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;

  return (
    <GridLayout
      selectedWidgetID={selectedWidgetID}
      key={`top-level-grid-${preparedRootLevelWidgets?.length}`}
      content={rootLevelWidgets}
      onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
      readonly={readonly}
    >
      {preparedRootLevelWidgets.map((rootLevelWidgets) => {
        return (
          <div key={rootLevelWidgets.widget.positioning.i}>
            <RenderWidget
              showVisualWidgetOutline={showVisualWidgetOutline}
              readonly={readonly}
              widgetToRender={rootLevelWidgets}
              key={rootLevelWidgets.widget.positioning.i}
            />
          </div>
        );
      })}
    </GridLayout>
  );
};

export default inject(
  "viewStore",
  "widgetStore",
  "queryStore",
  "resourceStore",
  "editorStore",
  "navigationStore"
)(observer(RenderView));
