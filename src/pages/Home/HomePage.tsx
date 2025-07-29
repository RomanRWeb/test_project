import * as React from 'react';
import withAuth from "../../hocs/withAuth";
import {AppDispatch, RootState} from "../../store";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {Flex, message, Tabs} from "antd";
import "./HomePage.css"
import {Project} from "../../types";
import {setCurrentProject} from "../../redux/slices/uiSlice";
import ProjectOverviewCard from "./components/ProjectOverviewCard/ProjectOverviewCard";
import {createNewProject, fetchProject} from "../../redux/thunks/projects";
import {unwrapResult} from "@reduxjs/toolkit";

const HomePage: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);
    const uiState = useSelector((state: RootState) => state.ui)
    const projectState = useSelector((state: RootState) => state.projects)

    const [items, setItems] = useState(projectState.projects);
    const [activeKey, setActiveKey] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const initProjectState: Project = {id: uiState.currentProject, name: 'Placeholder', creatorId: ''}
    const [activeProject, setActiveProject] = useState<Project>(initProjectState);

    useEffect(() => {
        let currentProject = uiState.currentProject;
        console.log('uiState.currentProject', JSON.stringify(uiState.currentProject, null, 2));
        if (authState.user.projectsList.length > 0) {
            if (uiState.currentProject === ""){
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
        setItems(projectState.projects);
    }, [projectState.projects]);

    useEffect(() => {
        setActiveKey(uiState.currentProject)
    }, [uiState.currentProject]);

    useEffect(() => {
        let elFromStore: Project = projectState.projects.find(el => el.id === uiState.currentProject)
        console.log('elFromStore', JSON.stringify(elFromStore, null, 2));
        if (elFromStore?.creatorId === '') {
            dispatch(fetchProject(elFromStore.id)).then(unwrapResult).then((result) => {
                console.log('result', JSON.stringify(result, null, 2));
                if (result !== null) {
                    elFromStore = result
                } else {
                    elFromStore = {id: uiState.currentProject, name: 'Placeholder', creatorId: ''};
                    messageApi.error("Не получилось загрузить проект");
                }
                console.log('elFromStore', JSON.stringify(elFromStore, null, 2));
                setActiveProject(elFromStore)
            })
        } else {
            setActiveProject(elFromStore)
        }
    }, [uiState.currentProject]);

    const reloadProject = useCallback(()=>{
        dispatch(fetchProject(uiState.currentProject)).then(unwrapResult).then((result) => {
            if (result !== null){
                setActiveProject(result)
            } else {
                messageApi.error("Не получилось загрузить проект")
            }
            console.log('result', JSON.stringify(result, null, 2));
        })
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
                    defaultActiveKey={`${uiState.currentProject?uiState.currentProject: null}`}
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
                            children: <ProjectOverviewCard project={activeProject} reloadFunc = {reloadProject}/>,
                            closable: false,
                        };
                    })}/>
            </Flex>
        </div>
    )
};

export default withAuth(HomePage);
