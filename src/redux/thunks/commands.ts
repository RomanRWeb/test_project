import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchCurrentCommands, fetchUserProject} from "../api";
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
