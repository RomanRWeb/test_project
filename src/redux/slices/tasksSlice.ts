import {Task, TasksState} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {fetchUserTasks} from "../thunks/tasks";

const initialSliceState: TasksState = {
    tasks: [],
    isLoading: false,
    error: null,
}

export const tasksSlice = createSlice({
    name: "tasks",
    initialState: initialSliceState,
    reducers: {
        setTasks(state, {payload}: { payload: Task[] }) {
            state.tasks = payload;
        },
        createTask(state, {payload}: { payload: Task }) {
            state.tasks = state.tasks.concat(payload);
        }
    },
    extraReducers: (builder) => {
    builder
        .addCase(fetchUserTasks.pending, (state) => {
            console.log('fetchUserTasks.pending');
            state.isLoading = true;
            state.error = null
        })
        .addCase(fetchUserTasks.fulfilled, (state) => {
            console.log('fetchUserTasks.fulfilled');
            state.isLoading = false;
        })
        .addCase(fetchUserTasks.rejected, (state, action) => {
            console.log('fetchUserTasks.rejected', JSON.stringify(action.payload, null, 2));
            state.error = action.payload;
            state.isLoading = false;
        })
    }
})

export const {setTasks, createTask} = tasksSlice.actions;
