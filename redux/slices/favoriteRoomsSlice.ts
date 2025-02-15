import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getInitialFavorites = (): string[] => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("favoriteRooms") || "[]");
  }
  return [];
};

const favoriteRoomsSlice = createSlice({
  name: "favoriteRooms",
  initialState: getInitialFavorites(),
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      let updatedState = [...state];

      if (updatedState.includes(roomId)) {
        updatedState = updatedState.filter((id) => id !== roomId); 
      } else {
        updatedState.push(roomId); 
      }

      localStorage.setItem("favoriteRooms", JSON.stringify(updatedState)); 
      return updatedState;
    },
  },
});

export const { toggleFavorite } = favoriteRoomsSlice.actions;
export default favoriteRoomsSlice.reducer;
