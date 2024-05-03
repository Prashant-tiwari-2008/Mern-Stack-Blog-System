import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    blog: null,
    error: null,
    loading: false
}

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        createBlog: (state) => {
            state.error = null;
            state.loading = true
        },
        successBlog : (state,actions) =>{
            state.blog = actions.payload,
            state.loading = false;
            state.error = null;
        },
        createBLogFailure : (state,actions) => {
            state.blog = null;
            state.loading = false;
            state.error = actions.payload
        },
        updateBlog: (state,actions) => {
            state.blog = actions.payload,
            state.loading = false;
            state.error = null;
        },
        deleteBlog: (state,actions) => {
            state.blog = actions.payload,
            state.loading = false;
            state.error = null;
        }
    }
})

export const { 
    createBlog,
    createBLogFailure,
    successBlog, 
    updateBlog, 
    deleteBlog
    } = blogSlice.actions;

export default blogSlice.reducer;