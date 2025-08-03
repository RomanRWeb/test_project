import {ReactNode} from "react";
import {ThemeConfig} from "antd";

export interface ReduxType {
    auth: AuthState;
    projects: ProjectsState;
    commands: CommandsState;
    tasks: TasksState;
    ui: UiState;
}

export interface AuthState {
    user: UserData | null;
    isLoading: boolean;
    error: unknown | null | ReactNode | object;
    projectsList: string[];
}

export interface UserData {
    id: string,
    email: string,
    password: string,
    projectsList: string[],
}

export interface Project {
    id: string,
    creatorId: string,
    name: string,
}

export interface ProjectsState {
    projects: Project[];
    isLoading: boolean;
    error: unknown | null | ReactNode | object;
}

export interface Command {
    id: string,
    name: string,
    projectId: string,
    userList: string[]
}

export interface CommandsState {
    commands: Command[];
    isLoading: boolean;
    error: unknown | null | ReactNode | object;
}

export interface Task {
    id: string,
    name: string,
    description: string,
    state: "complete" | "active" | "todo",
}

export interface TasksState {
    tasks: Task[];
    isLoading: boolean;
    error: unknown | null | ReactNode | object;
}

export interface UiState{
    currentProject: string;
    currentCommand: string;
}

export interface ProjectCard {
    reloadFunc: () => void;
    project: Project;
    commands: Command[];
    tasks: Task[];
}

export const darkThemeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#fdfdfd',
        colorBgContainer: '#323232',
        colorBorder: '#ffffff',
        colorTextBase: '#ffffff',
        colorTextPlaceholder: '#808080',
        colorBgContainerDisabled: '#151515',
        colorTextQuaternary: '#808080',
        colorBgSolid: '#1b1b1b',
        colorBgSolidHover: '#0165c1',
        colorBgSpotlight: '#808080',

    },
    components: {
        Input: {
            hoverBorderColor: '#808080'
        },
        Button: {
            defaultHoverBg: '#6a6a6a',
        },
        Message: {
            contentBg: '#323232',
        },
        Modal: {
            contentBg: '#323232'
        }
    }
};

export const lightThemeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#2c2c2c',
        colorBgContainer: '#fdfdfd',
        colorBorder: '#d9d9d9',
        colorTextBase: '#000000',
        colorBgSolid: '#ffffff',
    },
};
