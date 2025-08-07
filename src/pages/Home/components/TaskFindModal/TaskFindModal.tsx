import React, {useCallback, useEffect, useMemo} from "react";
import {Collapse, Flex, List, Modal, Typography} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {CustomInputField} from "../../../../components/CustomInputField/CustomInputField";
import {Task} from "../../../../types";
import {CaretRightOutlined} from "@ant-design/icons";

interface TaskFindModalProps {
    isModalOpen: boolean;
    handleCancel: () => void
}

const TaskFindModal = ({isModalOpen, handleCancel}: TaskFindModalProps) => {

    const tasksState = useSelector((state: RootState) => state.tasks)

    const [filter, setFilter] = React.useState<string>("");
    const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(tasksState.tasks)

    const {Title, Text} = Typography;

    useEffect(() => {
        setFilteredTasks(tasksState.tasks.filter(task => {
            if (task.name.toLowerCase().includes(filter.toLowerCase())) {
                return task
            }
        }))
    }, [filter])

    const createTasks = useMemo(() => {
        if (filteredTasks.length > 0){
            return filteredTasks?.map((task: Task) => ({
                key: task.id,
                label: task.name,
                children: <Flex vertical={true}>
                    <Text>статус: {task.state}</Text>
                    <Text>{task.description}</Text>
                </Flex>
            }));
        }
    }, [tasksState.tasks, filteredTasks]);

    return (
        <Modal
            width={{       //Название	Минимальная ширина (px)	Описание
                xs: '90%', //xs	                0	                очень маленькие экраны (мобильные)
                sm: '80%', //sm	                576px	            небольшие экраны (мобильные, планшеты)
                md: '70%', //md	                768px	            планшеты и небольшие ноутбуки
                lg: '60%', //lg	                992px	            стандартные ноутбуки и десктопы
                xl: '40%', //xl	                1200px	            большие десктопы
                xxl: '30%',//xxl	            1600px	            очень большие экраны
            }}
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <Title level={3}>Поиск задач</Title>
            <CustomInputField placeholder={"название задачи"}
                              value={filter}
                              onChange={(str) => {
                setFilter(str.target.value)
            }}/>

            <Collapse
                bordered={false}
                accordion={true}
                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                items={createTasks}
            />
        </Modal>
    )
}

export default TaskFindModal;
