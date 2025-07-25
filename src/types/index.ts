import {ReactNode} from "react";

export interface UserData {
    id: string,
    email: string,
    password: string,
}

export interface AuthState {
    user: UserData | null;
    isLoading: boolean;
    error: unknown | null | ReactNode | object;
}

export interface Task {
    id: string,
    userID: string,
    name: string,
    description: string,
}

export interface TasksState {
    tasks: Task[];
    isLoading: boolean;
    error: unknown | null | ReactNode | object;
}

export interface ReduxType {
    auth: AuthState;
    tasks: TasksState;
}
