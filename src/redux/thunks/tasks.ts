import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ReduxType, UserData} from "../../types/index.ts";
import {fetchTasks} from "../api";


export const fetchUserTasks = createAsyncThunk (
    'tasks/fetchTasks',
    async (_, {dispatch, rejectWithValue, getState}) => {
        const state:ReduxType = getState();
        const user:UserData = state.auth.user;
        console.log('state', JSON.stringify(state, null, 2));
        console.log('user', JSON.stringify(user, null, 2));
        try{
            //const result = await fetchTasks(state.user);
        }catch(error){
            createAction(error);
        }
    }
)
