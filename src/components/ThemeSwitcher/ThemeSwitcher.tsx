import * as React from "react";
import "./ThemeSwitcher.css"

export default function ThemeSwitcher() {
    return (
        <div className={"theme-switcher"}>
            <input type="checkbox" id="themeSwitcher" name="theme-switcher"
                   className="theme-switch__input"></input>
            <label htmlFor="themeSwitcher" className="themeSwitcher__label">

            </label>
        </div>
    )
}
