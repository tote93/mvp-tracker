import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface settingsState {
  modalIsOpen: boolean;
}

const initialState: settingsState = {
  modalIsOpen: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setModal: (state) => {
      state.modalIsOpen = !state.modalIsOpen;
    },
  },
});

export const { setModal } = settingsSlice.actions;
export const getEditModal = (state: RootState) => state.settings.modalIsOpen;

export default settingsSlice.reducer;
