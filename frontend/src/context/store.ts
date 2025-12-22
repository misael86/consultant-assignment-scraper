import { create } from "zustand";

import { getStoreActions, IActions } from "./actions";
import { initialState, IState } from "./state";

export type IStore = IActions & IState;

export type IStoreSet = (function_: (state: IStore) => Partial<IStore>) => void;

export const useStore = create<IStore>((set) => {
  return { ...initialState, ...getStoreActions(set) };
});
