import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './slices/roomsSlice';
import favoriteRoomsReducer from './slices/favoriteRoomsSlice';

const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    favoriteRooms: favoriteRoomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export default store;