import * as React from 'react';
import {CustomCard} from "../../../../components/CustomCard/CustomCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {Collapse, Divider, Flex, List, message, Skeleton, Typography} from "antd";
import {useCallback, useMemo} from "react";
import {Project, ProjectCard} from "../../../../types";
import {ReloadOutlined, EditOutlined, CaretRightOutlined} from '@ant-design/icons';
import {editProject} from "../../../../redux/thunks/projects";
import {unwrapResult} from "@reduxjs/toolkit";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import "./projectCommandsOverview.css"
import {setCurrentCommand} from "../../../../redux/slices/uiSlice";

export const ProjectOverviewCard = ({project, commands, tasks, reloadFunc}: ProjectCard) => {

    const projectState = useSelector((state: RootState) => state.projects);
    const commandsState = useSelector((state: RootState) => state.commands);
    const authState = useSelector((state: RootState) => state.auth);
    const uiState = useSelector((state: RootState) => state.ui);
    const tasksState = useSelector((state: RootState) => state.tasks)
    const dispatch: AppDispatch = useDispatch();
    const {Title, Text} = Typography;
    const [messageApi, contextHolder] = message.useMessage();

    const handleClick = useCallback(() => {
        console.log('projectState', JSON.stringify(projectState, null, 2));
        console.log('uiState', JSON.stringify(uiState, null, 2));
        console.log('project', JSON.stringify(project, null, 2));
        console.log('commands', JSON.stringify(commands, null, 2));
    }, [projectState, uiState, project]);

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

    const handleCardClick = useCallback((commandId: string) => {
        dispatch(setCurrentCommand(commandId))
    }, [])

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
                    <List
                        loading={commandsState.isLoading}
                        itemLayout="horizontal"
                        dataSource={commands}
                        renderItem={(item) => (
                            <List.Item>
                                <CustomCard style={{width: "100%"}}
                                            hoverable={true}
                                            loading={commandsState.isLoading}
                                            onCardClickFunc={() => handleCardClick(item.id)}
                                >
                                    <Flex vertical={false} justify={"space-between"}>
                                        <Title level={3}>{item.name}</Title>
                                        <CustomButton type={"link"}>ещё</CustomButton>
                                    </Flex>
                                </CustomCard>
                            </List.Item>
                        )}
                    />
                </Flex>
                <Flex vertical={true}>
                    {/*<List*/}
                    {/*    loading={tasksState.isLoading}*/}
                    {/*    itemLayout="horizontal"*/}
                    {/*    dataSource={tasks}*/}
                    {/*    renderItem={(item) => (*/}
                    {/*        <List.Item>*/}
                    {/*            */}
                    {/*        </List.Item>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    <Collapse
                        bordered={false}
                        accordion = {true}
                        expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                        // style={{ background: token.colorBgContainer }}
                        items={tasksState.tasks.map(task => (
                            {

                                key: task.id,
                                label: task.name,
                                children: <p>{task.description}</p>,
                            }
                        ))}
                    />
                    <div>text</div>
                </Flex>
            </div>
            <button onClick={handleClick}>check state</button>
        </CustomCard>
    )
}

export default ProjectOverviewCard;
