import {createSlice} from "@reduxjs/toolkit";
import {Project, ProjectsState} from "../../types";
import {createNewProject, editProject, fetchProject} from "../thunks/projects";


const initialSliceState: ProjectsState = {
    projects: [],
    isLoading: false,
    error: null,
}

export const projectSlice = createSlice({
    name: 'projects',
    initialState: initialSliceState,
    reducers: {
        setProjects: (state, {payload}: { payload: Project[] }) => {
            state.projects = payload;
        },

        addProject(state, {payload}: { payload: Project }) {
            state.projects = state.projects.concat(payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProject.pending, (state) => {
                console.log('fetchProject.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(fetchProject.fulfilled, (state) => {
                console.log('fetchProject.fulfilled');
                state.isLoading = false;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                console.log('fetchProject.rejected', JSON.stringify(action.payload, null, 2));
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(createNewProject.pending, (state) => {
                console.log('createNewProject.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(createNewProject.fulfilled, (state) => {
                console.log('createNewProject.fulfilled');
                state.isLoading = false;
            })
            .addCase(createNewProject.rejected, (state, action) => {
                console.log('createNewProject.rejected', JSON.stringify(action.payload, null, 2));
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(editProject.pending, (state) => {
                console.log('editProject.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(editProject.fulfilled, (state) => {
                console.log('editProject.fulfilled');
                state.isLoading = false;
            })
            .addCase(editProject.rejected, (state, action) => {
                console.log('editProject.rejected', JSON.stringify(action.payload, null, 2));
                state.error = action.payload;
                state.isLoading = false;
            })
    }
})

export const {setProjects, addProject} = projectSlice.actions;
