import { makeAutoObservable } from "mobx";
import ConfigProvider from "../config/config.provider";
import { EditorMode } from "../globals/enums/editor.enum";
import RootStore from "./root.store";
import { PreparedBreakpointConfig } from "../globals/interfaces/config.interface";
import { WidgetContextMenu } from "../globals/interfaces/widget.state.interface";
import {
  WidgetHierarchy,
  WidgetHierarchyLocation,
} from "../schemas/widget.schemas/widget.schema";

class EditorStore {
  private _currentBreakpoint: string = "medium"; // TODO consider this when set init current screen width

  // for each breakpoint key and values with min, max
  private _breakpointEditorConfig: Record<string, PreparedBreakpointConfig> =
    {};

  private _mode: EditorMode = EditorMode.EDIT;

  private _visualWidgetOutlineGuide: boolean = false;

  private _currentScreenWidth: number = 440; // TODO calculate the initial width based on the layout config

  private _selectedWidget: WidgetHierarchy | undefined;

  private _widgetContextMenu: WidgetContextMenu = {
    isOpen: false,
    anchorPoint: { x: 0, y: 0 },
    selectedWidgetID: null,
  };

  // @ts-ignore
  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter
  setCurrentBreakpoint = (breakpoint: string): void => {
    this._currentBreakpoint = breakpoint;
  };

  changeEditorMode(mode: EditorMode) {
    this._mode = mode;
  }

  setVisualWidgetOutlineGuide = (value: boolean) => {
    this._visualWidgetOutlineGuide = value;
  };

  setCurrentScreenWidth(width: number) {
    this._currentScreenWidth = width;
  }

  setSelectWidget(
    widgetID: string | undefined,
    location?: WidgetHierarchyLocation
  ): void {
    if (widgetID == null) {
      this._selectedWidget = undefined;
      return;
    }

    if (location == WidgetHierarchyLocation.LAYOUT_AREA) {
      this._selectedWidget =
        this.stores?.layoutStore?.getLayoutAreaWidget(widgetID);
    } else {
      this.stores?.widgetStore?.getStructuredWidget(widgetID);
    }
  }

  setWidgetContextMenu(contextMenu: WidgetContextMenu): void {
    this._widgetContextMenu = contextMenu;
  }

  //! Getter

  get currentScreenWidth(): number {
    return this._currentScreenWidth;
  }

  get currentBreakpoint(): string {
    return JSON.parse(JSON.stringify(this._currentBreakpoint));
  }

  get breakpointEditorConfigForCurrentBreakpoint(): PreparedBreakpointConfig {
    return this._breakpointEditorConfig[this._currentBreakpoint];
  }

  get breakpointEditorConfig(): Record<string, PreparedBreakpointConfig> {
    return this._breakpointEditorConfig;
  }

  get editorMode(): EditorMode {
    return this._mode;
  }

  get visualWidgetOutlineGuideState(): boolean {
    return this._visualWidgetOutlineGuide;
  }

  get selectedWidget(): WidgetHierarchy | undefined {
    if (this._selectedWidget == null) {
      return;
    }

    return this._selectedWidget;
  }

  // TODO is parse necessary?
  get widgetContextMenu(): WidgetContextMenu {
    return JSON.parse(JSON.stringify(this._widgetContextMenu));
  }

  // calculate the max and min width for each breakpoint based on the layout config
  initializeEditorBreakpointConfig() {
    const layoutConfig = ConfigProvider.getInstance().getLayoutConfig();
    const rootConfig = layoutConfig.root;

    const newConfig = {} as any;

    // convert the layout config to a format that is easier to use in the editor component
    const sortedBreakpoints = Object.entries(rootConfig).sort(
      (a, b) => a[1].breakpoint - b[1].breakpoint
    );

    sortedBreakpoints.forEach(([breakpoint], index) => {
      // for the first breakpoint, the min width is null
      const minWidth =
        index === 0 ? null : sortedBreakpoints[index - 1][1].breakpoint;

      // calculate the max width for the current breakpoint by taking the next breakpoint and subtracting 1
      const maxWidth =
        index === sortedBreakpoints.length - 1
          ? null
          : sortedBreakpoints[index + 1][1].breakpoint - 1;

      newConfig[breakpoint] = { minWidth, maxWidth };
    });

    this._breakpointEditorConfig = newConfig;
  }
}

export default EditorStore;
