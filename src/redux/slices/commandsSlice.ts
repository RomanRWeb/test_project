import {createSlice} from "@reduxjs/toolkit";
import {Command, CommandsState} from "../../types";
import {fetchChangeCommandName, fetchChangeCommandUsers, fetchCommands} from "../thunks/commands";


const initialCommandsState: CommandsState = {
    commands: [],
    isLoading: false,
    error: null,
}

export const commandsSlice = createSlice({
    name: "commandsSlice",
    initialState: initialCommandsState,
    reducers: {
        setCommands: (state, {payload}: { payload: Command[] }) => {
            state.commands = payload;
        },
        addCommands: (state, {payload}: { payload: Command }) => {
            state.commands = state.commands.concat(payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommands.pending, (state) => {
                console.log('fetchCommands.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(fetchCommands.fulfilled, (state) => {
                console.log('fetchCommands.fulfilled');
                state.isLoading = false;
            })
            .addCase(fetchCommands.rejected, (state, action) => {
                console.log('fetchCommands.rejected', JSON.stringify(action.payload, null, 2));
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchChangeCommandName.pending, (state) => {
                console.log('fetchChangeCommandName.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(fetchChangeCommandName.fulfilled, (state) => {
                console.log('fetchChangeCommandName.fulfilled');
                state.isLoading = false;
            })
            .addCase(fetchChangeCommandName.rejected, (state, action) => {
                console.log('fetchChangeCommandName.rejected', JSON.stringify(action.payload, null, 2));
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchChangeCommandUsers.pending, (state) => {
                console.log('fetchChangeCommandUsers.pending');
                state.isLoading = true;
                state.error = null
            })
            .addCase(fetchChangeCommandUsers.fulfilled, (state) => {
                console.log('fetchChangeCommandUsers.fulfilled');
                state.isLoading = false;
            })
            .addCase(fetchChangeCommandUsers.rejected, (state, action) => {
                console.log('fetchChangeCommandUsers.rejected', JSON.stringify(action.payload, null, 2));
                state.error = action.payload;
                state.isLoading = false;
            })
    }
});

export const {setCommands, addCommands} = commandsSlice.actions;
