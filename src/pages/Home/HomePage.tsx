import * as React from 'react';
import withAuth from "../../hocs/withAuth.tsx";
import {AppDispatch, RootState} from "../../store.ts";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserTasks} from "../../redux/thunks/tasks.ts";
import {useCallback} from "react";

const HomePage: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const taskState = useSelector((state: RootState) => state.tasks);

    const handleClick = useCallback(()=>{
       dispatch(fetchUserTasks());
    },[])

    const handleClick2 = useCallback(()=>{
        console.log('taskState', JSON.stringify(taskState, null, 2));
    },[taskState])

    return (
        <div>
            <h1>Главная страница</h1>
            <button onClick={handleClick}>TasksGet</button>
            <button onClick={handleClick2}>TasksCheck</button>
        </div>

    )
};

export default withAuth(HomePage);
