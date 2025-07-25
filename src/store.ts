import {configureStore} from '@reduxjs/toolkit'
import {tasksSlice} from "./redux/slices/tasksSlice";
import {authSlice} from "./redux/slices/authSlice";


const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        tasks: tasksSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;

export default store;
