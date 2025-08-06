import * as React from 'react';
import {useCallback, useMemo, useState} from 'react';
import {CustomCard} from "../../../../components/CustomCard/CustomCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {Collapse, Divider, Flex, List, message, Skeleton, Spin, Typography} from "antd";
import {Command, Project, Task} from "../../../../types";
import {CaretRightOutlined, EditOutlined, LoadingOutlined, ReloadOutlined} from '@ant-design/icons';
import {editProject} from "../../../../redux/thunks/projects";
import {unwrapResult} from "@reduxjs/toolkit";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import "./projectOverviewCard.css"
import {setCurrentCommand} from "../../../../redux/slices/uiSlice";
import CommandModal from "../CommandModal/CommandModal";
import {fetchAddCommand} from "../../../../redux/thunks/commands";

interface ProjectCard {
    reloadFunc: () => void;
    project: Project;
    isCreator: boolean;
}

export const ProjectOverviewCard = ({project, reloadFunc, isCreator}: ProjectCard) => {

    const projectState = useSelector((state: RootState) => state.projects);
    const commandsState = useSelector((state: RootState) => state.commands);
    const authState = useSelector((state: RootState) => state.auth);
    const uiState = useSelector((state: RootState) => state.ui);
    const tasksState = useSelector((state: RootState) => state.tasks)
    const dispatch: AppDispatch = useDispatch();
    const {Title, Text} = Typography;
    const [messageApi, contextHolder] = message.useMessage();

    const [command, setCommand] = useState<Command>({id: '0', name: '', projectId: '', userList: []});
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const handleClick = useCallback(() => {
    //     console.log('-------------------------------------------------')
    //     console.log('projectState', JSON.stringify(projectState, null, 2));
    //     console.log('project', JSON.stringify(project, null, 2));
    //     console.log('commandsState', JSON.stringify(commandsState, null, 2));
    //     console.log('uiState', JSON.stringify(uiState, null, 2));
    //     console.log('-------------------------------------------------')
    // }, [projectState, uiState, project, commandsState]);

    const handleChangeProjectName = useCallback((str: string) => {
        console.log('start redact dispatch');
        console.log('project', JSON.stringify(project, null, 2));
        console.log('projectName', JSON.stringify(str, null, 2));
        dispatch(editProject({
            id: project.id,
            name: str,
            creatorId: project.creatorId
        })).then(unwrapResult).then((result: Project) => {
            if (result !== null) {
                messageApi.success("Название проекта изменено")
                reloadFunc()
            } else {
                messageApi.error("Не получилось изменить название проекта")
            }
        })
    }, [project])

    const editConfig = useMemo(() => {
        return ({
                icon: <EditOutlined/>,
                onChange: handleChangeProjectName,
                tooltip: 'Редактировать',
                text: project?.name ? project.name : "Placeholder",
                maxLength: 100,
            }
        )
    }, [project]);

    const handleCardClick = useCallback((command: Command) => {
        dispatch(setCurrentCommand(command.id))
        setCommand(command)
    }, [])

    const showModal = useCallback(() => {
        dispatch(setCurrentCommand(command.id))
        setCommand(command)
        setIsModalOpen(true);
    }, [command])

    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
    }, [])

    const handleAddCommand = useCallback(() => {
        dispatch(fetchAddCommand()).then(unwrapResult).then((result: Command) => {
            if (result !== null) {
                console.log('new command', JSON.stringify(result, null, 2));
            }
            else {
                messageApi.error("Не получилось создать команду")
            }
        })
    }, [])

    const createActiveTask = useMemo(() => {
        const activeTasks = tasksState.tasks?.filter((el) => el.state === "active");
        return activeTasks?.map(task => ({
            key: task.id,
            label: task.name,
            children: <p>{task.description}</p>
        }));
    }, [tasksState.tasks]);

    const createCommandItem = (item: Command) => {
        return (
            <List.Item style={{padding: '8px'}}>
                <CustomCard style={{width: "100%", minHeight: "80px"}}
                            hoverable={true}
                            loading={commandsState.isLoading}
                            size="small"
                            onCardClickFunc={() => handleCardClick(item)}
                >
                    <Flex vertical={false} justify={"space-between"}>
                        <Title level={3}>{item.name}</Title>
                    </Flex>
                </CustomCard>
            </List.Item>
        )
    }

    return (
        <CustomCard hoverable={false}>
            {contextHolder}
            <Skeleton loading={projectState.isLoading}>
                <Flex vertical={false} justify={"space-between"}>

                    <Title level={2} style={{paddingRight: "1ch"}}
                           editable={authState.user.id === project?.creatorId ? editConfig : false}>
                        {project?.name ? project.name : 'a'}</Title>

                    <CustomButton icon={<ReloadOutlined/>} onClick={reloadFunc}></CustomButton>
                </Flex>
                <Text>ID создателя проекта: {project?.creatorId ? project.creatorId : ""}</Text>
                <Divider/>
            </Skeleton>
            <div className={"projectCommandsOverview"}>
                <Flex vertical={true}>
                    <CustomCard cardTitle={"Команды проекта"} hoverable={false} styles={{body: {padding: '0'}}}>
                        <List
                            split={false}
                            loading={commandsState.isLoading}
                            itemLayout="horizontal"
                            dataSource={commandsState.commands}
                            renderItem={(command) => createCommandItem(command)}
                        >
                            {isCreator ?
                                <List.Item style={{padding: '8px'}}>
                                    <CustomButton onClick={handleAddCommand} style={{flex: "1"}}>+</CustomButton>
                                </List.Item> : null}
                        </List>
                    </CustomCard>
                </Flex>
                <Flex vertical={true}>
                    {command.id != '0' ?
                        <>
                            <Flex justify={"space-between"}>
                                <Skeleton loading={commandsState.isLoading}>
                                    <Title level={3}>{command.name}</Title>
                                    <CustomButton type={"link"} onClick={showModal}>ещё</CustomButton>
                                </Skeleton>
                            </Flex>

                            <Text>Активные задачи:</Text>
                            <Divider size={"middle"}/>
                            {!tasksState.isLoading ?
                                <Collapse
                                    bordered={false}
                                    accordion={true}
                                    expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                    items={createActiveTask}
                                /> :
                                <Spin indicator={<LoadingOutlined spin/>}/>
                            }
                            {!tasksState.tasks && !tasksState.isLoading ? <Text style={{display: 'flex', justifyContent: 'center'}}>Сейчас активных задач нет</Text> : null}
                            <Divider size={"middle"}/>
                            <Text>Участники:</Text>
                            {!commandsState.isLoading ?
                                <List
                                    loading={commandsState.isLoading}
                                    itemLayout="horizontal"
                                    dataSource={command.userList}
                                    renderItem={(user) => (
                                        <List.Item>
                                            <Text key={user}>{user}</Text>
                                        </List.Item>
                                    )}
                                /> :
                                <Spin indicator={<LoadingOutlined spin/>}/>
                            }
                        </>
                        : <Title level={4} style={{flex: "1 1 auto", textAlign: "center", alignContent: "center"}}>Выберите
                            команду</Title>
                    }
                </Flex>
            </div>
            {/*<button onClick={handleClick}>check state</button>*/}
            <CommandModal isModalOpen={isModalOpen} handleCancel={handleCancel}/>
        </CustomCard>
    )
}

export default ProjectOverviewCard;
