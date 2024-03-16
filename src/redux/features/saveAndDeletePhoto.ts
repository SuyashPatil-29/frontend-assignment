// Define the Photo interface
interface Photo {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}

// Create a slice for managing photos
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Photo[] = localStorage.getItem("photos")
  ? JSON.parse(localStorage.getItem("photos") || "[]")
  : [];

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.push(action.payload);
      localStorage.setItem("photos", JSON.stringify(state));
    },
    removePhoto: (state, action: PayloadAction<Photo>) => {
      const index = state.findIndex((photo) => photo.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
        localStorage.setItem("photos", JSON.stringify(state));
      }
    },
  },
});

export const { addPhoto, removePhoto } = photosSlice.actions;

export default photosSlice.reducer;
