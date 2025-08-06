import * as React from 'react';
import withAuth from "../../hocs/withAuth";
import {AppDispatch, RootState} from "../../store";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {Flex, message, Tabs, Typography} from "antd";
import "./HomePage.css"
import {Command, Project, Task} from "../../types";
import {setCurrentProject} from "../../redux/slices/uiSlice";
import ProjectOverviewCard from "./components/ProjectOverviewCard/ProjectOverviewCard";
import {createNewProject, fetchProject} from "../../redux/thunks/projects";
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchCommands} from "../../redux/thunks/commands";
import {fetchUserTasks} from "../../redux/thunks/tasks";
import {setTasks} from "../../redux/slices/tasksSlice";

const HomePage: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);
    const uiState = useSelector((state: RootState) => state.ui)
    const projectState = useSelector((state: RootState) => state.projects)
    const commandsState = useSelector((state: RootState) => state.commands);
    const tasksState = useSelector((state: RootState) => state.tasks)

    const [items, setItems] = useState(projectState.projects);
    const [activeKey, setActiveKey] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const {Text} = Typography;

    const initProjectState: Project = {id: uiState.currentProject, name: 'Placeholder', creatorId: ''}
    const [activeProject, setActiveProject] = useState<Project>(initProjectState);
    const [activeCommands, setActiveCommands] = useState<Command[]>([]);
    const [activeTasks, setActiveTasks] = useState<Task[]>([]);
    const [isCreator, setIsCreator] = useState<boolean>(false);

    useEffect(() => {
        let currentProject = uiState.currentProject;
        console.log('uiState.currentProject', JSON.stringify(uiState.currentProject, null, 2));
        if (authState.user.projectsList.length > 0) {
            if (uiState.currentProject === "") {
                dispatch(setCurrentProject(authState.user.projectsList[0]));
                console.log('projectsList[0]', JSON.stringify(authState.user.projectsList[0], null, 2));
                currentProject = authState.user.projectsList[0]
            }
            console.log('currentProject', JSON.stringify(currentProject, null, 2));
            // console.log('------------------------------------------------')
            dispatch(fetchProject(currentProject)).then(unwrapResult).then((result) => {
                if (result === null) {
                    messageApi.error("Не получилось загрузить проект");
                }
            })
        } else {
            messageApi.info("У вас пока нет проектов")
        }
    }, []);

    useEffect(() => {
        let elFromStore: Project = projectState.projects.find(el => el.id === uiState.currentProject)
        console.log('elFromStore', JSON.stringify(elFromStore, null, 2));
        if (elFromStore?.creatorId === '') {
            dispatch(fetchProject(elFromStore.id)).then(unwrapResult).then((result) => {
                console.log('result', JSON.stringify(result, null, 2));
                if (result !== null) {
                    elFromStore = result
                    // getCurrentCommands()
                } else {
                    elFromStore = {id: uiState.currentProject, name: 'Placeholder', creatorId: ''};
                    messageApi.error("Не получилось загрузить проект");
                }
                console.log('elFromStore', JSON.stringify(elFromStore, null, 2));
                setActiveProject(elFromStore)
            })
        } else {
            console.log('commandsState.commands', JSON.stringify(commandsState.commands, null, 2));
            // const newCommandList = commandsState.commands.reduce((acc: Command[], el: Command)=>{
            //     if (el.projectId === elFromStore.id){
            //         return acc
            //     }
            // },[])
            // getCurrentCommands()
            setActiveProject(elFromStore)
        }
    }, [uiState.currentProject]);

    useEffect(() => {
        setItems(projectState.projects);
    }, [projectState.projects]);

    useEffect(() => {
        setActiveKey(uiState.currentProject)
        const currProject = projectState.projects.find(el => el.id === uiState.currentProject)
        if (currProject?.creatorId === authState.user.id) {
            setIsCreator(true)
            console.log('creator this project');
        }
    }, [uiState.currentProject]);

    useEffect(() => {
        if (uiState.currentCommand !== '') {
            // getCurrentCommands()
            console.log('uiState.currentCommand', JSON.stringify(uiState.currentCommand, null, 2));
            dispatch(fetchUserTasks()).then(unwrapResult).then((result) => {
                if (result !== null) {
                    console.log('taskChecking');
                    console.log('All tasks', JSON.stringify(result, null, 2));
                    dispatch(setTasks(result));
                } else {
                    messageApi.error("Не получилось загрузить задачи");
                }
            })
        }
    }, [uiState?.currentCommand]);

    useEffect(() => {
        const activeTasks = tasksState.tasks.filter(task => task.state === "active");
        console.log('activeTasks', JSON.stringify(activeTasks, null, 2));
        setActiveTasks(activeTasks)
    }, [tasksState.tasks])

    useEffect(() => {
        console.log('fetch command start')
        dispatch(fetchCommands(uiState.currentProject)).then(unwrapResult).then((result) => {
            if (result !== null) {
                setActiveCommands(result)
            } else {
                messageApi.error("Не получилось загрузить команды проекта")
            }
        })
    }, [uiState.currentProject]);

    const getCurrentCommands = useCallback(() => {
        dispatch(fetchCommands(uiState.currentProject)).then(unwrapResult).then((result) => {
            if (result !== null) {
                setActiveCommands(result)
            } else {
                messageApi.error("Не получилось загрузить команды проекта")
            }
        }).catch((rejectedValueOrSerializedError) => {
            console.log('rejectedValueOrSerializedError', JSON.stringify(rejectedValueOrSerializedError, null, 2));
            // handle error here
        })
    }, [uiState.currentProject])

    const reloadProject = useCallback(() => {
        dispatch(fetchProject(uiState.currentProject)).then(unwrapResult).then((result) => {
            if (result !== null) {
                setActiveProject(result)
            } else {
                messageApi.error("Не получилось загрузить проект")
            }
            console.log('result', JSON.stringify(result, null, 2));
        })
        getCurrentCommands()
    }, [uiState.currentProject])

    const addProject = useCallback((project: Project) => {
        console.log('project', JSON.stringify(project, null, 2));
        const newActiveKey = `newProject${project.id}`;
        dispatch(createNewProject(project)).then(unwrapResult).then((result) => {
            if (result !== null) {
                dispatch(setCurrentProject(project.id))
                const newPanes = [...items];
                newPanes.push({id: project.id, name: `newProject ${project.id}`, creatorId: newActiveKey});
                setItems(newPanes);
                setActiveKey(result.id)
            } else {
                messageApi.error("Не получилось создать проект");
            }
        })
    }, [items])

    const onChange = (newActiveProject: string) => {
        console.log('newActiveProject', JSON.stringify(newActiveProject, null, 2));
        dispatch(setCurrentProject(newActiveProject))
    };

    const onEdit = () => {
        addProject({id: "", name: "New Project", creatorId: authState.user.id});
    };

    return (
        <div className={"Home-page"}>
            {contextHolder}
            <Flex vertical={true}>
                <Tabs
                    defaultActiveKey={`${uiState.currentProject ? uiState.currentProject : null}`}
                    tabPosition={"top"}
                    type="editable-card"
                    onEdit={onEdit}
                    onChange={onChange}
                    activeKey={activeKey}
                    items={items.map((project) => {
                        const id = project.id;
                        return {
                            label: `${project.name}`,
                            key: id,
                            children: <ProjectOverviewCard project={activeProject} reloadFunc={reloadProject}
                                                           isCreator={isCreator}/>,
                            closable: false,
                        };
                    })}/>
                {authState.user.projectsList.length == 0 ?
                    <Flex justify={"center"} align={'center'} gap={"middle"} vertical={true}
                          style={{minHeight: "50vh"}}>
                        <Text>
                            Сейчас у вас нет проектов, вы можете его создать или подождать пока вас добавят в уже
                            существующий.
                        </Text>
                        <Text>
                            Если вы знаете что вас добавили в проект, но он не отображается, то, пожалуйста, обновите
                            страницу
                        </Text>
                    </Flex>
                    : null}
            </Flex>
        </div>
    )
};

export default withAuth(HomePage);
