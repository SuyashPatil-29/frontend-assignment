import { configureStore } from '@reduxjs/toolkit'
import savePost from './features/saveAndDeletePost'
import savePhoto from './features/saveAndDeletePhoto'
import likeUnlikePhotos from './features/likeUnlikePhotos'
import likeUnlikePosts from './features/likeUnlikePosts'

export const makeStore = () => {
  return configureStore({
    reducer: {
      savePost : savePost,
      savePhoto : savePhoto,
      likeUnlikePhotos : likeUnlikePhotos,
      likeUnlikePosts : likeUnlikePosts
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

