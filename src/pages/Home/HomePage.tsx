import * as React from 'react';
import withAuth from "../../hocs/withAuth.tsx";

const HomePage: React.FC = () => {
    return <h1>Главная страница</h1>;
};

export default withAuth(HomePage);
