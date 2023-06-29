import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Mvp } from "../../interfaces";
import mvpsData from "../../data/data.json";
export interface MvpState {
  activeMvps: Array<Mvp>;
  allMvps: Array<Mvp>;
  editingMvp: Mvp;
}

const initialState: MvpState = {
  activeMvps: [],
  allMvps: mvpsData,
  editingMvp: mvpsData[0],
};

export const mvpSlice = createSlice({
  name: "mvpContext",
  initialState,
  reducers: {
    addKilledMvp: (state, action: PayloadAction<Mvp>) => {
      state.activeMvps.push(action.payload);
      saveLocalActiveMvps(state);
      addLocalKilledMvpCount(action.payload);
      if (action.payload.spawn.length === 1) {
        state.allMvps = state.allMvps.filter((mvp) => mvp.id !== action.payload.id);
      } else {
        // find the mvp from allMvps and replace it by the action.payload one
        const index = state.allMvps.findIndex((mvp) => mvp.id === action.payload.id);
        state.allMvps[index] = action.payload;
      }
      if (action.payload.spawn.length === action.payload.activeMaps.length) {
        state.allMvps = state.allMvps.filter((mvp) => mvp.id !== action.payload.id);
      }
    },
    removeActiveMvp: (state, action: PayloadAction<Mvp>) => {
      if (action.payload.spawn.length === 1) {
        state.activeMvps = state.activeMvps.filter((mvp) => mvp.id !== action.payload.id);
      }
      state.allMvps.push(action.payload);
      removeActiveFromLocalStorage(action.payload);
    },
    setActiveMvps: (state, action: PayloadAction<Array<Mvp>>) => {
      state.activeMvps = action.payload;
    },
    setAllMvps: (state, action: PayloadAction<Array<Mvp>>) => {
      state.allMvps = action.payload;
    },
    setEditingMvp: (state, action: PayloadAction<Mvp>) => {
      state.editingMvp = action.payload;
    },
    editMvp: (state, action: PayloadAction<Mvp>) => {
      const index = state.allMvps.findIndex((mvp) => mvp.id === action.payload.id && mvp.deathMap === action.payload.deathMap);
      state.allMvps[index] = action.payload;
      editLocalMvp(action.payload);
    },
  },
});

export const { setEditingMvp, addKilledMvp, removeActiveMvp, setActiveMvps, setAllMvps, editMvp } = mvpSlice.actions;
const editLocalMvp = (payload: Mvp) => {
  const activeMvps: any = localStorage.getItem("activeMvps");
  if (activeMvps) {
    const MVPS = JSON.parse(activeMvps);
    const updatedMvps = MVPS.map((mvp: any) => {
      if (mvp.id === payload.id && mvp.deathMap === payload.deathMap) {
        return payload;
      }
      return mvp;
    });
    localStorage.setItem("activeMvps", JSON.stringify(updatedMvps));
  }
};
const saveLocalActiveMvps = (state: MvpState) => {
  const activeMvps: any = [];
  state.activeMvps.forEach((mvp) => {
    activeMvps.push({
      id: mvp.id,
      deathMap: mvp.deathMap,
      deathTime: mvp.deathTime,
    });
  });
  localStorage.setItem("activeMvps", JSON.stringify(activeMvps));
};
export const addLocalKilledMvpCount = (payload: Mvp) => {
  const mvp_count: any = localStorage.getItem("mvp_count");
  if (mvp_count) {
    const mvpCount = JSON.parse(mvp_count);
    mvpCount.find((i: any) => i.id === payload.id).killed += 1;
    localStorage.setItem("mvp_count", JSON.stringify(mvpCount));
  }
};
export const getLocalActiveMvps = () => {
  const activeMvps: any = localStorage.getItem("activeMvps");
  if (activeMvps) {
    const MVPS = JSON.parse(activeMvps);
    const updatedMvps = MVPS.map((mvp: any) => {
      let found = { ...(mvpsData.find((mvpData) => mvpData.id === mvp.id) as Mvp) };
      if (found) {
        found = { ...found, deathMap: mvp.deathMap, deathTime: mvp.deathTime };
        return found;
      }
      return mvp;
    });
    return updatedMvps;
  }
  return [];
};
const removeActiveFromLocalStorage = (payload: Mvp) => {
  const activeMvps: any = localStorage.getItem("activeMvps");

  if (activeMvps) {
    const MVPS = JSON.parse(activeMvps);
    const updatedMvps = MVPS.filter((mvp: any) => mvp.id !== payload.id || (mvp.id === payload.id && mvp.deathMap !== payload.deathMap));
    localStorage.setItem("activeMvps", JSON.stringify(updatedMvps));
  }
};

export const getAllMvps = (state: RootState) => state.mvpContext.allMvps;
export const getActiveMvps = (state: RootState) => state.mvpContext.activeMvps;
export const getKilledMvp = (state: RootState) => state.mvpContext.editingMvp;
export default mvpSlice.reducer;
