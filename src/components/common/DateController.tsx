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
            <button 
                onClick={onPrev} 
                className={buttonClassName} 
                aria-label="이전 날짜"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
            >
                &lt;
            </button>
            <span 
                className={textClassName} 
                aria-live="polite"
                style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}
            >
                {currentDateText}
            </span>
            <button 
                onClick={onNext} 
                className={buttonClassName} 
                aria-label="다음 날짜"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
            >
                &gt;
            </button>
        </div>
    );
};