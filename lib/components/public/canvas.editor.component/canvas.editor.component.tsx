import { inject, observer } from "mobx-react";
import MainLayout from "../../../layouts/main.layout/main.layout";
import { RenderView } from "../../../main";
import { Widget } from "../../../schemas/widget.schemas/widget.schema";
import ViewStore from "../../../stores/view.store";
import styles from "./canvas.editor.component.module.scss";
import WidgetStore from "../../../stores/widget.store";
import { ChangeRecord } from "../../../globals/interfaces/change.record.interface";
import ChangeRecordStore from "../../../stores/change.record.store";
import { useEffect } from "react";
import EditorStore from "../../../stores/editor.store";
import ResizableScreenWrapper from "../../private/editor.components/resizable.screen.wrapper.component/resizable.screen.wrapper.component";
import { EditorMode } from "../../../globals/enums/editor.enum";
import OptionSidebar, {
  SidebarProvider,
} from "../../private/editor.components/option.sidebar.component/option.sidebar.component";
import StateStore from "../../../stores/state.store";
import QueryStore from "../../../stores/query.store";
import { Query } from "../../../schemas/query.schemas/query.schema";
import ConfigurationSidebar from "../../private/editor.components/editor.configuration.bar.components/configuration.sidebar.component/configuration.sidebar.component";
import TopBarComponent from "../../private/editor.components/top.bar.component/top.bar.component";
import ResourceStore from "../../../stores/resource.store";

interface CanvasEditorProps {
  widgets: Widget[];
  queries: Query[];
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  changeRecordStore?: ChangeRecordStore;
  editorStore?: EditorStore;
  stateStore?: StateStore;
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;

  onSaveChanges?: (changeRecords: ChangeRecord[]) => void;
}

const CanvasEditor = ({
  widgets,
  onSaveChanges,
  editorStore,
  queries,
}: CanvasEditorProps): JSX.Element => {
  const editorMode = editorStore?.editorMode;
  const readonly = editorMode == EditorMode.PREVIEW;
  const showVisualWidgetOutline = editorStore?.visualWidgetOutlineGuideState;

  useEffect(() => {
    // calculate the initial breakpoint configuration (minWidth, maxWidth, defaultWidth) for each breakpoint
    editorStore?.initializeEditorBreakpointConfig();
  }, []);

  return (
    <MainLayout topBars={[<TopBarComponent onSaveChanges={onSaveChanges} />]}>
      <MainLayout sideBars={[<ConfigurationSidebar />]}>
        <SidebarProvider>
          <div className={styles.canvasWrapper}>
            <div className={styles.editorCanvasWrapper}>
              <ResizableScreenWrapper>
                <RenderView
                  queries={queries}
                  widgets={widgets}
                  readonly={readonly}
                  showVisualWidgetOutline={showVisualWidgetOutline}
                />
              </ResizableScreenWrapper>
            </div>
            <OptionSidebar />
          </div>
        </SidebarProvider>
      </MainLayout>
    </MainLayout>
  );
};

export default inject(
  "viewStore",
  "widgetStore",
  "changeRecordStore",
  "editorStore",
  "stateStore",
  "queryStore",
  "resourceStore"
)(observer(CanvasEditor));
