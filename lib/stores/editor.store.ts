import { makeAutoObservable } from "mobx";

class EditorStore {
  private _currentBreakpoint: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  //! Setter
  setCurrentBreakpoint = (breakpoint: string): void => {
    this._currentBreakpoint = breakpoint;
  };

  //! Getter
  get currentBreakpoint(): string {
    return JSON.parse(JSON.stringify(this._currentBreakpoint));
  }
}

export default EditorStore;
