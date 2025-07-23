import * as React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import HomePage from './pages/Home/HomePage.tsx';
import AboutPage from './pages/About/AboutPage.tsx';
import {Provider} from 'react-redux';
import store from './store.ts';
import LoginPage from "./pages/Login/LoginPage.tsx";
import "./normalize.css"
import "./App.css"
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher.tsx";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <main className={"App"}>
                    <header className="App-header">
                        <nav>
                            <div>
                                <Link to="/about">О сайте</Link>
                                <Link to="/home">Главная</Link>
                            </div>
                            <div>
                                <ThemeSwitcher></ThemeSwitcher>
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
            </Router>
        </Provider>
    );
}

export default App;
