import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import matchingSlice from './slices/matchingSlice';
import projectsSlice from './slices/projectsSlice';
import messagesSlice from './slices/messagesSlice';
import eventsSlice from './slices/eventsSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  matching: matchingSlice,
  projects: projectsSlice,
  messages: messagesSlice,
  events: eventsSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;