import * as React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'; // для редиректа
import { RootState } from '../store'; // путь к вашему типу корневого состояния

function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
    const ComponentWithAuth: React.FC<P> = (props) => {
        const authState = useSelector((state: RootState) => state.auth);

        if (!authState.user) {
            return <Navigate to="/login" replace />;
        }

        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
}

export default withAuth;
