import { create } from "zustand";

import { getStoreActions, IActions } from "./actions";
import { getInitialState, IState } from "./state";

export type IStore = IActions & IState;

export type IStoreSet = (function_: (state: IStore) => Partial<IStore>) => void;

export const useStore = create<IStore>((set) => {
  return { ...getInitialState(), ...getStoreActions(set) };
});
