import { inject, observer } from "mobx-react";
import MainLayout from "../../../layouts/main.layout/main.layout";
import { RenderView } from "../../../main";
import { Widget } from "../../../schemas/widget.schemas/widget.schema";
import ViewStore from "../../../stores/view.store";
import Column from "../../private/general.components/column.component/column.component";
import styles from "./canvas.editor.component.module.scss";
import WidgetStore from "../../../stores/widget.store";
import { ChangeRecord } from "../../../globals/interfaces/change.record.interface";
import ChangeRecordStore from "../../../stores/change.record.store";
import Row from "../../private/general.components/row.component/row.component";

interface CanvasEditorProps {
  widgets: Widget[];
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  changeRecordStore?: ChangeRecordStore;
  onSaveChanges?: (changeRecords: ChangeRecord[]) => void;
}

const CanvasEditor = ({
  changeRecordStore,
  widgets,
  widgetStore,
  onSaveChanges,
}: CanvasEditorProps): JSX.Element => {
  const handleOnSaveChanges = () => {
    if (changeRecordStore && onSaveChanges) {
      console.log("handleOnSaveChanges");
      widgetStore?.exportWidgetDataForTesting();

      const changes = changeRecordStore?.processReleaseChanges();

      if (changes && changes.length != 0) onSaveChanges(changes);
    }
  };

  const _buildTopToolBar = (): JSX.Element => {
    return (
      <Row className={styles.topBar} alignItems="center">
        <Column justifyContent="flex-start">
          <p>Project Name </p>
        </Column>
        <Column justifyContent="flex-start">
          <button onClick={() => handleOnSaveChanges()}>Save Changes</button>
        </Column>
      </Row>
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

export default inject(
  "viewStore",
  "widgetStore",
  "changeRecordStore"
)(observer(CanvasEditor));
