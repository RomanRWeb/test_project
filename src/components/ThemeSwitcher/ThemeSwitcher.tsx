import * as React from "react";
import "./ThemeSwitcher.css"

interface ThemeSwitcherProp {
    onClick: (e: React.MouseEvent) => void;
}

export default function ThemeSwitcher({onClick}:ThemeSwitcherProp) {
    return (
        <div className={"theme-switcher"}>
            <input type="checkbox" id="themeSwitcher" name="theme-switcher"
                   className="theme-switch__input" onClick={onClick}></input>
        </div>
    )
}
