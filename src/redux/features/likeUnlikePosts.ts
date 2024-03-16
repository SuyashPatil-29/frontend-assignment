import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  body: string;
  id: number;
  title: string;
  userId: number;
  liked?: boolean;
}

const localStorageAvailable = typeof window !== 'undefined';

const initialState: Post[] = localStorageAvailable && localStorage.getItem('likedPosts')
  ? JSON.parse(localStorage.getItem('likedPosts') || '[]')
  : [];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    likePost: (state, action: PayloadAction<Post>) => {
      const index = state.findIndex((post) => post.id === action.payload.id);
      if (index === -1) {
        state.push({ ...action.payload, liked: true });
      } else {
        state[index].liked = true;
      }
      localStorageAvailable && localStorage.setItem('likedPosts', JSON.stringify(state));
    },
    unlikePost: (state, action: PayloadAction<Post>) => {
      const index = state.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1); // If you want to remove the post from likedPosts
        // Or, if you just want to set liked to false without removing:
        // state[index].liked = false;
      }
      localStorageAvailable && localStorage.setItem('likedPosts', JSON.stringify(state));
    },
  },
});

export const { likePost, unlikePost } = postsSlice.actions;

export default postsSlice.reducer;
