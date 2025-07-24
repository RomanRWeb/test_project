import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ReduxType, Task, UserData} from "../../types/index.ts";
import {fetchNewTasks, fetchTasks} from "../api/index.ts";
import {createTask, setTasks} from "../slices/tasksSlice.ts";


export const fetchUserTasks = createAsyncThunk(
    'tasks/fetchUserTasks',
    async (_, {dispatch, rejectWithValue, getState}) => {
        const state: ReduxType = getState();
        const user: UserData = state.auth.user;
        console.log('user', JSON.stringify(user, null, 2));
        try {
            const result = await fetchTasks(user);
            console.log('result', JSON.stringify(result, null, 2));
            if (result.ok) {
                const tasks: Task[] = await result.json();
                dispatch(setTasks(tasks));
                return tasks;
            } else {
                rejectWithValue({error: 'Unable to fetch user tasks'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)

export const createNewTasks = createAsyncThunk(
    `tasks/createNewTask`,
    async (taskData: { name: string, description: string }, {dispatch, rejectWithValue, getState}) => {
        const state: ReduxType = getState();
        const user: UserData = state.auth.user;
        try {
            const result = await fetchNewTasks(user, taskData);
            console.log('result', JSON.stringify(result, null, 2));
            // if (result.ok) {
            //     const task: Task = await result.json();
            //     const newTask: Task = {
            //         id: task.id,
            //         userID: user.id,
            //         name: taskData.name,
            //         description: taskData.description
            //     };
            //     dispatch(createTask(newTask));
            //     return taskData;
            // } else {
            //     rejectWithValue({error: 'Unable to fetch user tasks'});
            // }
        } catch (error) {
            createAction(error);
        }
    }
)
