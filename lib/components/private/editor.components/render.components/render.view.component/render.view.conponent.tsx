import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.view.component.module.scss";
import RenderWidget from "../render.widget.component/render.widget.component";
import { Widget } from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import {
  BASE_BREAKPOINTS,
  BASE_COLS,
} from "../../../../../globals/config/grid.layout.config";
import {
  getFilteredRootLevelWidgets,
  structureWidgetsHierarchy,
} from "../../../../../globals/helpers/widget.helper";
import ViewStore from "../../../../../stores/view.store";
import WidgetStore from "../../../../../stores/widget.store";
import { inject, observer } from "mobx-react";

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
  const structuredWidgets = structureWidgetsHierarchy(widgets);
  widgetStore?.setInitialStructuredWidgetHierarchyMap(structuredWidgets);

  // TODO store data in state ???
  const rootLevelWidgets = getFilteredRootLevelWidgets(structuredWidgets);
  const preparedRootLevelWidgets = Array.from(rootLevelWidgets.values());

  return (
    <GridLayout
      key={"top-level-grid"}
      content={rootLevelWidgets}
      rowHeight={46}
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
            allWidgets={structuredWidgets}
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default inject("viewStore", "widgetStore")(observer(RenderView));
