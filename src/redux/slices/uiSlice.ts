import {UiState} from "../../types";
import {createSlice} from "@reduxjs/toolkit";


const initialUiState: UiState = {
    currentProject: '',
    currentCommand: '',
    currentTask: ''
}

export const uiSlice = createSlice ({
    name: 'uiSlice',
    initialState: initialUiState,
    reducers: {
        setCurrentProject: (state, {payload}: { payload: string }) => {
            state.currentProject = payload;
        },
        setCurrentCommand: (state, {payload}: { payload: string }) => {
            state.currentCommand = payload;
        },
        setCurrentTask: (state, {payload}: { payload: string }) => {
            state.currentTask = payload;
        }
    }
})

export const {setCurrentProject, setCurrentCommand, setCurrentTask} = uiSlice.actions;
