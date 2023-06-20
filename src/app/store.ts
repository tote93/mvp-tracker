import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import mvpReducer from "../features/mvp/mvpSlice";
import settinsgReducer from "../features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    mvpContext: mvpReducer,
    settings: settinsgReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
