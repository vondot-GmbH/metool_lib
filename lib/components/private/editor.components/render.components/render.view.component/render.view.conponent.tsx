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

interface RenderScreenProps {
  readonly?: boolean;
  widgets: Widget[];
}

const RenderView = ({ widgets, readonly }: RenderScreenProps): JSX.Element => {
  // TODO: save all structuredWidgets for all levels in a the store
  const structuredWidgets = structureWidgetsHierarchy(widgets);

  const rootLevelWidgets = getFilteredRootLevelWidgets(structuredWidgets);
  const preparedRootLevelWidgets = Array.from(rootLevelWidgets.values());

  return (
    <GridLayout
      key={"top-level-grid"}
      content={rootLevelWidgets}
      rowHeight={46}
      breakpoints={BASE_BREAKPOINTS}
      cols={BASE_COLS}
    >
      {preparedRootLevelWidgets.map((rootLevelWidgets) => (
        <div
          key={rootLevelWidgets.widget.positioning.i}
          className={styles.widgetContainer}
        >
          <RenderWidget
            readonly={readonly}
            widget={rootLevelWidgets}
            allWidgets={structuredWidgets}
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default RenderView;
