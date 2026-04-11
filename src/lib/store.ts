import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./features/api/api";
import authReducer from "./features/auth/authSlice";
import kanbanReducer from "./features/kanban/kanbanSlice";
import i18nReducer from "./features/i18n/i18nSlice";

import "./features/auth/authApi";
import "./features/profile/profileApi";
import "./features/tasks/taskApi";
import "./features/team/teamApi";
import "./features/notifications/notificationsApi";
import "./features/dashboard/dashboardApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    kanban: kanbanReducer,
    i18n: i18nReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;