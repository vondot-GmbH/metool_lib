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
import WidgetSidebar from "../../private/editor.components/editor.bar.components/widget.sidebar.component/widget.sidebar.component";
import StateSidebar from "../../private/editor.components/editor.bar.components/state.sidebar.component/state.sidebar.component";
import SizedContainer from "../../private/general.components/sized.container.component/sized.container.component";
import EditorStore from "../../../stores/editor.store";
import BreakpointSettings from "../../private/editor.components/breakpoint.settings.component/breakpoint.settings.component";
import ResizableScreenWrapper from "../../private/editor.components/resizable.screen.wrapper.component/resizable.screen.wrapper.component";
import TitleText from "../../private/general.components/text.components/title.text.component/title.text.component";
import { EditorMode } from "../../../globals/enums/editor.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPlayCircle,
} from "@fortawesome/free-regular-svg-icons";
import CollapsibleSection from "../../private/general.components/collapsible.section.component/collapsible.section.component";
import RunningText from "../../private/general.components/text.components/running.text.component/running.text.component";

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
  const editorMode = editorStore?.editorMode;
  const readonly = editorMode == EditorMode.PREVIEW;
  const showVisualWidgetOutline = editorStore?.visualWidgetOutlineGuideState;

  const [selectedConfigurationBar, setSelectedConfigurationBar] =
    useState<string>("Widgets");

  useEffect(() => {
    // calculate the initial breakpoint configuration (minWidth, maxWidth, defaultWidth) for each breakpoint
    editorStore?.initializeEditorBreakpointConfig();
  }, []);

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOnSaveChanges = () => {
    if (changeRecordStore && onSaveChanges) {
      // const changes = changeRecordStore?.processReleaseChanges();

      const widgetss = widgetStore?.exportWidgetsTEST();

      console.log(widgetss);

      // if (changes && changes.length != 0) onSaveChanges(changes);

      const widget = widgetStore?.getStructuredData();
      console.log(JSON.stringify(widget, null, 2));
    }
  };

  const _buildTopToolBar = (): JSX.Element => {
    return (
      <Row
        className={styles.topBar}
        alignItems="center"
        justifyContent="space-between"
      >
        <SizedContainer size="s">
          <Column justifyContent="flex-start">
            <TitleText className="ml-20">Project Name</TitleText>
          </Column>
        </SizedContainer>
        <BreakpointSettings />

        <SizedContainer size="s">
          <Column alignItems="flex-end">
            <Column alignItems="center">
              <FontAwesomeIcon
                icon={
                  editorMode == EditorMode.EDIT ? faPlayCircle : faCircleXmark
                }
                size="lg"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // TODO make this more pretty
                  const mode =
                    editorMode == EditorMode.EDIT
                      ? EditorMode.PREVIEW
                      : EditorMode.EDIT;
                  editorStore?.changeEditorMode(mode);
                  widgetStore?.setSelectWidget(undefined);
                  handleOnSaveChanges();
                }}
              />
            </Column>
          </Column>
        </SizedContainer>
      </Row>
    );
  };

  const _buildCanvasConfigurationBar = (): JSX.Element | null => {
    if (editorStore?.editorMode != EditorMode.EDIT) {
      return null;
    }

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

  const _buildTabBar = (): JSX.Element | null => {
    if (editorStore?.editorMode != EditorMode.EDIT) {
      return null;
    }

    return (
      <IconTabBar
        style={{ borderRight: "1px solid #e0e0e0" }} // TODO
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

  const _buildOptionSidebar = (): JSX.Element | null => {
    if (editorStore?.editorMode != EditorMode.EDIT) {
      return null;
    }

    return (
      <div className={styles.optionSidebar}>
        <RunningText>
          {widgetStore?.getSelectedWidget()?.widget.widgetID ??
            "No widget selected"}
        </RunningText>

        <CollapsibleSection title="Content">
          <RunningText>option</RunningText>
        </CollapsibleSection>

        <CollapsibleSection title="Interaction">
          <RunningText>option</RunningText>
        </CollapsibleSection>

        <CollapsibleSection title="Appearance">
          <RunningText>option</RunningText>
        </CollapsibleSection>
      </div>
    );
  };

  return (
    <MainLayout topBars={[_buildTopToolBar()]}>
      <MainLayout sideBars={[_buildTabBar(), _buildCanvasConfigurationBar()]}>
        <div className={styles.canvasWrapper}>
          <div className={styles.editorCanvasWrapper}>
            <ResizableScreenWrapper>
              <RenderView
                widgets={widgets}
                readonly={readonly}
                showVisualWidgetOutline={showVisualWidgetOutline}
              />
            </ResizableScreenWrapper>
          </div>
          {_buildOptionSidebar()}
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
