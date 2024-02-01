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
import ResizableSidebar from "../../private/general.components/resizable.sidbear.component/resizable.sidebar.component";
import IconTabBar from "../../private/general.components/icon.tab.bar.component/icon.tab.bar.component";
import { useState } from "react";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons/faSquarePlus";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons/faXmarkCircle";
import ComponentWrapper from "../../private/general.components/component.wrapper.component/component.wrapper.component";
import Headline from "../../private/general.components/text.components/headline.component/headline.component";
import WidgetSidebar from "../../private/editor.components/editor.bar.components/widget.sidebar.component/widget.sidebar.component";

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
  const [selectedConfigurationBar, setSelectedConfigurationBar] =
    useState<string>("WIDGETS");

  // TODO
  const handleOnSaveChanges = () => {
    if (changeRecordStore && onSaveChanges) {
      widgetStore?.exportWidgetDataForTesting();

      const changes = changeRecordStore?.processReleaseChanges();

      if (changes && changes.length != 0) onSaveChanges(changes);
    }
  };

  const _buildTopToolBar = (): JSX.Element => {
    return (
      <Row className={styles.topBar} alignItems="center">
        <Column justifyContent="flex-start">
          <Headline>Project Name</Headline>
        </Column>
        <Column justifyContent="flex-start">
          <button onClick={() => handleOnSaveChanges()}>Save Changes</button>
        </Column>
      </Row>
    );
  };

  const _buildCanvasConfigurationBar = (): JSX.Element | null => {
    return (
      <ResizableSidebar initialWidth={230} minWidth={150}>
        <ComponentWrapper title="Widgets">
          <WidgetSidebar />
        </ComponentWrapper>
      </ResizableSidebar>
    );
  };

  const _buildTabBar = (): JSX.Element => {
    return (
      <IconTabBar
        style={{ borderRight: "1px solid #e0e0e0" }}
        tabs={[
          {
            icon: faSquarePlus,
            name: "WIDGETS",
          },
          {
            icon: faXmarkCircle,
            name: "test2",
          },
        ]}
        onSelect={(name: string) => {
          setSelectedConfigurationBar(name);
        }}
        selected={selectedConfigurationBar}
      />
    );
  };

  return (
    <MainLayout topBars={[_buildTopToolBar()]}>
      <MainLayout sideBars={[_buildTabBar(), _buildCanvasConfigurationBar()]}>
        <div className={styles.canvasWrapper}>
          <div className={styles.editorCanvasWrapper}>
            <div className={styles.screenWrapper}>
              <RenderView widgets={widgets} readonly={false} />
            </div>
          </div>
          <div className={styles.optionSidebar}>
            {widgetStore?.getSelectedWidget()?.widget.widgetID}
          </div>
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
