import {createSlice} from "@reduxjs/toolkit";
import {AuthState, UserData} from "../../types";
import {createNewUser, fetchUserByID} from "../thunks/auth";

const initialSliceState: AuthState = {
    user: null,
    isLoading: false,
    error: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialSliceState,
    reducers: {
        setUserData(state, {payload}: { payload: UserData }) {
            state.user = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserByID.pending, (state) => {
                console.log('fetchUserByID.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(fetchUserByID.fulfilled, (state) => {
                console.log('fetchUserByID.fulfilled');
                state.isLoading = false;
            })
            .addCase(fetchUserByID.rejected, (state, action) => {
                console.log('fetchUserByID.rejected', JSON.stringify(action.payload, null, 2));
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(createNewUser.pending, (state) => {
                console.log('createNewUser.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(createNewUser.fulfilled, (state) => {
                console.log('createNewUser.fulfilled');
                state.isLoading = false;
            })
            .addCase(createNewUser.rejected, (state, action) => {
                console.log('createNewUser.rejected');
                state.isLoading = false;
                state.error = action.payload;
            });

    }
})

export const {setUserData} = authSlice.actions;
