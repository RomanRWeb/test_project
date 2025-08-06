import {Command, Project, Task, UserData} from "../../types";

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

export const fetchEditUser = async (userData: UserData) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users/${userData.id}`);

    console.log('userData', JSON.stringify(userData, null, 2));

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({projectsList: userData.projectsList})
    })
}

export const fetchUserProject = async (projectId: string) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${projectId}`);

    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const fetchEditProject = async (project: Project) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${project.id}`);

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: project.name}),
    })
}

export const fetchNewProject = async (project: Project, userId: string) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: project.name, creatorId: userId})
    })
}

export const fetchCurrentCommands = async (projectId: string) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${projectId}/commands`);

    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const fetchAddNewCommand = async (projectId: string) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${projectId}/commands`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: "new command"})
    })
}

export const fetchEditCommand = async (projectId: string, commandId: string, commandName: string) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${projectId}/commands/${commandId}`);

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: commandName}),
    })
}

export const fetchEditCommandUsers = async (projectId: string, commandId: string, userList: string[]) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${projectId}/commands/${commandId}`);

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({userList: userList}),
    })
}

export const fetchTasks = async ({projId, commandId}: {
    projId: string,
    commandId: string,
}) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${projId}/commands/${commandId}/tasks`);


    return fetch(url, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
    })
}

export const editTasks = async ({projId, commandId, task}: { projId: string, commandId: string, task: {id: string, state: string}}) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/projects/${projId}/commands/${commandId}/tasks/${task.id}`);

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({state: task.state}),
    })
}

export const fetchNewTasks = async (userData: UserData, {name: taskName, description: taskDescription}: {
    name: string,
    description: string
}) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: taskName, description: taskDescription})
    })
}

export const fetchEditTasks = async (userData: UserData, {name: taskName, description: taskDescription}: {
    name: string,
    description: string
}) => {
    const url = new URL(`https://68834bc321fa24876a9d80bc.mockapi.io/users/${userData.id}/tasks`);

    return fetch(url, {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({name: taskName, description: taskDescription})
    })
}
