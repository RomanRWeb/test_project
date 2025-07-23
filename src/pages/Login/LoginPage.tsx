import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from "react";
import {RootState, AppDispatch} from '../../store.ts';
import "./LoginPage.css"
import {unwrapResult} from "@reduxjs/toolkit";
import {createNewUser, fetchUserByID} from "../../redux/thunks/auth.ts";
import {setUserData} from "../../redux/slices/authSlice.ts";
import {UserData} from "../../types/index.ts";

const LoginPage:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [loginError, setLoginError] = useState('');
    const [register, setRegister] = useState(false);

    useEffect(() => {
        setLoginError('')
        console.log('password', JSON.stringify(password, null, 2));
    }, [password])

    const handleLogin = () => {
        // setLoading(true)
        const userData: UserData = {id: username, password: password};
        dispatch(fetchUserByID(userData)).then(unwrapResult).then((result) => {
            console.log('--someVal', JSON.stringify(result, null, 2));
            if (result === null) setLoginError("password dont match")
            // setLoading(false);
        }).catch((err) => {
            console.log('--err', JSON.stringify(err, null, 2));
            alert(authState.error.error)
        });
        setPassword('');
        // dispatch(logout());
    }

    const handleRegister = () => {
        const userData: UserData = {id: username, password: password};
        if (password == passwordRepeat) {
            dispatch(createNewUser(userData)).then(unwrapResult).then((result) => {
                console.log('--someVal', JSON.stringify(result, null, 2));
            }).catch((err) => {
                console.log('--err', JSON.stringify(err, null, 2));
                alert(err)
            });
        } else {
            setLoginError('passwords dont match')
        }
    }

    // const onClick = () => {
    //   dispatch(fetchUserById(userId))
    //     .then(unwrapResult)
    //     .then((originalPromiseResult) => {
    //       // handle result here
    //     })
    //     .catch((rejectedValueOrSerializedError) => {
    //       // handle result here
    //     })
    // }

    const handleLogout = () => {
        dispatch(setUserData(null));
    }

    const handleCheck = useCallback(() => {
        console.log(authState);
    }, [])

    const handleSwitchClick = useCallback(() => {
        setRegister(!register);
    }, [register])

    const handleClick = () => {
        if (!register) {
            handleLogin()
        } else {
            handleRegister()
        }
    }

    return (
        <div className={"LoginPage"}>
            {authState.user ? (
                <div>
                    <p>Привет, {authState.user.id}!</p>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            ) : (
                <form className={"LoginPage-form"}>
                    <span className={"error-message"}>{loginError}</span>
                    {authState.isLoading && <p className={"loader"}>Загрузка...</p>}
                    <input
                        id = "username"
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        id = "password"
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {register ? <input
                        id = "passwordRepeat"
                        type="password"
                        placeholder="Повторите пароль"
                        value={passwordRepeat}
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                    /> : null}
                    <button type="button" className={"SubmitButton"} onClick={() => handleClick()}
                            disabled={authState.isLoading || username.trim() === ''}>
                        {register ? "Зарегистироваться" : "Войти"}
                    </button>
                    <div>
                        <span>{!register ? "Нет аккаунта?" : "Уже есть аккаунт?"}</span>
                        <button type="button" className={"RegisterButton"}
                                onClick={handleSwitchClick}>
                            {!register ? "Зарегистироваться" : "Войти"}
                        </button>
                    </div>
                </form>
            )}
            {/*<button onClick={handleCheck}>User check</button>*/}
        </div>
    )

}

//export default withErrorBoundary(withAuth(LoginPage));
export default LoginPage;
