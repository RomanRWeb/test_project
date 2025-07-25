import * as React from 'react';
import {useCallback, useState} from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import AboutPage from './pages/About/AboutPage';
import {Provider} from 'react-redux';
import store from './store';
import LoginPage from "./pages/Login/LoginPage";
import "./normalize.css"
import "./App.css"
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher";
import {ConfigProvider} from "antd";
import { theme as antdTheme } from 'antd';

export const ThemeContext = React.createContext({
    darkTheme: false,
    toggleTheme: () => {
    },
});

const darkThemeConfig = {
    token: {
        colorPrimary: '#001122',
        colorBgContainer: '#004f97',
        colorBorder: '#ffffff',
        colorTextBase: '#ffffff',
        colorTextPlaceholder: '#c8c8c8',
        colorBgContainerDisabled: '#001a33',
        colorTextQuaternary: '#ffffff',
        myBgColor: '#000000',
    },
};

const lightThemeConfig = {
    token: {
        colorPrimary: '#0478e4',
        colorBgContainer: '#fdfdfd',
        colorBorder: '#d9d9d9',
        colorTextBase: '#000000',
        myBgColor: '#ffffff',
    },
};

function App() {

    const [darkTheme, setDarkTheme] = useState(false);

    const toggleTheme = useCallback(() => {
        setDarkTheme(!darkTheme);
    }, [darkTheme]);

    const themeValue = {darkTheme, toggleTheme};
    //const {darkTheme, toggleTheme} = useContext(ThemeContext);
    const { useToken } = antdTheme;
    const { token: theme } = useToken();

    const navStyle = {
        borderBottom: `3px solid ${theme.colorPrimary}`,
        borderInline: `3px solid ${theme.colorPrimary}`,
    };

    return (
        <Provider store={store}>
            <Router>
                <ThemeContext.Provider value={themeValue}>
                    <ConfigProvider theme={darkTheme ? darkThemeConfig : lightThemeConfig}>
                        <main className={"App"} style={{ backgroundColor: theme.myBgColor}}>
                            <header className="App-header" style={navStyle}>
                                <nav className={"App-nav"} >
                                    <div>
                                        <Link to="/about">О сайте</Link>
                                        <Link to="/home">Главная</Link>
                                    </div>
                                    <div>
                                        <ThemeSwitcher onClick={toggleTheme}/>
                                        <Link to="/login">Войти</Link>
                                    </div>
                                </nav>
                            </header>
                            <Routes>
                                <Route path="/home" element={<HomePage/>}/>
                                <Route path="/about" element={<AboutPage/>}/>
                                <Route path="/login" element={<LoginPage/>}/>
                            </Routes>
                        </main>
                    </ConfigProvider>
                </ThemeContext.Provider>
            </Router>
        </Provider>
    );
}

export default App;
