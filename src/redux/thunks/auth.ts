import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Project, ReduxType, UserData} from "../../types";
import {fetchByID, fetchEditUser, fetchNewUser} from "../api";
import {setUserData} from "../slices/authSlice";
import {setProjects} from "../slices/projectSlice";

export const fetchUserByID = createAsyncThunk(
    'user/fetchUserByID',
    async (userDataEntered: UserData, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        try {
            const result = await fetchByID(userDataEntered);
            if (result.ok) {
                const user: UserData = await result.json();
                console.log('user', JSON.stringify(user, null, 2));
                console.log('compare', JSON.stringify(user.password == userDataEntered.password, null, 2));
                if (user[0].password == userDataEntered.password && user[0].email == userDataEntered.email) {
                    dispatch(setUserData(user[0]))
                    const projectList: Project[] = user[0].projectsList.map(el => {
                        const newElement: Project = {id: el, name: el, creatorId: ''}
                        return newElement;
                    })
                    console.log('projectList', JSON.stringify(projectList, null, 2));
                    dispatch(setProjects(projectList))
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
        try {
            const result = await fetchNewUser(userDataEntered);
            if (result.ok) {
                const user: UserData = await result.json();
                console.log('user', JSON.stringify(user, null, 2));
                dispatch(setUserData(user))
                return user;
            } else {
                // createAction({});
                return rejectWithValue({error: 'Unable to fetch user data'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)

export const editUser = createAsyncThunk(
    'user/editUser',
    async (userDataEntered: UserData, {dispatch, rejectWithValue, getState}) => {
        try {
            const result = await fetchEditUser(userDataEntered);
            if (result.ok) {
                const user: UserData = await result.json();
                return user
            } else {
                // createAction({});
                return rejectWithValue({error: 'Unable to fetch user data'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)
