import {UiState} from "../../types";
import {createSlice} from "@reduxjs/toolkit";


const initialUiState: UiState = {
    currentProject: '',
    currentCommand: ''
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
        }
    }
})

export const {setCurrentProject, setCurrentCommand} = uiSlice.actions;
