import {ReactNode} from "react";
import {ThemeConfig} from "antd";

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

export const darkThemeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#292929',
        colorBgContainer: '#323232',
        colorBorder: '#ffffff',
        colorTextBase: '#ffffff',
        colorTextPlaceholder: '#808080',
        colorBgContainerDisabled: '#151515',
        colorTextQuaternary: '#808080',
        colorBgSolid: '#1b1b1b',
        colorBgSolidHover: '#0165c1',
    },
    components: {
        Input: {
            hoverBorderColor: '#808080'
        }
    }
};

export const lightThemeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#0478e4',
        colorBgContainer: '#fdfdfd',
        colorBorder: '#d9d9d9',
        colorTextBase: '#000000',
        colorBgSolid: '#ffffff',
    },
};
