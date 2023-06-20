import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Mvp } from "../../interfaces";
import mvpsData from "../../data/data.json";
export interface MvpState {
  activeMvps: Array<Mvp>;
  allMvps: Array<Mvp>;
  timeZone: string;
  editingMvp: Mvp;
}

const initialState: MvpState = {
  activeMvps: [],
  allMvps: mvpsData,
  timeZone: "local",
  editingMvp: mvpsData[0],
};

export const mvpSlice = createSlice({
  name: "mvpContext",
  initialState,
  reducers: {
    addKilledMvp: (state, action: PayloadAction<Mvp>) => {
      state.allMvps = state.allMvps.filter((mvp) => mvp.id !== action.payload.id);
      state.activeMvps.push(action.payload);
      saveLocalActiveMvps(state);
      addLocalKilledMvpCount(action.payload);
    },
    removeActiveMvp: (state, action: PayloadAction<Mvp>) => {
      state.activeMvps = state.activeMvps.filter((mvp) => mvp.id !== action.payload.id);
      state.allMvps.push(action.payload);
    },
    setActiveMvps: (state, action: PayloadAction<Array<Mvp>>) => {
      state.activeMvps = action.payload;
    },
    setAllMvps: (state, action: PayloadAction<Array<Mvp>>) => {
      state.allMvps = action.payload;
    },
    setTimeZone: (state, action: PayloadAction<string>) => {
      state.timeZone = action.payload;
    },
    setEditingMvp: (state, action: PayloadAction<Mvp>) => {
      state.editingMvp = action.payload;
    },
  },
});

export const { setEditingMvp, addKilledMvp, removeActiveMvp, setActiveMvps, setAllMvps, setTimeZone } = mvpSlice.actions;
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
const addLocalKilledMvpCount = (payload: Mvp) => {
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

export const getAllMvps = (state: RootState) => state.mvpContext.allMvps;
export const getActiveMvps = (state: RootState) => state.mvpContext.activeMvps;
export const getTimezone = (state: RootState) => state.mvpContext.timeZone;
export const getKilledMvp = (state: RootState) => state.mvpContext.editingMvp;
export default mvpSlice.reducer;
