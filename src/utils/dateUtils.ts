export const weekDaysShort = ['일', '월', '화', '수', '목', '금', '토'];


export const formatFullDate = (date: Date): string => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekDaysShort[date.getDay()]})`;
};

export const formatYearMonth = (date: Date): string => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

export interface CalendarDay {
    day: number;
    dateStr: string;
    isCurrentMonth: boolean;
}

export const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // 이전 달 날짜들
    const days: CalendarDay[] = [];
    
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        const dayNum = prevMonthLastDate - firstDay + i + 1;
        const prevMonthDate = new Date(year, month - 1, dayNum); 
        const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        
        days.push({ day: dayNum, dateStr, isCurrentMonth: false });
    }
    
    // 현재 달 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        days.push({ day: i, dateStr, isCurrentMonth: true });
    }
    
    // 다음 달 날짜들 (35 또는 42칸 채우기)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    
    for (let i = 1; i <= remaining; i++) {
        const nextMonthDate = new Date(year, month + 1, i);
        const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        days.push({ day: i, dateStr, isCurrentMonth: false });
    }

    return days;
};
