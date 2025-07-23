import {ReactNode} from "react";

export interface UserData {
    id: string,
    password: string,
}

export interface AuthState {
    user: UserData | null;
    isLoading: boolean;
    error: unknown | null | ReactNode | object;
}
