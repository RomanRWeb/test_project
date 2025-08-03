import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ReduxType, Task, UserData} from "../../types";
import {fetchNewTasks, fetchTasks} from "../api";
import {createTask, setTasks} from "../slices/tasksSlice";


export const fetchUserTasks = createAsyncThunk(
    'tasks/fetchUserTasks',
    async (_, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        console.log("fetching tasks for:");
        console.log('state.ui.currentProject', JSON.stringify(state.ui.currentProject, null, 2));
        console.log('state.ui.currentCommand', JSON.stringify(state.ui.currentCommand, null, 2));
        try {
            const result = await fetchTasks({projId: state.ui.currentProject, commandId: state.ui.currentCommand});
            if (result.ok) {
                const tasks: Task[] = await result.json();
                console.log('tasks', JSON.stringify(tasks, null, 2));
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
        const state = getState() as ReduxType;
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
