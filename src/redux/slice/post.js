import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from '../../axios';


export const fetchPost = createAsyncThunk('posts/fetchPost', async () => {
  const {data} = await axios.get('/posts');
  return data;
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost',  (id) =>  axios.delete(`/posts/${id}`))



const initialState = {
  posts: {
    items:[],
    status: 'loading'
  }
}


const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers:{},
  extraReducers: {
    //создания статьй
    [fetchPost.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPost.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPost.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // удаления статьй
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
    },
  }
})


export const postsReducer = postSlice.reducer