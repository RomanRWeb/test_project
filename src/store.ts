import {configureStore} from '@reduxjs/toolkit'
import {tasksSlice} from "./redux/slices/tasksSlice";
import {authSlice} from "./redux/slices/authSlice";
import {projectSlice} from "./redux/slices/projectSlice";
import {uiSlice} from "./redux/slices/uiSlice";


const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        tasks: tasksSlice.reducer,
        projects: projectSlice.reducer,
        ui: uiSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;

export default store;
