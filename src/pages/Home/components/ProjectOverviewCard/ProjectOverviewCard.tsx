import * as React from 'react';
import {CustomCard} from "../../../../components/CustomCard/CustomCard";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {Typography} from "antd";
import {useCallback} from "react";


export const ProjectOverviewCard = () => {

    const projectState = useSelector((state: RootState) => state.projects);
    const uiState = useSelector((state: RootState) => state.ui);
    const {Title, Text} = Typography;

    const handleClick = useCallback(()=>{
        console.log('projectState', JSON.stringify(projectState, null, 2));
        console.log('uiState', JSON.stringify(uiState, null, 2));
    },[projectState, uiState]);

    return (
        <CustomCard hoverable={false}>
            <button onClick={handleClick}>check state</button>
            {/*<Title level={1}>{projectState.projects[uiState.currentProject].name}</Title>*/}
        </CustomCard>
    )
}

export default ProjectOverviewCard;
