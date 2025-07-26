import * as React from 'react';
import {Input} from "antd";
import runes from "runes2";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface InputFieldProps {
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    placeholder?: string;
    size?: "small" | "middle" | "large"
    variant?: "outlined" | "borderless" | "filled" | "underlined"
    children?: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties
    count?: boolean;
    countMax?: number;
    id?: string;
}

const CustomInputField: React.FC<InputFieldProps> = ({
                                                         value = "",
                                                         defaultValue = "",
                                                         placeholder = "",
                                                         disabled = false,
                                                         size = "middle",
                                                         variant = "outlined",
                                                         children,
                                                         onChange,
                                                         style = {},
                                                         count = false,
                                                         countMax = 999,
                                                     }: InputFieldProps) => {
    return (
        <Input
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            variant={variant}
            onChange={onChange}
            style={style}
            count={{
                show: count,
                max: countMax,
                exceedFormatter: (txt, {max}) => runes(txt).slice(0, max).join('')
            }}

        >
            {children}
        </Input>
    )
}

const CustomPasswordField: React.FC<InputFieldProps> = ({
                                                            value = "",
                                                            placeholder = "",
                                                            disabled = false,
                                                            size = "middle",
                                                            variant = "outlined",
                                                            children,
                                                            onChange,
                                                            style = {},
                                                            count = false,
                                                            countMax = 999,
                                                        }: InputFieldProps) => {
    return (
        <Input.Password
            value={value}
            placeholder={"Enter Password"}
            disabled={disabled}
            size={size}
            variant={variant}
            onChange={onChange}
            style={style}
            autoComplete = "current-password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            count={{
                show: true,
                max: 16,
                exceedFormatter: (txt, {max}) => runes(txt).slice(0, max).join('')
            }}

        >
            {children}
        </Input.Password>
    )
}

export {CustomInputField, CustomPasswordField};
