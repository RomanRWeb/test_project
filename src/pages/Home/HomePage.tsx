import * as React from 'react';
import withAuth from "../../hocs/withAuth.tsx";
import {AppDispatch} from "../../store.ts";
import {useDispatch} from "react-redux";
import {fetchUserTasks} from "../../redux/thunks/tasks.ts";
import {useCallback} from "react";

const HomePage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    const handleClick = useCallback(()=>{
       dispatch(fetchUserTasks());
    },[])

    return (
        <body>
            <h1>Главная страница</h1>
            <button onClick={handleClick}>TasksCheck</button>
        </body>

    )
};

export default withAuth(HomePage);
