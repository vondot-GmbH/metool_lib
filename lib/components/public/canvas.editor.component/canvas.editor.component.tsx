import { inject, observer } from "mobx-react";
import MainLayout from "../../../layouts/main.layout/main.layout";
import { RenderView } from "../../../main";
import { Widget } from "../../../schemas/widget.schemas/widget.schema";
import ViewStore from "../../../stores/view.store";
import Column from "../../private/general.components/column.component/column.component";
import styles from "./canvas.editor.component.module.scss";
import WidgetStore from "../../../stores/widget.store";

interface CanvasEditorProps {
  widgets: Widget[];
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
}

const CanvasEditor = ({ widgets }: CanvasEditorProps): JSX.Element => {
  const _buildTopToolBar = (): JSX.Element => {
    return (
      <div className={styles.topBar}>
        <Column justifyContent="center">
          <p>Project Name</p>
        </Column>
      </div>
    );
  };

  const _buildCanvasConfigurationBar = (): JSX.Element => {
    return <div className={styles.canvasConfigurationBar}>_buildWidgetBar</div>;
  };

  const _buildTabBar = (): JSX.Element => {
    return <div className={styles.tabSideBar}></div>;
  };

  return (
    <MainLayout topBars={[_buildTopToolBar()]}>
      <MainLayout sideBars={[_buildTabBar(), _buildCanvasConfigurationBar()]}>
        <div className={styles.canvasWrapper}>
          <div className={styles.editorCanvasWrapper}>
            <div className={styles.screenWrapper}>
              <RenderView widgets={widgets} />
            </div>
          </div>
          <div className={styles.optionSidebar}>option sideBar</div>
        </div>
      </MainLayout>
    </MainLayout>
  );
};

export default inject("viewStore", "widgetStore")(observer(CanvasEditor));
