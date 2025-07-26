import * as React from 'react';
import {Card} from "antd";

interface CustomCardProps {
    cardTitle?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    children?: React.ReactNode;
    id?: string;
    actions?: React.ReactNode[];
    type?: boolean;
    variant?: "outlined" | "borderless";
    hoverable: boolean;
    extra?: React.ReactNode
}

const CustomCard: React.FC<CustomCardProps> = ({
                                                   cardTitle,
                                                   style,
                                                   loading,
                                                   children,
                                                   id,
                                                   actions,
                                                   type = false,
                                                   variant = "outlined",
                                                   hoverable = true,
                                                   extra,
                                               }: CustomCardProps) => {
    return (
        <Card
            title={cardTitle}
            style={style}
            loading={loading}
            id={id}
            actions={actions}
            type={type ? "inner" : undefined}
            variant={variant}
            hoverable={hoverable}
            extra={extra}
        >
            {children}
        </Card>
    )
}

const CustomGridCard: React.FC<CustomCardProps> = ({
                                                       cardTitle,
                                                       style,
                                                       children,
                                                       id,
                                                       hoverable = true,
                                                   }: CustomCardProps) => {
    return (
        <Card.Grid
            title={cardTitle}
            style={style}
            id={id}
            hoverable={hoverable}
        >
            {children}
        </Card.Grid>
    )
}

export {CustomCard, CustomGridCard};
