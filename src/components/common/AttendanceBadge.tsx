import React from 'react';
import { AttendanceStatus } from '@/types/attendance';

interface AttendanceBadgeProps {
    status: AttendanceStatus | string;
    label?: string;
    className?: string;
}

export const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({ status, label, className }) => {
    let statusText = label;
    let backgroundColor = '#f0f0f0';
    let color = '#333';

    if (!statusText) {
        switch (status) {
            case 'PRESENT': statusText = '출석'; break;
            case 'LATE': statusText = '지각'; break;
            case 'ABSENT': statusText = '결석'; break;
            default: statusText = status;
        }
    }
    
    return (
        <div className={className}>
            {statusText}
        </div>
    );
};