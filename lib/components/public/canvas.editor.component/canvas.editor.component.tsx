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
import { useEffect, useState } from "react";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons/faSquarePlus";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons/faXmarkCircle";
import Headline from "../../private/general.components/text.components/headline.component/headline.component";
import WidgetSidebar from "../../private/editor.components/editor.bar.components/widget.sidebar.component/widget.sidebar.component";
import StateSidebar from "../../private/editor.components/editor.bar.components/state.sidebar.component/state.sidebar.component";
import SizedContainer from "../../private/general.components/sized.container.component/sized.container.component";
import FilledButton from "../../private/general.components/filled.button.component/filled.button.component";
import EditorStore from "../../../stores/editor.store";
import BreakpointSettings from "../../private/editor.components/breakpoint.settings.component/breakpoint.settings.component";
import ResizableScreenWrapper from "../../private/editor.components/resizable.screen.wrapper.component/resizable.screen.wrapper.component";

interface CanvasEditorProps {
  widgets: Widget[];
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  changeRecordStore?: ChangeRecordStore;
  editorStore?: EditorStore;
  onSaveChanges?: (changeRecords: ChangeRecord[]) => void;
}

const CanvasEditor = ({
  changeRecordStore,
  widgets,
  widgetStore,
  onSaveChanges,
  editorStore,
}: CanvasEditorProps): JSX.Element => {
  const [selectedConfigurationBar, setSelectedConfigurationBar] =
    useState<string>("Widgets");

  useEffect(() => {
    // calculate the initial breakpoint configuration (minWidth, maxWidth, defaultWidth) for each breakpoint
    editorStore?.initializeEditorBreakpointConfig();
  }, []);

  // TODO
  const handleOnSaveChanges = () => {
    if (changeRecordStore && onSaveChanges) {
      // const changes = changeRecordStore?.processReleaseChanges();

      // if (changes && changes.length != 0) onSaveChanges(changes);

      const widget = widgetStore?.getStructuredData();
      console.log(JSON.stringify(widget, null, 2));
    }
  };

  const _buildTopToolBar = (): JSX.Element => {
    return (
      <Row className={styles.topBar} alignItems="center">
        <Column justifyContent="flex-start">
          <Headline className="ml-20">Project Name</Headline>
        </Column>

        <BreakpointSettings />

        <Column alignItems="flex-end">
          <SizedContainer size="s">
            <FilledButton
              label="export changes"
              onClick={handleOnSaveChanges}
            />
          </SizedContainer>
        </Column>
      </Row>
    );
  };

  const _buildCanvasConfigurationBar = (): JSX.Element | null => {
    let sidebarToRender: JSX.Element | null = null;

    if (selectedConfigurationBar == "Widgets") {
      sidebarToRender = <WidgetSidebar />;
    } else if (selectedConfigurationBar == "States") {
      sidebarToRender = <StateSidebar />;
    }

    return (
      <ResizableSidebar initialWidth={230} minWidth={150} maxWidth={330}>
        {sidebarToRender}
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
            name: "Widgets",
          },
          {
            icon: faXmarkCircle,
            name: "States",
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
            <ResizableScreenWrapper>
              <RenderView widgets={widgets} readonly={false} />
            </ResizableScreenWrapper>
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
  "changeRecordStore",
  "editorStore"
)(observer(CanvasEditor));
