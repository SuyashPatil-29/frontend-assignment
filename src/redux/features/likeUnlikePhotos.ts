// Define the Photo interface
interface Photo {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
  liked?: boolean; // Add liked field to the Photo interface
}

const localStorageAvailable = typeof window !== "undefined";

// Create a slice for managing photos
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Photo[] =
  localStorageAvailable && localStorage.getItem("liked-photos")
    ? JSON.parse(localStorage.getItem("liked-photos") || "[]")
    : [];

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    likePhoto: (state, action: PayloadAction<Photo>) => {
      const existingIndex = state.findIndex((photo) => photo.id === action.payload.id);
      if (existingIndex === -1) {
        // If the photo is not already liked, add it to the state
        state.push({ ...action.payload, liked: true });
      }
      // Update local storage
      localStorageAvailable && localStorage.setItem("liked-photos", JSON.stringify(state));
    },
    unlikePhoto: (state, action: PayloadAction<Photo>) => {
      const index = state.findIndex((photo) => photo.id === action.payload.id);
      if (index !== -1) {
        // Remove the photo from the state
        state.splice(index, 1);
      }
      // Update local storage
      localStorageAvailable && localStorage.setItem("liked-photos", JSON.stringify(state));
    },
  },
});

export const { likePhoto, unlikePhoto } = photosSlice.actions;

export default photosSlice.reducer;

