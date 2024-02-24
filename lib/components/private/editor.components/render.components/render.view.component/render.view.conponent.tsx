import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.view.component.module.scss";
import RenderWidget from "../render.widget.component/render.widget.component";
import {
  Widget,
  WidgetHierarchyMap,
} from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import { getFilteredRootLevelWidgets } from "../../../../../globals/helpers/widget.helper";
import ViewStore from "../../../../../stores/view.store";
import WidgetStore from "../../../../../stores/widget.store";
import { inject, observer } from "mobx-react";
import { useEffect, useMemo } from "react";
import { Query } from "../../../../../schemas/query.schemas/query.schema";
import QueryStore from "../../../../../stores/query.store";

interface RenderScreenProps {
  readonly?: boolean;
  widgets: Widget[];
  queries: Query[];
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
  showVisualWidgetOutline?: boolean;
}

const RenderView = ({
  widgets,
  readonly = true,
  widgetStore,
  showVisualWidgetOutline = false,
  queries,
  queryStore,
}: RenderScreenProps): JSX.Element => {
  // set initial queries to the query store
  useEffect(() => {
    queryStore?.setQueries(queries);
  }, [queries]);

  const structuredWidgets = useMemo(() => {
    return widgetStore?.setInitialWidgetAndConvert(widgets);
  }, [widgetStore, widgets]);

  const rootLevelWidgets = getFilteredRootLevelWidgets(
    structuredWidgets as WidgetHierarchyMap
  );

  const preparedRootLevelWidgets = Array.from(rootLevelWidgets.values());
  const selectedWidgetID = widgetStore?.getSelectedWidget()?.widget.widgetID;

  return (
    <GridLayout
      selectedWidgetID={selectedWidgetID}
      key={"top-level-grid"}
      content={rootLevelWidgets}
      onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
    >
      {preparedRootLevelWidgets.map((rootLevelWidgets) => (
        <div
          key={rootLevelWidgets.widget.positioning.i}
          className={styles.widgetContainer}
        >
          <RenderWidget
            showVisualWidgetOutline={showVisualWidgetOutline}
            readonly={readonly}
            widgetToRender={rootLevelWidgets}
            key={rootLevelWidgets.widget.positioning.i}
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default inject(
  "viewStore",
  "widgetStore",
  "queryStore"
)(observer(RenderView));
