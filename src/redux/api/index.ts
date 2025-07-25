import {UserData} from "../../types";

export const fetchByID = async (userData: UserData) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users/`);
    url.searchParams.append('email', userData.email);

    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const fetchNewUser = async (userData: UserData) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(userData)
    })
}

export const fetchTasks = async (userData: UserData) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const fetchNewTasks = async (userData: UserData, { name: taskName, description: taskDescription} : {name: string, description:string}) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: taskName, description: taskDescription})
    })
}

export const fetchEditTasks = async (userData: UserData, { name: taskName, description: taskDescription} : {name: string, description:string}) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: taskName, description: taskDescription})
    })
}
