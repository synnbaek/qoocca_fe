import React from 'react';

interface DateControllerProps {
    currentDateText: string;
    onPrev: () => void;
    onNext: () => void;
    className?: string;
    buttonClassName?: string;
    textClassName?: string;
}

export const DateController: React.FC<DateControllerProps> = ({
    currentDateText,
    onPrev,
    onNext,
    className,
    buttonClassName,
    textClassName
}) => {
    return (
        <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={onPrev} className={buttonClassName} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>&lt;</button>
            <span className={textClassName} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>{currentDateText}</span>
            <button onClick={onNext} className={buttonClassName} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>&gt;</button>
        </div>
    );
};
