import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './slices/roomsSlice';
import bookingReducer from './slices/bookingsSlice';
import favoriteRoomsReducer from './slices/favoriteRoomsSlice';

const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    bookings: bookingReducer,
    favoriteRooms: favoriteRoomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 


export default store;