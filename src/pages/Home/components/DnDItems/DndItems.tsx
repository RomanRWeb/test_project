import React from 'react';
import {useDraggable, useDroppable} from '@dnd-kit/core';

interface DroppableProps {
    id: string;
    children: React.ReactNode;
}

interface DraggableProps {
    id: string;
    children: React.ReactNode;
    onDragStart: (id: string) => void;
}

export function DroppableContainer({id, children}: DroppableProps) {
    const {isOver, setNodeRef} = useDroppable({id});

    const style = {
        backgroundColor: !isOver ? 'transparent' : 'rgba(255,255,255,0.2)',
        minHeight: "200px",
        height: "100%",
        paddingInline: "16px",
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}

export function DraggableItem({id, children, onDragStart}: DraggableProps) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({id});

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} onMouseDown={() => onDragStart(id)} style={{cursor: 'grab'}}>
            {transform? null : children}
        </div>
    );
}
