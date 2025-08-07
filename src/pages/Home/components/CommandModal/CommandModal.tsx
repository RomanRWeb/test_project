import {Divider, Flex, List, message, Modal, Space, Typography} from "antd";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {Command, darkThemeConfig, lightThemeConfig, Task} from "../../../../types";
import {EditOutlined, CheckOutlined, CloseOutlined, UserDeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchChangeCommandName, fetchChangeCommandUsers} from "../../../../redux/thunks/commands";
import "./CommandModal.css"
import {CustomCard} from "../../../../components/CustomCard/CustomCard";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import {addProjectToUser, deleteUserFromProject} from "../../../../redux/thunks/projects";
import {CustomInputField} from "../../../../components/CustomInputField/CustomInputField";
import {DndContext, useSensor, useSensors, PointerSensor, DragOverlay} from '@dnd-kit/core';
import {DraggableItem, DroppableContainer} from "../DnDItems/DndItems";
import getDesignToken from "antd/es/theme/getDesignToken";
import {ThemeContext} from "../../../../App";
import {createNewTasks, editTask} from "../../../../redux/thunks/tasks";
import {setTasks} from "../../../../redux/slices/tasksSlice";
import {setCommands} from "../../../../redux/slices/commandsSlice";
import {setCurrentTask} from "../../../../redux/slices/uiSlice";
import TaskModal from "../TaskModal/TaskModal";
import TaskFindModal from "../TaskFindModal/TaskFindModal";


interface CommandModalProps {
    isModalOpen: boolean,
    handleCancel: () => void
}


