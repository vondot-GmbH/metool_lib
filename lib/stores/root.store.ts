import ChangeRecordStore from "./change.record.store";
import EditorStore from "./editor.store";
import PageStore from "./page.store";
import QueryStore from "./query.store";
import ResourceStore from "./resource.store";
import StateStore from "./state.store";
import ViewStore from "./view.store";
import WidgetStore from "./widget.store";

class RootStore {
  pageStore: PageStore;
  viewStore: ViewStore;
  widgetStore: WidgetStore;
  changeRecordStore: ChangeRecordStore;
  editorStore: EditorStore;
  stateStore: StateStore;
  queryStore: QueryStore;
  resourceStore: ResourceStore;

  constructor() {
    this.pageStore = new PageStore(this);
    this.viewStore = new ViewStore(this);
    this.widgetStore = new WidgetStore(this);
    this.changeRecordStore = new ChangeRecordStore(this);
    this.editorStore = new EditorStore(this);
    this.stateStore = new StateStore(this);
    this.queryStore = new QueryStore(this);
    this.resourceStore = new ResourceStore(this);
  }
}

export default RootStore;
