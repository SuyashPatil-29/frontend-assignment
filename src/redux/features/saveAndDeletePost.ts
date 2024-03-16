import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  body: string;
  id: number;
  title: string;
  userId: number;
  liked?: boolean; // Add liked field to the Post interface
}

const localStorageAvailable = typeof window !== "undefined";

const initialState: Post[] =
  localStorageAvailable && localStorage.getItem("posts")
    ? JSON.parse(localStorage.getItem("posts") || "[]")
    : [];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.push(action.payload);
      localStorageAvailable &&
        localStorage.setItem("posts", JSON.stringify(state));
    },
    removePost: (state, action: PayloadAction<Post>) => {
      const index = state.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(state));
      }
    },
  },
});

export const { addPost, removePost } = postsSlice.actions;

export default postsSlice.reducer;
