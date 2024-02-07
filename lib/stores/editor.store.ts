import { makeAutoObservable } from "mobx";
import ConfigProvider from "../config/config.provider";

class EditorStore {
  private _currentBreakpoint: string = "";

  // for each breakpoint key and values with min, max
  private _breakpointEditorConfig: {
    [key: string]: { minWidth: number | null; maxWidth: number | null };
  } = {};

  private _currentScreenWidth: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  //! Setter
  setCurrentBreakpoint = (breakpoint: string): void => {
    this._currentBreakpoint = breakpoint;
  };

  setCurrentScreenWidth(width: number) {
    this._currentScreenWidth = width;
  }

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

  initializeEditorBreakpointConfig() {
    const layoutConfig = ConfigProvider.getInstance().getLayoutConfig();
    const rootConfig = layoutConfig.root;

    const newConfig: {
      [key: string]: { minWidth: number | null; maxWidth: number | null };
    } = {};

    // Konvertierung der rootConfig in ein Array und Sortierung basierend auf der breakpoint-Weite
    const sortedBreakpoints = Object.entries(rootConfig).sort(
      (a, b) => a[1].breakpoint - b[1].breakpoint
    );

    sortedBreakpoints.forEach(([breakpoint, config], index) => {
      const isLastBreakpoint = index === sortedBreakpoints.length - 1;
      const isFirstBreakpoint = index === 0;

      // Für den ersten Breakpoint gibt es keine Min-Breite
      const minWidth = isFirstBreakpoint
        ? null
        : sortedBreakpoints[index - 1][1].breakpoint;

      // Für den letzten Breakpoint gibt es keine Max-Breite
      const maxWidth = isLastBreakpoint ? null : config.breakpoint - 1;

      newConfig[breakpoint] = { minWidth, maxWidth };
    });

    this._breakpointEditorConfig = newConfig;
    console.log("breakpointEditorConfig");
    console.log(JSON.stringify(this._breakpointEditorConfig, null, 2));
  }
}

export default EditorStore;
