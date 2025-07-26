import * as React from 'react';
import {Button} from "antd";

interface CustomButtonProps {
    type?: "default" | "link" | "text" | "primary" | "dashed";
    size?: "small" | "middle" | "large";
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    icon?: React.ReactNode;
    id?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       type = 'default',
                                                       size = 'large',
                                                       onClick,
                                                       disabled = false,
                                                       loading = false,
                                                       children,
                                                       style = {},
                                                       icon,
                                                   }: CustomButtonProps) => {

    return (
        <Button
            type={type}
            size={size}
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            style={style}
            icon={icon}
        >
            {children}
        </Button>
    );
};

export default CustomButton;
