import * as React from 'react';
import {CustomCard} from "../../../../components/CustomCard/CustomCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {Divider, Flex, message, Typography} from "antd";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Project, ProjectCard} from "../../../../types";
import {ReloadOutlined, EditOutlined} from '@ant-design/icons';
import {editProject, fetchProject} from "../../../../redux/thunks/projects";
import {unwrapResult} from "@reduxjs/toolkit";
import CustomButton from "../../../../components/CustomButton/CustomButton";

export const ProjectOverviewCard = ({project, reloadFunc}: ProjectCard) => {

    const projectState = useSelector((state: RootState) => state.projects);
    const authState = useSelector((state: RootState) => state.auth);
    const uiState = useSelector((state: RootState) => state.ui);
    const dispatch: AppDispatch = useDispatch();
    const {Title, Text} = Typography;
    const [messageApi, contextHolder] = message.useMessage();

    const handleClick = useCallback(() => {
        console.log('projectState', JSON.stringify(projectState, null, 2));
        console.log('uiState', JSON.stringify(uiState, null, 2));
        console.log('project', JSON.stringify(project, null, 2));
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
            } else{
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

    return (
        <CustomCard hoverable={false}>
            {contextHolder}
            <Flex vertical={false} justify={"space-between"}>
                <Title level={2} style={{paddingRight: "1ch"}}
                       editable={authState.user.id === project?.creatorId ? editConfig : false}>
                    {project?.name ? project.name : 'a'}</Title>
                <CustomButton icon={<ReloadOutlined/>} onClick={reloadFunc}></CustomButton>
            </Flex>
            <Text>ID создателя проекта: {project?.creatorId ? project.creatorId : ""}</Text>
            <Divider/>
            <button onClick={handleClick}>check state</button>
        </CustomCard>
    )
}

export default ProjectOverviewCard;
