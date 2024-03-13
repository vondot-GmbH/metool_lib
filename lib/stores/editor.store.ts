import { makeAutoObservable } from "mobx";
import ConfigProvider from "../config/config.provider";
import { EditorMode } from "../globals/enums/editor.enum";
import RootStore from "./root.store";

class EditorStore {
  private _currentBreakpoint: string = "";

  // for each breakpoint key and values with min, max
  private _breakpointEditorConfig: {
    [key: string]: { minWidth: number | null; maxWidth: number | null };
  } = {};

  private _currentScreenWidth: number = 0;

  private _mode: EditorMode = EditorMode.EDIT;

  private _visualWidgetOutlineGuide: boolean = false;

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

  setCurrentScreenWidth(width: number) {
    this._currentScreenWidth = width;
  }

  changeEditorMode(mode: EditorMode) {
    this._mode = mode;
  }

  setVisualWidgetOutlineGuide = (value: boolean) => {
    this._visualWidgetOutlineGuide = value;
  };

  //! Getter

  get currentScreenWidth(): number {
    return this._currentScreenWidth;
  }

  get currentBreakpoint(): string {
    return JSON.parse(JSON.stringify(this._currentBreakpoint));
  }

  get breakpointEditorConfigForCurrentBreakpoint() {
    return this._breakpointEditorConfig[this._currentBreakpoint];
  }

  get breakpointEditorConfig() {
    return this._breakpointEditorConfig;
  }

  get editorMode(): EditorMode {
    return this._mode;
  }

  get visualWidgetOutlineGuideState(): boolean {
    return this._visualWidgetOutlineGuide;
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
