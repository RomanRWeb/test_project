import * as React from "react";
import "./ThemeSwitcher.css"
import {SunFilled, MoonFilled} from '@ant-design/icons';
import {useContext} from "react";
import {ThemeContext} from "../../App";

interface ThemeSwitcherProp {
    onClick: (e: React.MouseEvent) => void;
}

export default function ThemeSwitcher({onClick}: ThemeSwitcherProp) {
    const {darkTheme, toggleTheme} = useContext(ThemeContext);
    return (
        <div className={"theme-switcher"} onClick={onClick}>
            {darkTheme ? <SunFilled/> : <MoonFilled/>}
        </div>
    )
}
