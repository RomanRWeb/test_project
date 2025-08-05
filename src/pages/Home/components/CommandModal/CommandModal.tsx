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
import {fetchUserTasks} from "../../../../redux/thunks/tasks";
import {setTasks} from "../../../../redux/slices/tasksSlice";


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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            }
        })
    );

    useEffect(() => {
        if (isModalOpen) {
            const command = commandsState.commands?.find((command) => command.id === uiState.currentCommand)
            setCommand(command)
            const isProjectCreator = projectState.projects?.some((project) => project.creatorId === authState.user.id)
            if (isProjectCreator) {
                setCreator(true)
            }
            const isCommandParticipant = command?.userList.some((userEmail) => userEmail === authState.user.email)
            if (isProjectCreator || isCommandParticipant) {
                setParticipant(true)
            }
            setUserList(command?.userList)
            taskSort()
            setActiveId(null);
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
        setCompleteTasks(sortedTasksArray.completedTasks)
        setTodoTasks(sortedTasksArray.todoTasks)
        setActiveTasks(sortedTasksArray.activeTasks)
    }, [tasksState.tasks])

    const checkState = () => {
        console.log('isParticipant', JSON.stringify(isParticipant, null, 2));
        console.log('command', JSON.stringify(command, null, 2));
        console.log('completeTasks', JSON.stringify(completeTasks, null, 2));
        console.log('todoTasks', JSON.stringify(todoTasks, null, 2));
        console.log('activeTasks', JSON.stringify(activeTasks, null, 2));
        console.log('activeId', JSON.stringify(activeId, null, 2));
    }

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

    const handleDragStart = useCallback((id) => {
        setActiveId(id);
        console.log('Find task with id', JSON.stringify(id, null, 2));
        console.log('tasksState.tasks', JSON.stringify(tasksState.tasks, null, 2));
        const selectedTask: Task = tasksState.tasks.find(task => task.id === id)
        console.log('selectedTask', JSON.stringify(selectedTask, null, 2));
        setDraggedTaskName(selectedTask.name)
    }, [tasksState.tasks]);

    const handleDragEnd = (event) => {
        const {over} = event;

        if (!over || !activeId) return;
        const taskEndContainer = over.id
        const task: Task = tasksState.tasks.find(task => task.id === activeId);
        const taskFrom: string = task.state;
        console.log('taskEndContainer', JSON.stringify(taskEndContainer, null, 2));
        console.log('taskFrom', JSON.stringify(taskFrom, null, 2));
        console.log('task', JSON.stringify(task, null, 2));
        //
        setActiveId(null);
    }

    const createDroppableList = useCallback(({taskList, taskListName}: { taskList: Task[], taskListName: string }) => {
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
    }, [tasksState.isLoading])

    const DarkToken = getDesignToken(darkThemeConfig);
    const LightToken = getDesignToken(lightThemeConfig);

    const itemStyle = {
        dark: {
            border: `1px solid ${DarkToken.colorTextBase}`,
        },
        light: {
            border: `1px solid ${LightToken.colorTextBase}`,
        }
    }

    const createDraggableItem = (item: Task) => {
        return (
            <DraggableItem id={item.id} onDragStart={handleDragStart}>
                <List.Item actions={[<CustomButton key={`${item.id}_inspect`} icon={<SearchOutlined/>}/>]}
                           style={darkTheme ? itemStyle.dark : itemStyle.light} className={"draggableTask"}>
                    <div style={{paddingLeft: "8px"}}>{item.name}</div>
                </List.Item>
            </DraggableItem>
        )
    }

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
                <Text>Количество активных задач: {activeTasks.length}</Text>
                <Text>Количество выполненных задач: {completeTasks.length}</Text>
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
                                <div>{user}</div>
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
            </Space>
            <Divider></Divider>
            <div className={"TasksListsHolder"}>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <CustomCard cardTitle={"Завершенные задачи"} hoverable={false} styles={{body: {padding: '0'}}}>
                        {createDroppableList({taskList: completeTasks, taskListName: "completeTasks"})}
                    </CustomCard>
                    <CustomCard cardTitle={"Активные задачи"} hoverable={false} styles={{body: {padding: '0'}}}>
                        {createDroppableList({taskList: activeTasks, taskListName: "activeTasks"})}
                    </CustomCard>
                    <CustomCard cardTitle={"Планируемые задачи"} hoverable={false} styles={{body: {padding: '0'}}}>
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
            <button onClick={checkState}>check</button>
        </Modal>
    )
}

export default CommandModal;
