import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Commentary, ReduxType, Task, UserData} from "../../types";
import {addTaskCommentary, editTaskDescription, editTaskName, editTaskState, fetchNewTasks, fetchTasks} from "../api";
import {addTask, setTasks} from "../slices/tasksSlice";


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

export const editTask = createAsyncThunk(
    'tasks/editTask',
    async (task: { id: string, state: string }, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        try {
            const result = await editTaskState({
                projId: state.ui.currentProject,
                commandId: state.ui.currentCommand,
                task: task
            });
            if (result.ok) {
                const newTask: Task = await result.json();
                return newTask;
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
    async (_, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        try {
            const result = await fetchNewTasks({projId: state.ui.currentProject, commandId: state.ui.currentCommand});
            console.log('result', JSON.stringify(result, null, 2));
            if (result.ok) {
                const task: Task = await result.json();
                dispatch(addTask(task));
                return task;
            } else {
                rejectWithValue({error: 'Unable to fetch user tasks'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)

export const editCurrentTaskName = createAsyncThunk(
    'tasks/editCurrentTaskName',
    async (task: { id: string, name: string }, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        console.log('task', JSON.stringify(task, null, 2));
        try {
            const result = await editTaskName({
                projId: state.ui.currentProject,
                commandId: state.ui.currentCommand,
                task: task
            });
            if (result.ok) {
                const newTask: Task = await result.json();
                const newTaskList: Task[] = state.tasks.tasks.map(taskFromState => {
                        if (taskFromState.id === newTask.id) {
                            return newTask
                        } else {
                            return taskFromState
                        }
                    }
                );
                dispatch(setTasks(newTaskList));
                return newTask;
            } else {
                rejectWithValue({error: 'Unable to edit task name'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)


export const editCurrentTaskDescription = createAsyncThunk(
    'tasks/editCurrentTaskDescription',
    async (task: { id: string, description: string }, {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        console.log('task', JSON.stringify(task, null, 2));
        try {
            const result = await editTaskDescription({
                projId: state.ui.currentProject,
                commandId: state.ui.currentCommand,
                task: task
            });
            if (result.ok) {
                const newTask: Task = await result.json();
                const newTaskList: Task[] = state.tasks.tasks.map(taskFromState => {
                        if (taskFromState.id === newTask.id) {
                            return newTask
                        } else {
                            return taskFromState
                        }
                    }
                );
                dispatch(setTasks(newTaskList));
                return newTask;
            } else {
                rejectWithValue({error: 'Unable to edit task description'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)

export const addCommentary = createAsyncThunk(
    'tasks/addCommentary',
    async (commentList: Commentary[], {dispatch, rejectWithValue, getState}) => {
        const state = getState() as ReduxType;
        try {
            const result = await addTaskCommentary({
                projId: state.ui.currentProject,
                commandId: state.ui.currentCommand,
                task: {id: state.ui.currentTask, commentaryList: commentList}
            });
            if (result.ok) {
                const newTask: Task = await result.json();
                const newTaskList: Task[] = state.tasks.tasks.map(taskFromState => {
                        if (taskFromState.id === newTask.id) {
                            return newTask
                        } else {
                            return taskFromState
                        }
                    }
                );
                dispatch(setTasks(newTaskList));
                return newTask;
            } else {
                rejectWithValue({error: 'Unable to add comment for tasks'});
            }
        } catch (error) {
            createAction(error);
        }
    }
)
