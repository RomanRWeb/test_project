import {UserData} from "../../types/index.ts";

export const fetchByID = async (userData: UserData) => {
    const url = new URL(`https://687f7993efe65e520089de5c.mockapi.io/users/${userData.id}`);

    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const fetchNewUser = async (userData: UserData) => {
    const url = new URL(`https://687f7993efe65e520089de5c.mockapi.io/users`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(userData)
    })
}

export const fetchTasks = async (userData: UserData) => {
    const url = new URL(`https://687f7993efe65e520089de5c.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const fetchNewTasks = async (userData: UserData, { name: taskName, description: taskDescription} : {name: string, description:string}) => {
    const url = new URL(`https://687f7993efe65e520089de5c.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: taskName, description: taskDescription})
    })
}

export const fetchEditTasks = async (userData: UserData, { name: taskName, description: taskDescription} : {name: string, description:string}) => {
    const url = new URL(`https://687f7993efe65e520089de5c.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: taskName, description: taskDescription})
    })
}
