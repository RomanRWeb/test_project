import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import AboutPage from './pages/About/AboutPage';
import {Provider} from 'react-redux';
import store from './store';
import LoginPage from "./pages/Login/LoginPage";
import "./normalize.css"
import "./App.css"
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher";
import {ConfigProvider, message, ThemeConfig} from "antd";
import getDesignToken from "antd/es/theme/getDesignToken";
import {darkThemeConfig, lightThemeConfig} from "./types";

export const ThemeContext = React.createContext({
    darkTheme: false,
    toggleTheme: () => {
    },
});

function App() {

    const [darkTheme, setDarkTheme] = useState(false);

    const toggleTheme = useCallback(() => {
        setDarkTheme(!darkTheme);
        localStorage.setItem('preferUserTheme', darkTheme ? 'light' : 'dark');
    }, [darkTheme]);

    const themeValue = {darkTheme, toggleTheme};
    //const {darkTheme, toggleTheme} = useContext(ThemeContext);

    const DarkToken = getDesignToken(darkThemeConfig);
    const LightToken = getDesignToken(lightThemeConfig);

    const themeStyle = {
        dark: {
            backgroundColor: DarkToken.colorBgContainer,
            borderBottom: `1px solid ${DarkToken.colorTextBase}`,
            borderInline: `1px solid ${DarkToken.colorTextBase}`,
        },
        light: {
            backgroundColor: LightToken.colorBgContainer,
            borderBottom: `1px solid ${LightToken.colorTextBase}`,
            borderInline: `1px solid ${LightToken.colorTextBase}`,
        },
    }

    const bgStyle = {
        dark: {
            backgroundColor: DarkToken.colorBgSolid,
            color: DarkToken.colorTextBase,
        },
        light: {
            backgroundColor: LightToken.colorBgSolid,
            color: LightToken.colorTextBase,
        },
    }

    useEffect(() => {
        let preferTheme = localStorage.getItem('preferUserTheme');
        if (preferTheme === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                preferTheme = 'dark';
            } else {
                preferTheme = 'light';
            }
        }
        setDarkTheme(preferTheme === 'dark');
        console.log('preferTheme', JSON.stringify(preferTheme, null, 2));
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <ThemeContext.Provider value={themeValue}>
                    <ConfigProvider theme={darkTheme ? darkThemeConfig : lightThemeConfig}>
                        <main className={"App"} style={darkTheme ? bgStyle.dark : bgStyle.light}>
                            <header className="App-header" style={darkTheme ? themeStyle.dark : themeStyle.light}>
                                <nav className={"App-nav"}>
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
