import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : null,
    loading : false
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        signInstart : (state) =>{
            state.loading = true,
            state.error = null
        },
        signInSuccess : (state, action) => {
            state.currentUser = action.payload,
            state.loading = false;
            state.error = null
        },
        signInFailure: (state,action) =>{
            state.loading = false;
            state.error = action.payload;
        },   
        signOutSuccess:(state,action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        updateStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess : (state) => {
            state.currentUser = state.payload;
            state.loading = false;
            state.error = null
        },
        updateFailure : (state) => {
            state.loading = false;
            state.error = state.payload;
        },
        deleteUserStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess : (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null
        },
        deleteUserFailure: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        reset : (state) =>{
            state.error = null,
            state.loading = false
        }
    }
})


export const {
    signInstart,
    signInSuccess,
    signInFailure,
    signOutSuccess,
    updateFailure,
    updateStart,
    updateSuccess,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    reset
} = userSlice.actions;

export default userSlice.reducer;