import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from "react";
import {RootState, AppDispatch} from '../../store';
import "./LoginPage.css"
import {unwrapResult} from "@reduxjs/toolkit";
import {createNewUser, fetchUserByID} from "../../redux/thunks/auth";
import {setUserData} from "../../redux/slices/authSlice";
import {AuthState, UserData} from "../../types";
import CustomButton from "../../components/CustomButton/CustomButton";
import {CustomInputField, CustomPasswordField} from "../../components/CustomInputField/CustomInputField";
import {Card, Spin, message, Typography} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const authState: AuthState = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [loginError, setLoginError] = useState('');
    const [register, setRegister] = useState(false);
    const [loading, setLoading] = useState(false);

    const {Text, Title} = Typography;
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

    useEffect(() => {
        let loginErr = "";
        if (register) {
            if (password != passwordRepeat) {
                loginErr = "Пароли не совпадают";
            }
            if (password.length < 3) {
                loginErr = "Пароль слишком короткий";
            }
        }
        setLoginError(loginErr);
        console.log('password', JSON.stringify(password, null, 2));
        console.log('passwordRepeat', JSON.stringify(passwordRepeat, null, 2));
    }, [password, passwordRepeat, register])

    useEffect(() => {
        setLoading(authState.isLoading)
        console.log('authState.isLoading', JSON.stringify(authState.isLoading, null, 2));
    }, [authState.isLoading]);

    const handleLogin = () => {
        // setLoading(true)
        const userData: UserData = {id: "", email: username, password: password, projectsList: []};
        console.log('userData', JSON.stringify(userData, null, 2));
        dispatch(fetchUserByID(userData)).then(unwrapResult).then((result) => {
            console.log('--someVal', JSON.stringify(result, null, 2));
            if (result === null) {
                messageApi.error('Пользователя с таким логином и паролем не сущестует, проверьте корректность введенных данных');
            } else {
                navigate('/home');
            }
            // setLoading(false);
        }).catch((err) => {
            console.log('--err', JSON.stringify(err, null, 3));
            messageApi.error(`Пользователя с таким логином и паролем не сущестует, проверьте корректность введенных данных (${err.error})`);
        });
        setPassword('');
        // dispatch(logout());
    }

    const handleRegister = () => {
        const userData: UserData = {id: "", email: username, password: password, projectsList: []};
        if (password == passwordRepeat) {
            dispatch(createNewUser(userData)).then(unwrapResult).then((result) => {
                console.log('--someVal', JSON.stringify(result, null, 2));
                navigate('/home');
            }).catch((err) => {
                console.log('--err', JSON.stringify(err, null, 2));
                messageApi.error(`Что-то пошло не так`);
            });
        } else {
            setLoginError('passwords dont match')
        }
    }

    const handleLogout = useCallback(() => {
        dispatch(setUserData(null));
    }, [dispatch])

    const handleSwitchClick = useCallback(() => {
        setRegister(!register);
    }, [register])

    const handleClick = useCallback(() => {
        if (loginError.length == 0) {
            if (!register) {
                handleLogin()
            } else {
                handleRegister()
            }
        }
    }, [loginError, register, handleLogin, handleRegister])

    return (
        <div className={"LoginPage"}>
            {contextHolder}
            {authState.user ? (
                <Card className={"HelloCard"} style={{textAlign: 'center'}}>
                    <Title level={3}>Привет, {authState.user.email}!</Title>
                    <br></br>
                    <CustomButton onClick={handleLogout}>
                        Выйти
                    </CustomButton>
                </Card>
            ) : (
                <Card className={"LoginCard"}>
                    <form className={"LoginPage-form"}>
                        <Title level={2} className={"big-text"}>{!register ? "Вход" : "Регистрация"}</Title>
                        {loginError !== '' ? <Text type="danger">{loginError}</Text> : null}
                        {authState.isLoading && <Spin indicator={<LoadingOutlined spin/>}/>}
                        <CustomInputField
                            placeholder={"login"}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                        {/*<input*/}
                        {/*    id="username"*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Имя пользователя"*/}
                        {/*    value={username}*/}
                        {/*    onChange={(e) => setUsername(e.target.value)}*/}
                        {/*/>*/}
                        <CustomPasswordField
                            value={password}
                            placeholder={"password"}
                            count={true}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        {/*<input*/}
                        {/*    id="password"*/}
                        {/*    type="password"*/}
                        {/*    placeholder="Пароль"*/}
                        {/*    value={password}*/}
                        {/*    required*/}
                        {/*    minLength={3}*/}
                        {/*    onChange={(e) => setPassword(e.target.value)}*/}
                        {/*/>*/}
                        {register ?
                            <CustomPasswordField
                                value={passwordRepeat}
                                placeholder={"Repeat password "}
                                count={true}
                                onChange={(e) => setPasswordRepeat(e.target.value)}
                                disabled={loading}
                            />
                            // <input
                            //     id="passwordRepeat"
                            //     type="password"
                            //     placeholder="Повторите пароль"
                            //     value={passwordRepeat}
                            //     required
                            //     minLength={3}
                            //     onChange={(e) => setPasswordRepeat(e.target.value)}
                            // />
                            : null}
                        <CustomButton onClick={handleClick}
                                      disabled={authState.isLoading || username === '' || loginError !== ''}>
                            {register ? "Зарегистироваться" : "Войти"}
                        </CustomButton>
                        <div>
                            <Text>{!register ? "Нет аккаунта?" : "Уже есть аккаунт?"}</Text>
                            <CustomButton type={"link"} onClick={handleSwitchClick}
                                          style={{border: "none", height: "1rem", padding: "1ch"}}>
                                {!register ? "Зарегистироваться" : "Войти"}
                            </CustomButton>
                            {/*<button type="button" className={"RegisterButton"}*/}
                            {/*        onClick={handleSwitchClick}>*/}
                            {/*    {!register ? "Зарегистироваться" : "Войти"}*/}
                            {/*</button>*/}
                        </div>
                    </form>
                </Card>
            )}
        </div>
    )

}

//export default withErrorBoundary(withAuth(LoginPage));
export default LoginPage;
