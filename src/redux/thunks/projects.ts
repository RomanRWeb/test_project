import {createAction, createAsyncThunk, unwrapResult} from "@reduxjs/toolkit";
import {Command, Project, ReduxType, UserData} from "../../types";
import {addProject, setProjects} from "../slices/projectSlice";
import {fetchByID, fetchEditProject, fetchEditUser, fetchNewProject, fetchUserProject} from "../api";
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
                console.log('project fetched: ', JSON.stringify(project, null, 2));
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
        console.log('state', JSON.stringify(state, null, 2));
        try {
            const result = await fetchNewProject(project);
            if (result.ok) {
                const project: Project = await result.json();
                console.log('project', JSON.stringify(project, null, 2));
                let newProjectList: string[] = state.auth.user.projectsList;
                newProjectList = newProjectList.concat(project.id)
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
        console.log('project', JSON.stringify(project, null, 2));
        try {
            const result = await fetchEditProject(project);
            if (result.ok) {
                const projectRedacted: Project = await result.json();
                console.log('returned project', JSON.stringify(project, null, 2));
                return projectRedacted
            } else {
                return rejectWithValue({error: 'Unable to create new project'});
            }
        } catch (error) {
            createAction(error)
        }
    }
)

export const addProjectToUser = createAsyncThunk(
    'projects/addProjectToUser',
    async (userEmail: string, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        console.log(`Finding user with email:${userEmail}`);
        try {
            const fakeUser: UserData = {id: '', projectsList: [], password: '', email: userEmail}
            const result = await fetchByID(fakeUser)
            if (result.ok) {
                const users: UserData[] = await result.json();
                const user: UserData = users[0]
                console.log('user found:', JSON.stringify(user, null, 2));
                let userProjectList: string[] = user.projectsList;
                console.log('userProjectList', JSON.stringify(userProjectList, null, 2));
                const projectIsExist: boolean = userProjectList.includes(state.ui.currentProject)
                if (projectIsExist === false) {
                    userProjectList = userProjectList.concat(state.ui.currentProject)
                }
                // if (projectIsExist === false) {
                //     userProjectList = userProjectList.concat(state.ui.currentProject)
                // }
                console.log('userProjectList', JSON.stringify(userProjectList, null, 2));
                try {
                    const newFakeUser: UserData = {
                        id: user.id,
                        projectsList: userProjectList,
                        password: '',
                        email: ''
                    }
                    const result = await fetchEditUser(newFakeUser)
                    if (result.ok) {
                        return true
                    } else return rejectWithValue({error: 'Unable to add project'});

                } catch (error) {
                    createAction(error)
                }

            } else return rejectWithValue({error: 'Unable to find user'});
        } catch (error) {
            createAction(error)
        }
    }
)

export const deleteUserFromProject = createAsyncThunk(
    'projects/deleteUserFromProject',
    async (userEmail: string, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        console.log(`Finding user with email:${userEmail}`);
        const commands: Command[] = state.commands.commands;
        const commandsWithUser: string[] = commands
            .filter(command => command.userList.includes(userEmail))
            .map(command => command.id);
        console.log('commandsWithUser', JSON.stringify(commandsWithUser, null, 2));
        const filteredCommands = commandsWithUser.filter(el => el !== state.ui.currentCommand)
        console.log('filteredCommands', JSON.stringify(filteredCommands, null, 2));
        if (filteredCommands.length === 0) {
            try {
                const fakeUser: UserData = {id: '', projectsList: [], password: '', email: userEmail}
                const result = await fetchByID(fakeUser)
                if (result.ok) {
                    const users: UserData[] = await result.json();
                    const user: UserData = users[0]
                    const newProjectList = user.projectsList.filter(el => el !== state.ui.currentProject)

                    try {
                        const newFakeUser: UserData = {
                            id: user.id,
                            projectsList: newProjectList,
                            password: '',
                            email: ''
                        }
                        const result = await fetchEditUser(newFakeUser)
                        if (result.ok) {
                            return true
                        } else return rejectWithValue({error: 'Unable to delete project'});

                    } catch (error) {
                        createAction(error)
                    }
                } else return rejectWithValue({error: 'Unable to fetch user'});
            }catch(error) {
                createAction(error)
            }
        } else{
            return true
        }
    }
)
