import * as React from 'react';
import {Button} from "antd";
import {SizeType} from "antd/es/config-provider/SizeContext";

interface CustomButtonProps {
    type?: "default" | "link" | "text" | "primary" | "dashed";
    size?: SizeType;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       type = 'default',   // тип кнопки: primary, default, dashed, link, text
                                                       size = 'large',    // размер: small, middle, large
                                                       onClick,            // обработчик клика
                                                       disabled = false,   // отключение кнопки
                                                       loading = false,    // индикатор загрузки
                                                       children,           // текст или элементы внутри кнопки
                                                       style = {},       // дополнительные стили
                                                       icon,               // иконка (например, из ant-design/icons)
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
