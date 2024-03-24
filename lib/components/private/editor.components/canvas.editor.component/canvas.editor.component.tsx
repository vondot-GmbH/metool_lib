import { inject, observer } from "mobx-react";
import MainLayout from "../../../../layouts/main.layout/main.layout";
import ViewStore from "../../../../stores/view.store";
import styles from "./canvas.editor.component.module.scss";
import WidgetStore from "../../../../stores/widget.store";
import ChangeRecordStore from "../../../../stores/change.record.store";
import { useEffect, useMemo, useState } from "react";
import EditorStore from "../../../../stores/editor.store";
import ResizableScreenWrapper from "../resizable.screen.wrapper.component/resizable.screen.wrapper.component";
import { EditorMode } from "../../../../globals/enums/editor.enum";
import OptionSidebar, {
  SidebarProvider,
} from "../option.sidebar.component/option.sidebar.component";
import StateStore from "../../../../stores/state.store";
import QueryStore from "../../../../stores/query.store";
import ConfigurationSidebar from "../editor.configuration.bar.components/configuration.sidebar.component/configuration.sidebar.component";
import TopBarComponent from "../top.bar.component/top.bar.component";
import ResourceStore from "../../../../stores/resource.store";
import RenderPage from "../../../private/editor.components/render.components/render.page.component/render.page.component";
import PageStore from "../../../../stores/page.store";

interface CanvasEditorProps {
  pageToRender: string;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  changeRecordStore?: ChangeRecordStore;
  editorStore?: EditorStore;
  stateStore?: StateStore;
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  pageStore?: PageStore;
}

const CanvasEditor = ({
  editorStore,
  pageToRender: initialPageToRender,
  pageStore,
  resourceStore,
  queryStore,
}: CanvasEditorProps): JSX.Element => {
  const [pageToRender, setPageToRender] = useState(initialPageToRender);

  const editorMode = editorStore?.editorMode;
  const readonly = editorMode == EditorMode.PREVIEW;
  const showVisualWidgetOutline = editorStore?.visualWidgetOutlineGuideState;

  useEffect(() => {
    setPageToRender(initialPageToRender);
  }, [initialPageToRender]);

  useEffect(() => {
    if (pageStore?.currentPageToRender?.pageID) {
      setPageToRender(pageStore.currentPageToRender.pageID);
    }
  }, [pageStore?.currentPageToRender]);

  useEffect(() => {
    // set core data for the editor
    resourceStore?.intializeResources();
    queryStore?.intializeQueries();

    // calculate the initial breakpoint configuration (minWidth, maxWidth, defaultWidth) for each breakpoint
    editorStore?.initializeEditorBreakpointConfig();

    // TODO adding logic to all detail method bevore fetch data look if the data is already in the store
    // fetch all available pages
    pageStore?.fetchAllPagesAndSave();
  }, []);

  return (
    <MainLayout topBars={[<TopBarComponent />]}>
      <MainLayout sideBars={[<ConfigurationSidebar />]}>
        <SidebarProvider>
          <div className={styles.canvasWrapper}>
            <div className={styles.editorCanvasWrapper}>
              <ResizableScreenWrapper>
                <RenderPage
                  pageToRender={pageToRender}
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
  "resourceStore",
  "pageStore"
)(observer(CanvasEditor));
