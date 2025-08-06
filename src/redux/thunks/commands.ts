import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchAddNewCommand, fetchCurrentCommands, fetchEditCommand, fetchEditCommandUsers} from "../api";
import {Command, ReduxType} from "../../types";
import {addCommands, setCommands} from "../slices/commandsSlice";


export const fetchCommands = createAsyncThunk(
    'commands/fetchCommands',
    async (projectId: string, {dispatch, rejectWithValue, getState}) =>{
        console.log("fetchCommands called");
        console.log('projectId', JSON.stringify(projectId, null, 2));
        if (projectId !== ''){
            try{
                const result = await fetchCurrentCommands(projectId);
                console.log('result', JSON.stringify(result, null, 2));
                if (result.ok){
                    const commandsList: Command[] = await result.json();
                    console.log('commandsList', JSON.stringify(commandsList, null, 2));
                    dispatch(setCommands(commandsList))
                    return commandsList
                } else {
                    dispatch(setCommands([]))
                    console.log('result in else');
                    return rejectWithValue("Could not find command list");
                }
            } catch (error) {
                createAction(error)
            }
        }
    }
)


export const fetchChangeCommandName = createAsyncThunk(
    'commands/fetchChangeCommandName',
    async ({projectId, commandId, commandName}: {projectId: string, commandId: string, commandName: string}, {dispatch, rejectWithValue, getState}) =>{
        try {
            const result = await fetchEditCommand(projectId, commandId, commandName);
            if (result.ok){
                const command: Command = await result.json();
                console.log('command', JSON.stringify(command, null, 2));
                return command;
            } else {
                return rejectWithValue("Could not change command");
            }
        } catch (error){
            createAction(error)
        }

    }
)

export const fetchChangeCommandUsers = createAsyncThunk(
    'commands/fetchChangeCommandUsers',
    async ({projectId, commandId, userList}: {projectId: string, commandId: string, userList: string[]}, {dispatch, rejectWithValue, getState}) =>{
        try {
            const result = await fetchEditCommandUsers(projectId, commandId, userList);
            if (result.ok){
                const command: Command = await result.json();
                console.log('command', JSON.stringify(command, null, 2));
                return true;
            } else {
                return rejectWithValue("Could not change command");
            }
        } catch (error){
            createAction(error)
        }

    }
)

export const fetchAddCommand = createAsyncThunk(
    'commands/fetchChangeCommandUsers',
    async (_, {dispatch, rejectWithValue, getState}) =>{
        const state = getState() as ReduxType;
        try {
            const result = await fetchAddNewCommand(state.ui.currentProject);
            if (result.ok){
                const command: Command = await result.json();
                console.log('command', JSON.stringify(command, null, 2));
                dispatch(addCommands(command))
                return command;
            } else {
                return rejectWithValue("Could not change command");
            }
        } catch (error){
            createAction(error)
        }

    }
)
