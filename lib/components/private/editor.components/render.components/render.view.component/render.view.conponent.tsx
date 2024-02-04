import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.view.component.module.scss";
import RenderWidget from "../render.widget.component/render.widget.component";
import {
  Widget,
  WidgetHierarchyMap,
} from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import {
  BASE_BREAKPOINTS,
  BASE_COLS,
} from "../../../../../globals/config/grid.layout.config";
import { getFilteredRootLevelWidgets } from "../../../../../globals/helpers/widget.helper";
import ViewStore from "../../../../../stores/view.store";
import WidgetStore from "../../../../../stores/widget.store";
import { inject, observer } from "mobx-react";
import { useMemo } from "react";
import "../../../../../styles/index.css";
interface RenderScreenProps {
  readonly?: boolean;
  widgets: Widget[];
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
}

const RenderView = ({
  widgets,
  readonly = true,
  widgetStore,
}: RenderScreenProps): JSX.Element => {
  const structuredWidgets = useMemo(() => {
    return widgetStore?.setInitialWidgetAndConvert(widgets);
  }, [widgetStore, widgets]);

  const rootLevelWidgets = getFilteredRootLevelWidgets(
    structuredWidgets as WidgetHierarchyMap
  );

  const preparedRootLevelWidgets = Array.from(rootLevelWidgets.values());

  // console.log("preparedRootLevelWidgets", preparedRootLevelWidgets);

  return (
    <GridLayout
      key={"top-level-grid"}
      content={rootLevelWidgets}
      rowHeight={30}
      breakpoints={BASE_BREAKPOINTS}
      cols={BASE_COLS}
      onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
    >
      {preparedRootLevelWidgets.map((rootLevelWidgets) => (
        <div
          key={rootLevelWidgets.widget.positioning.i}
          className={styles.widgetContainer}
        >
          <RenderWidget
            readonly={readonly}
            widgetToRender={rootLevelWidgets}
            // key={rootLevelWidgets.widget.positioning.i + i}
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default inject("viewStore", "widgetStore")(observer(RenderView));
