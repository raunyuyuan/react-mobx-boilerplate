import React from "react";
import { globalState } from "./globalState";

const Store = {
  // eslint-disable-next-line new-cap
  globalState: new globalState(),
};

const StoreContext = React.createContext<typeof Store | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactElement }): any => {
  return <StoreContext.Provider value={Store}>{children}</StoreContext.Provider>;
};

export function useStores() {
  const store = React.useContext(StoreContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
}
