import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface settingsState {
  modalIsOpen: boolean;
  editMode: boolean;
}

const initialState: settingsState = {
  modalIsOpen: false,
  editMode: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setModal: (state) => {
      state.modalIsOpen = !state.modalIsOpen;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
  },
});

export const { setModal, setEditMode } = settingsSlice.actions;
export const getEditModal = (state: RootState) => state.settings.modalIsOpen;
export const getEditMode = (state: RootState) => state.settings.editMode;

export default settingsSlice.reducer;
