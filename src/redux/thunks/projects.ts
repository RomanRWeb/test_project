import {createAction, createAsyncThunk, unwrapResult} from "@reduxjs/toolkit";
import {Project, ReduxType, UserData} from "../../types";
import {addProject, setProjects} from "../slices/projectSlice";
import {fetchNewProject, fetchUserProject} from "../api";
import {editUser} from "./auth";
import {addProjectToProjectList} from "../slices/authSlice";


export const fetchProject = createAsyncThunk(
    'projects/fetchProjects',
    async (id: string, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        try {
            console.log('fetching project with id:', JSON.stringify(id, null, 2));
            const result = await fetchUserProject(id);
            if (result.ok) {
                const project: Project = await result.json();
                console.log('project', JSON.stringify(project, null, 2));
                console.log('state.projects.projects', JSON.stringify(state.projects.projects, null, 2));
                // const index: number = state.projects.projects.findIndex(el => el.id === project.id)
                // console.log('index', JSON.stringify(index, null, 2));
                // const newProjectList = state.projects.projects.splice(index, 1, project);
                const newProjectList = state.projects.projects.map(el =>
                    el.id === project.id ? project : el
                );
                console.log('newProjectList', JSON.stringify(newProjectList, null, 2));
                dispatch(setProjects(newProjectList));
                return project;
            } else {
                return rejectWithValue({error: 'Unable to fetch projects'});
            }
        } catch (error) {
            createAction(error)
        }
    }
)

export const createNewProject = createAsyncThunk(
    'projects/createProject',
    async (project: Project, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        try {
            const result = await fetchNewProject(project);
            if (result.ok) {
                const project: Project = await result.json();
                console.log('project', JSON.stringify(project, null, 2));
                console.log('state.projects.projects', JSON.stringify(state.projects.projects, null, 2));
                const newProjectList: string[] = state.auth.projectsList.concat(project.id);
                console.log('New project planned to create: ', JSON.stringify(project, null, 2));
                dispatch(addProjectToProjectList(project.id));
                dispatch(editUser({
                    email: '',
                    projectsList: newProjectList,
                    id: state.auth.user.id,
                    password: ''
                })).then(unwrapResult).then((result) => {
                    if (result !== null) {
                        console.log("User edited");
                        dispatch(addProject(project));
                    }
                })
                return project;
            } else {
                return rejectWithValue({error: 'Unable to create new project'});
            }
        } catch (error) {
            createAction(error)
        }
    }
)

export const editProject = createAsyncThunk(
    'projects/redactProject',
    async (project: Project, {dispatch, rejectWithValue, getState}) => {
        try {
            // const result = await fetchEditProject(project);
            // if (result.ok) {
            //     const project: Project = await result.json();
            //     dispatch(addProject(project));
            // } else {
            //     rejectWithValue({error: 'Unable to create new project'});
            // }
        } catch (error) {
            createAction(error)
        }
    }
)
