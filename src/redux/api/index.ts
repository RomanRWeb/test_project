import {UserData} from "../../types";

export const fetchByID = async (userData: UserData) => {
    const url = new URL(`https://687f7993efe65e520089de5c.mockapi.io/users/${userData.id}`);

    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const fetchNewUser = async (userData: UserData) => {
    const url = new URL(`https://687f7993efe65e520089de5c.mockapi.io/users/`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(userData)
    })
}
