import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {UserData} from "../../types";
import {fetchByID, fetchNewUser} from "../api";
import {setUserData} from "../slices/authSlice";

export const fetchUserByID = createAsyncThunk(
    'user/fetchUserByID',
    async (userDataEntered: UserData, {dispatch, rejectWithValue, getState}) => {
        // const state: MyReduxType = getState();
        try {
            const result = await fetchByID(userDataEntered);
            if (result.ok) {
                const user: UserData = await result.json();
                console.log('user', JSON.stringify(user, null, 2));
                console.log('userDataEntered', JSON.stringify(userDataEntered, null, 2));
                console.log('user.password', JSON.stringify(user.password, null, 2));
                console.log('userDataEntered.password', JSON.stringify(userDataEntered.password, null, 2));
                console.log('compare', JSON.stringify(user.password == userDataEntered.password, null, 2));
                if (user[0].password == userDataEntered.password) {
                    dispatch(setUserData(user[0]))
                    return user[0];
                } else {
                    return null
                }

            } else {
                // createAction({});
                return rejectWithValue({error: 'Unable to fetch user data'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)

export const createNewUser = createAsyncThunk(
    'user/createNewUser',
    async (userDataEntered: UserData, {dispatch, rejectWithValue, getState}) => {
        // const state: MyReduxType = getState();
        try {
            const result = await fetchNewUser(userDataEntered);
            if (result.ok) {
                const user: UserData = await result.json();
                console.log('user', JSON.stringify(user, null, 2));
                    dispatch(setUserData(user))
            } else {
                // createAction({});
                rejectWithValue({error: 'Unable to fetch user data'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)
