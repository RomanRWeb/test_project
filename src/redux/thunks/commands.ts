import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchCurrentCommands, fetchEditCommand, fetchEditCommandUsers, fetchUserProject} from "../api";
import {Command} from "../../types";
import {setCommands} from "../slices/commandsSlice";


export const fetchCommands = createAsyncThunk(
    'commands/fetchCommands',
    async (projectId: string, {dispatch, rejectWithValue, getState}) =>{
        console.log("fetchCommands called");
        console.log('projectId', JSON.stringify(projectId, null, 2));
        if (projectId !== ''){
            try{
                const result = await fetchCurrentCommands(projectId);
                if (result.ok){
                    const commandsList: Command[] = await result.json();
                    console.log('commandsList', JSON.stringify(commandsList, null, 2));
                    dispatch(setCommands(commandsList))
                    return commandsList
                } else {
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
    'commands/fetchChangeCommandName',
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
