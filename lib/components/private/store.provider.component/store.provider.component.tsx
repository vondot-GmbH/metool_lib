import React from "react";
import { Provider as MobxProvider } from "mobx-react";
import RootStore from "../../../stores/root.store";

const rootStore = new RootStore();

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <MobxProvider {...rootStore}>{children}</MobxProvider>;
};

export default StoreProvider;
