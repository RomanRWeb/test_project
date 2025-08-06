import {Task, TasksState} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {
    createNewTasks,
    editCurrentTaskDescription,
    editCurrentTaskName,
    editTask,
    fetchUserTasks
} from "../thunks/tasks";

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
        addTask(state, {payload}: { payload: Task }) {
            state.tasks.push(payload);
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
        .addCase(editTask.pending, (state) => {
            console.log('editTask.pending');
            state.isLoading = true;
            state.error = null
        })
        .addCase(editTask.fulfilled, (state) => {
            console.log('editTask.fulfilled');
            state.isLoading = false;
        })
        .addCase(editTask.rejected, (state, action) => {
            console.log('editTask.rejected', JSON.stringify(action.payload, null, 2));
            state.error = action.payload;
            state.isLoading = false;
        })
        .addCase(createNewTasks.pending, (state) => {
            console.log('createNewTasks.pending');
            state.isLoading = true;
            state.error = null
        })
        .addCase(createNewTasks.fulfilled, (state) => {
            console.log('createNewTasks.fulfilled');
            state.isLoading = false;
        })
        .addCase(createNewTasks.rejected, (state, action) => {
            console.log('createNewTasks.rejected', JSON.stringify(action.payload, null, 2));
            state.error = action.payload;
            state.isLoading = false;
        })
        .addCase(editCurrentTaskName.pending, (state) => {
            console.log('editCurrentTaskName.pending');
            state.isLoading = true;
            state.error = null
        })
        .addCase(editCurrentTaskName.fulfilled, (state) => {
            console.log('editCurrentTaskName.fulfilled');
            state.isLoading = false;
        })
        .addCase(editCurrentTaskName.rejected, (state, action) => {
            console.log('editCurrentTaskName.rejected', JSON.stringify(action.payload, null, 2));
            state.error = action.payload;
            state.isLoading = false;
        })
        .addCase(editCurrentTaskDescription.pending, (state) => {
            console.log('editCurrentTaskDescription.pending');
            state.isLoading = true;
            state.error = null
        })
        .addCase(editCurrentTaskDescription.fulfilled, (state) => {
            console.log('editCurrentTaskDescription.fulfilled');
            state.isLoading = false;
        })
        .addCase(editCurrentTaskDescription.rejected, (state, action) => {
            console.log('editCurrentTaskDescription.rejected', JSON.stringify(action.payload, null, 2));
            state.error = action.payload;
            state.isLoading = false;
        })
    }
})



export const {setTasks, addTask} = tasksSlice.actions;
