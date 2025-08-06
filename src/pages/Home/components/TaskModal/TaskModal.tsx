import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Divider, Flex, List, message, Modal, Skeleton, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import "./TaskModal.css"
import {Commentary, Task} from "../../../../types";
import {EditOutlined} from "@ant-design/icons";
import {editCurrentTaskDescription, editCurrentTaskName} from "../../../../redux/thunks/tasks";
import {unwrapResult} from "@reduxjs/toolkit";

interface Props {
    onCancel: () => void;
    isModalOpen: boolean;
    isParticipant: boolean;
}

const TaskModal = ({onCancel, isModalOpen, isParticipant}: Props) => {

    const authState = useSelector((state: RootState) => state.auth);
    const uiState = useSelector((state: RootState) => state.ui);
    const tasksState = useSelector((state: RootState) => state.tasks)

    const dispatch: AppDispatch = useDispatch();

    const {Title, Text} = Typography;
    const [messageApi, contextHolder] = message.useMessage();

    const [currentTask, setCurrentTask] = useState<Task>({
        id: '',
        comments: [{email: '', commentary: ''}],
        name: '',
        description: '',
        state: 'todo'
    });

    useEffect(() => {
        if (isModalOpen) {
            const currTask = tasksState.tasks.find(task => task.id === uiState.currentTask)
            console.log('currTask', JSON.stringify(currTask, null, 2));
            setCurrentTask(currTask)
        }
    }, [isModalOpen])

    const createComment = (item: Commentary) => {
        return (
            <List.Item>
                <Flex vertical={true}>
                    <Title level={5}>{item.email}</Title>
                    <Text>{item.commentary}</Text>
                </Flex>
            </List.Item>
        )
    }

    const handleChangeTaskName = useCallback((str: string) => {
        dispatch(editCurrentTaskName({name: str, id: uiState.currentTask})).then(unwrapResult).then((result) => {
            console.log('result', JSON.stringify(result, null, 2));
            if (result !== null) {
                setCurrentTask(result)
            } else {
                messageApi.error("Не получилось сменить название задачи");
            }
        }).catch((e) => {
            messageApi.error("Не получилось сменить название задачи");
            console.log('Change task name error', JSON.stringify(e, null, 2));
        })
    }, [uiState.currentTask])

    const editConfigTitle = useMemo(() => {
        return ({
                icon: <EditOutlined/>,
                onChange: handleChangeTaskName,
                tooltip: 'Редактировать',
                text: currentTask?.name ? currentTask.name : "Placeholder",
                maxLength: 100,
            }
        )
    }, [currentTask?.name]);

    const handleChangeTaskDescription = useCallback((str: string) => {
        dispatch(editCurrentTaskDescription({
            description: str,
            id: uiState.currentTask
        })).then(unwrapResult).then((result) => {
            console.log('result', JSON.stringify(result, null, 2));
            if (result !== null) {
                setCurrentTask(result)
            } else {
                messageApi.error("Не получилось сменить название задачи");
            }
        }).catch((e) => {
            messageApi.error("Не получилось сменить название задачи");
            console.log('Change task name error', JSON.stringify(e, null, 2));
        })
    }, [uiState.currentTask])

    const editConfigDescription = useMemo(() => {
        return ({
                icon: <EditOutlined/>,
                onChange: handleChangeTaskDescription,
                tooltip: 'Редактировать',
                text: currentTask?.description ? currentTask.description : "Placeholder",
                maxLength: 999,
            }
        )
    }, [currentTask?.description]);

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
            onCancel={onCancel}
        >
            {contextHolder}
            <div className={"taskModal"}>
                <Skeleton loading={tasksState.isLoading}>
                    <Flex vertical={true}>
                        <Title level={3} editable={isParticipant ? editConfigTitle : false}> {currentTask?.name}</Title>
                        <Divider/>
                        <Text
                            editable={isParticipant ? editConfigDescription : false}> {currentTask?.description}</Text>
                    </Flex>
                </Skeleton>
                <Flex>
                    <List
                        split={false}
                        loading={tasksState.isLoading}
                        itemLayout="horizontal"
                        dataSource={currentTask?.comments}
                        renderItem={(item) => (createComment(item))}
                    />
                </Flex>
            </div>
        </Modal>
    )
}

export default TaskModal;