const CommandModal: React.FC<CommandModalProps> = ({isModalOpen, handleCancel}: CommandModalProps) => {

    const projectState = useSelector((state: RootState) => state.projects);
    const commandsState = useSelector((state: RootState) => state.commands);
    const authState = useSelector((state: RootState) => state.auth);
    const uiState = useSelector((state: RootState) => state.ui);
    const tasksState = useSelector((state: RootState) => state.tasks)

    const dispatch: AppDispatch = useDispatch();

    const {Title, Text} = Typography;
    const [messageApi, contextHolder] = message.useMessage();
    const {darkTheme, toggleTheme} = useContext(ThemeContext);

    const [command, setCommand] = useState<Command>({id: '0', name: '', projectId: '', userList: []});
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [activeTasks, setActiveTasks] = useState<Task[]>([]);
    const [completeTasks, setCompleteTasks] = useState<Task[]>([]);
    const [todoTasks, setTodoTasks] = useState<Task[]>([])
    const [userList, setUserList] = useState<string[]>([]);

    const [isParticipant, setParticipant] = useState<boolean>(false)
    const [isCreator, setCreator] = useState<boolean>(false)
    const [addUserState, setAddUserState] = useState<boolean>(false)
    const [addUserLogin, setAddUserLogin] = useState<string>("")

    const [activeId, setActiveId] = useState(null);
    const [draggedTaskName, setDraggedTaskName] = useState<string>("")

    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false)
    const [taskFindModalOpen, setTaskFindModalOpen] = useState<boolean>(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            }
        })
    );

    useEffect(() => {
        console.log('useEffect triggered');
        if (isModalOpen) {
            const command = commandsState.commands?.find((command) => command.id === uiState.currentCommand)
            setCommand(command)
            const isProjectCreator = projectState.projects?.some((project) => project.creatorId === authState.user.id)
            if (isProjectCreator) {
                setCreator(true)
            }
            console.log('isProjectCreator', JSON.stringify(isProjectCreator, null, 2));
            const isCommandParticipant = command?.userList.some((userEmail) => userEmail === authState.user.email)
            if (isProjectCreator || isCommandParticipant) {
                setParticipant(true)
            }
            console.log('isCommandParticipant', JSON.stringify(isCommandParticipant, null, 2));
            setUserList(command?.userList)
            taskSort()
            setActiveId(null);
        } else {
            setAllTasks([])
            setCompleteTasks([])
            setActiveTasks([])
            setTodoTasks([])
        }
    }, [isModalOpen]);

    const taskSort = useCallback(() => {
        const sortedTasksArray = tasksState.tasks?.reduce((acc, task) => {
            switch (task.state) {
                case "active":
                    acc.activeTasks.push(task)
                    break;
                case "complete":
                    acc.completedTasks.push(task)
                    break;
                case "todo":
                    acc.todoTasks.push(task)
                    break;
            }
            return acc
        }, {activeTasks: [], completedTasks: [], todoTasks: []} as {
            activeTasks: Task[],
            completedTasks: Task[],
            todoTasks: Task[]
        })
        setCompleteTasks(sortedTasksArray?.completedTasks)
        setTodoTasks(sortedTasksArray?.todoTasks)
        setActiveTasks(sortedTasksArray?.activeTasks)
        setAllTasks(tasksState.tasks)
        console.log("all tasks set")
    }, [tasksState.tasks])

    const handleChangeCommandName = useCallback((str: string) => {
        dispatch(fetchChangeCommandName({
            projectId: uiState.currentProject,
            commandId: command.id,
            commandName: str
        })).then(unwrapResult).then((result) => {
            if (result !== null) {
                setCommand(result)
            } else {
                messageApi.error("Не получилось изменить название")
            }
        })
    }, [command?.id, uiState.currentProject])

    const editConfig = useMemo(() => {
        return ({
                icon: <EditOutlined/>,
                onChange: handleChangeCommandName,
                tooltip: 'Редактировать',
                text: command?.name ? command.name : "Placeholder",
                maxLength: 100,
            }
        )
    }, [command?.name, handleChangeCommandName]);

    const addUser = useCallback(() => {
        dispatch(addProjectToUser(addUserLogin)).then(unwrapResult).then((result) => {
            console.log('result', JSON.stringify(result, null, 2));
            if (result === true) {
                const newUsersList = userList.concat(addUserLogin)
                dispatch(fetchChangeCommandUsers({
                    commandId: command.id,
                    projectId: uiState.currentProject,
                    userList: newUsersList
                })).then(unwrapResult).then((result) => {
                    if (result === true) {
                        const newCommandsList = commandsState.commands.map(command => {
                            if (command.id === uiState.currentCommand) {
                                return {
                                    id: command.id,
                                    name: command.name,
                                    userList: newUsersList,
                                    projectId: command.projectId
                                } as Command
                            } else return command
                        })
                        dispatch(setCommands(newCommandsList))
                        setUserList(newUsersList);
                        setAddUserState(false)
                        setAddUserLogin("")
                        messageApi.success("пользователь успешно добавлен")
                    } else {
                        messageApi.error("Не получилось добавить пользователя")
                    }
                })
            } else {
                messageApi.error("Что-то пошло не так, проверьте логин пользователя и повторите еще раз")
            }
        }).catch((e) => {
            messageApi.error("Что-то пошло не так, проверьте логин пользователя и повторите еще раз")
            console.log('e', JSON.stringify(e, null, 2));
        })
    }, [command?.id, addUserLogin])

    const deleteUser = useCallback((userEmail: string) => {
        dispatch(deleteUserFromProject(userEmail)).then(unwrapResult).then((result) => {
            console.log('result', JSON.stringify(result, null, 2));
            if (result === true) {
                const newUsersList = userList.filter(el => el !== userEmail)
                console.log('newUsersList', JSON.stringify(newUsersList, null, 2));
                dispatch(fetchChangeCommandUsers({
                    commandId: command.id,
                    projectId: uiState.currentProject,
                    userList: newUsersList
                })).then(unwrapResult).then((result) => {
                    if (result === true) {
                        setUserList(newUsersList);
                        const newCommandsList = commandsState.commands.map(command => {
                            if (command.id === uiState.currentCommand) {
                                return {
                                    id: command.id,
                                    name: command.name,
                                    userList: newUsersList,
                                    projectId: command.projectId
                                } as Command
                            } else return command
                        })
                        dispatch(setCommands(newCommandsList))
                        messageApi.success("пользователь успешно удален")
                    } else {
                        messageApi.error("Не получилось удалить пользователя из команды")
                    }
                })
            } else {
                messageApi.error("Что-то пошло не так")
            }
        })
    }, [command?.id, addUserLogin])

    const handleCancelAddUser = useCallback(() => {
        setAddUserState(false)
        setAddUserLogin("")
    }, [])

    const handleDragStart = (id) => {
        setActiveId(id);
        console.log('id', JSON.stringify(id, null, 2));
        console.log('allTasks', JSON.stringify(allTasks, null, 2));
        const selectedTask: Task = allTasks.find(task => task.id === id)
        setDraggedTaskName(selectedTask?.name ? selectedTask.name : "")
    };

    const handleDragEnd = (event) => {
        const {over} = event;

        if (!over || !activeId) return;
        const taskEndContainer: "completeTasks" | "activeTasks" | "todoTasks" = over.id
        const task: Task = allTasks.find(task => task.id === activeId);
        const taskFrom: string = task.state;
        const taskTo: string = taskEndContainer.slice(0, -5)
        console.log('taskTo', JSON.stringify(taskTo, null, 2));
        if (taskFrom === taskTo) return;

        console.log('taskEndContainer', JSON.stringify(taskEndContainer, null, 2));
        console.log('taskFrom', JSON.stringify(taskFrom, null, 2));
        console.log('task', JSON.stringify(task, null, 2));
        let newState: string = ''

        switch (taskEndContainer) {
            case 'completeTasks':
                newState = 'complete'
                break;
            case 'activeTasks':
                newState = 'active'
                break;
            case 'todoTasks':
                newState = 'todo'
                break;
        }

        console.log('newState', JSON.stringify(newState, null, 2));

        dispatch(editTask({id: task.id, state: newState})).then(unwrapResult).then((result) => {
            if (result != null) {
                const fetchedTask: Task = result
                const newTaskList: Task[] = allTasks.map(task => task.id === fetchedTask.id ? fetchedTask : task)
                setAllTasks(newTaskList);
                dispatch(setTasks(newTaskList))
                console.log('fetchedTask.state', JSON.stringify(fetchedTask.state, null, 2));
                //add task to new container
                let newTasksList: Task[] = [];
                switch (taskEndContainer) {
                    case 'completeTasks':
                        newTasksList = completeTasks
                        newTasksList.push(fetchedTask)
                        setCompleteTasks(newTasksList)
                        break;
                    case 'activeTasks':
                        newTasksList = activeTasks
                        newTasksList.push(fetchedTask)
                        setActiveTasks(newTasksList)
                        break;
                    case 'todoTasks':
                        newTasksList = todoTasks
                        newTasksList.push(fetchedTask)
                        setTodoTasks(newTasksList)
                        break;
                }
                console.log(`Added to ${taskEndContainer}`, JSON.stringify(newTasksList, null, 2));
                //delete task from previous container
                switch (taskFrom) {
                    case 'complete':
                        newTasksList = completeTasks.filter(taskInList => taskInList.id !== fetchedTask.id)
                        setCompleteTasks(newTasksList)
                        break;
                    case 'active':
                        newTasksList = activeTasks.filter(taskInList => taskInList.id !== fetchedTask.id)
                        setActiveTasks(newTasksList)
                        break;
                    case 'todo':
                        newTasksList = todoTasks.filter(taskInList => taskInList.id !== fetchedTask.id)
                        setTodoTasks(newTasksList)
                        break;
                }
                console.log(`Deleted from ${taskFrom}`, JSON.stringify(newTasksList, null, 2));
            } else {
                messageApi.error("Не получилось изменить статус задачи")
            }
        })
        setActiveId(null);
    }

    const createDroppableList = ({taskList, taskListName}: { taskList: Task[], taskListName: string }) => {
        return (
            <DroppableContainer id={taskListName}>
                <List
                    split={false}
                    className={"TasksLists"}
                    loading={tasksState.isLoading}
                    itemLayout="horizontal"
                    dataSource={taskList}
                    renderItem={(item) => (createDraggableItem(item))}>
                </List>
            </DroppableContainer>
        )
    }

    const DarkToken = getDesignToken(darkThemeConfig);
    const LightToken = getDesignToken(lightThemeConfig);

    const itemStyle = {
        dark: {
            border: `1px solid ${DarkToken.colorBorder}`,
        },
        light: {
            border: `1px solid ${LightToken.colorBorder}`,
        }
    }

    const openTaskModal = useCallback((taskId: string) => {
        dispatch(setCurrentTask(taskId))
        setIsTaskModalOpen(true)
    }, [])

    const handleTaskModalCancel = useCallback(() => {
        const editedTask: Task = tasksState.tasks.find(el => el.id == uiState.currentTask)
        setAllTasks(allTasks.map(task => {
            return task.id === editedTask.id ? editedTask : task
        }))
        switch (editedTask.state) {
            case 'complete':
                setCompleteTasks(completeTasks.map(task => {
                    return task.id === editedTask.id ? editedTask : task
                }))
                break;
            case 'active':
                setActiveTasks(activeTasks.map(task => {
                    return task.id === editedTask.id ? editedTask : task
                }))
                break;
            case 'todo':
                setTodoTasks(todoTasks.map(task => {
                    return task.id === editedTask.id ? editedTask : task
                }))
                break;
        }
        setIsTaskModalOpen(false);
    }, [completeTasks, activeTasks, todoTasks, allTasks, tasksState.tasks, uiState.currentTask])

    const createDraggableItem = (item: Task) => {
        return (
            <DraggableItem id={item.id} onDragStart={handleDragStart}>
                <List.Item actions={[<CustomButton key={`${item.id}_inspect`} icon={<SearchOutlined/>}/>]}
                           style={darkTheme ? itemStyle.dark : itemStyle.light} className={"draggableTask"}
                           onClick={() => openTaskModal(item.id)}>
                    <div style={{paddingLeft: "8px"}} className={"textInList"}>{item.name}</div>
                </List.Item>
            </DraggableItem>
        )
    }

    const addPlannedTask = useCallback(() => {
        dispatch(createNewTasks()).then(unwrapResult).then((result) => {
            if (result !== null) {
                setTodoTasks(todoTasks.concat(result))
                setAllTasks(allTasks.concat(result))
            } else {
                messageApi.error("Не удалось добавить задачу")
            }
        }).catch((e) => {
            console.log('addPlannedTask', JSON.stringify(e, null, 2));
            messageApi.error("Не удалось добавить задачу")
        })
    }, [todoTasks, allTasks])

    const taskFindOpenModal = useCallback(()=>{
        setTaskFindModalOpen(true)
    }, [])

    const taskFindCloseModal = useCallback(()=>{
        setTaskFindModalOpen(false)
    }, [])

    return (
        <Modal
            width={{       //Название	Минимальная ширина (px)	Описание
                xs: '90%', //xs	                0	                очень маленькие экраны (мобильные)
                sm: '90%', //sm	                576px	            небольшие экраны (мобильные, планшеты)
                md: '80%', //md	                768px	            планшеты и небольшие ноутбуки
                lg: '70%', //lg	                992px	            стандартные ноутбуки и десктопы
                xl: '70%', //xl	                1200px	            большие десктопы
                xxl: '60%',//xxl	            1600px	            очень большие экраны
            }}
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
        >
            {contextHolder}
            <Title level={2} editable={isCreator ? editConfig : false}>{command?.name}</Title>
            <Divider size={"middle"}></Divider>
            <Space direction={"vertical"} size={0} style={{"width": "100%"}}>
                <Text>Количество активных задач: {activeTasks?.length}</Text>
                <Text>Количество выполненных задач: {completeTasks?.length}</Text>
                <CustomCard cardTitle={"Список участников"} hoverable={false}
                            style={{minWidth: "200px", maxWidth: "600px"}} extra={isCreator ?
                    <CustomButton onClick={() => setAddUserState(true)} size={"middle"}>+</CustomButton> : <></>}>
                    <List
                        split={false}
                        size="default"
                        loading={commandsState.isLoading}
                        itemLayout="horizontal"
                        dataSource={userList}
                        renderItem={(user) => (
                            <List.Item actions={isCreator ? [<CustomButton icon={<UserDeleteOutlined/>}
                                                                           key={`userButton_${user}`}
                                                                           onClick={() => deleteUser(user)}/>] : []}>
                                <div style={{textWrap: "stable"}} className={"textInList"}>{user}</div>
                            </List.Item>
                        )}>
                        {addUserState ? <Flex style={{width: '100%'}} gap={"0.5rem"}>
                            <CustomInputField value={addUserLogin}
                                              style={{flex: 1}}
                                              onChange={(e) => setAddUserLogin(e.target.value)}
                                              disabled={commandsState.isLoading}
                                              placeholder={"введите email"}
                                              size={"middle"}
                            />
                            <CustomButton size={"middle"} icon={<CheckOutlined/>} onClick={addUser}></CustomButton>
                            <CustomButton size={"middle"} icon={<CloseOutlined/>}
                                          onClick={handleCancelAddUser}></CustomButton>
                        </Flex> : null}
                    </List>
                </CustomCard>
                <CustomButton onClick={()=>setTaskFindModalOpen(true)} style={{marginBlock: '6px'}}>Поиск задач</CustomButton>
            </Space>
            <Divider></Divider>
            <div className={"TasksListsHolder"}>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <CustomCard cardTitle={"Завершенные задачи"} hoverable={false} styles={{body: {padding: '0'}, title: {textWrap: 'wrap'}}}>
                        {createDroppableList({taskList: completeTasks, taskListName: "completeTasks"})}
                    </CustomCard>
                    <CustomCard cardTitle={"Активные задачи"} hoverable={false} styles={{body: {padding: '0'}, title: {textWrap: 'wrap'}}}>
                        {createDroppableList({taskList: activeTasks, taskListName: "activeTasks"})}
                    </CustomCard>
                    <CustomCard cardTitle={"Планируемые задачи"} hoverable={false} styles={{body: {padding: '0'}, title: {textWrap: 'wrap'}}}
                                extra={isParticipant || isCreator ?
                                    <CustomButton onClick={addPlannedTask}>+</CustomButton> : null}>
                        {createDroppableList({taskList: todoTasks, taskListName: "todoTasks"})}
                    </CustomCard>

                    <DragOverlay>
                        {activeId ? (
                            <div style={darkTheme ? itemStyle.dark : itemStyle.light} className={"draggableTask"}>
                                <div style={{
                                    paddingLeft: "8px",
                                    minHeight: '65px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    zIndex: 100
                                }}>
                                    {draggedTaskName}
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
            <Text>*для перетаскивания задачи нужно немного ее удерживать</Text>
            <TaskModal isModalOpen={isTaskModalOpen} onCancel={handleTaskModalCancel}
                       isParticipant={isCreator || isParticipant}></TaskModal>
            <TaskFindModal isModalOpen={taskFindModalOpen} handleCancel={taskFindCloseModal}/>
            {/*<button onClick={checkState}>check</button>*/}
        </Modal>
    )
}

export default CommandModal;
