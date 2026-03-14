'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    value?: string; // ISO: YYYY-MM-DD
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    className?: string;
}

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

export function DatePicker({ value, onChange, placeholder = 'Selecione uma data', className }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const yearListRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = value
        ? (() => { const d = new Date(value + 'T12:00:00'); return isNaN(d.getTime()) ? null : d; })()
        : null;

    const [viewYear, setViewYear] = useState(() => selectedDate?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(() => selectedDate?.getMonth() ?? today.getMonth());

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (selectedDate) {
            setViewYear(selectedDate.getFullYear());
            setViewMonth(selectedDate.getMonth());
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const POPUP_HEIGHT = 340;
        const POPUP_WIDTH = 288;

        const spaceBelow = window.innerHeight - rect.bottom - 8;
        const spaceAbove = rect.top - 8;
        const top = spaceBelow >= POPUP_HEIGHT || spaceBelow >= spaceAbove
            ? rect.bottom + 8
            : rect.top - POPUP_HEIGHT - 8;

        let left = rect.left;
        if (left + POPUP_WIDTH > window.innerWidth - 8) {
            left = window.innerWidth - POPUP_WIDTH - 8;
        }

        setPopupStyle({ position: 'fixed', top, left, width: POPUP_WIDTH, zIndex: 9999 });
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            updatePosition();
            setShowYearPicker(false);
        }
        setIsOpen(o => !o);
    };

    useEffect(() => {
        if (!isOpen) return;
        const onClickOutside = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!triggerRef.current?.contains(t) && !popupRef.current?.contains(t)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, updatePosition]);

    useEffect(() => {
        if (showYearPicker && yearListRef.current) {
            const selected = yearListRef.current.querySelector('[data-selected="true"]');
            selected?.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
    }, [showYearPicker]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const handleDayClick = (day: number) => {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
    const currentYear = today.getFullYear();
    const yearRange = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

    const formattedValue = selectedDate
        ? `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`
        : null;

    return (
        <div className={cn('relative', className)}>
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                className={cn(
                    'w-full bg-background border rounded-xl p-3.5 text-sm font-medium',
                    'focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary',
                    'transition-all shadow-sm flex items-center gap-2',
                    isOpen && 'ring-2 ring-primary/10 border-primary',
                    formattedValue ? 'text-foreground' : 'text-muted-foreground/30',
                )}
            >
                <Calendar
                    size={16}
                    className={cn('shrink-0 transition-colors', isOpen ? 'text-primary' : 'text-muted-foreground/50')}
                />
                <span className="flex-1 text-left">{formattedValue ?? placeholder}</span>
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div ref={popupRef} style={popupStyle}>
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="bg-card border rounded-2xl shadow-2xl overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                                    <button
                                        type="button"
                                        onClick={prevMonth}
                                        className="p-1.5 rounded-lg hover:bg-background transition-colors active:scale-95"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowYearPicker(y => !y)}
                                        className={cn(
                                            'text-sm font-bold transition-colors px-3 py-1.5 rounded-lg',
                                            showYearPicker
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-background hover:text-primary'
                                        )}
                                    >
                                        {MONTHS[viewMonth]} {viewYear}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextMonth}
                                        className="p-1.5 rounded-lg hover:bg-background transition-colors active:scale-95"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {showYearPicker ? (
                                        <motion.div
                                            key="years"
                                            ref={yearListRef}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="h-52 overflow-y-auto p-2 grid grid-cols-3 gap-1"
                                        >
                                            {yearRange.map(year => (
                                                <button
                                                    key={year}
                                                    type="button"
                                                    data-selected={year === viewYear}
                                                    onClick={() => { setViewYear(year); setShowYearPicker(false); }}
                                                    className={cn(
                                                        'py-2 text-sm rounded-lg font-medium transition-colors',
                                                        year === viewYear
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'hover:bg-muted',
                                                    )}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="days"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="p-3"
                                        >
                                            <div className="grid grid-cols-7 mb-1">
                                                {WEEKDAYS.map(d => (
                                                    <div key={d} className="text-center text-[10px] font-bold text-muted-foreground uppercase py-1">
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-0.5">
                                                {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
                                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                                    const thisDate = new Date(viewYear, viewMonth, day);
                                                    const isFuture = thisDate > today;
                                                    const isSelected = selectedDate
                                                        && selectedDate.getDate() === day
                                                        && selectedDate.getMonth() === viewMonth
                                                        && selectedDate.getFullYear() === viewYear;
                                                    const isToday = today.getDate() === day
                                                        && today.getMonth() === viewMonth
                                                        && today.getFullYear() === viewYear;

                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            disabled={isFuture}
                                                            onClick={() => handleDayClick(day)}
                                                            className={cn(
                                                                'aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                                                                isSelected && 'bg-primary text-primary-foreground shadow-sm',
                                                                !isSelected && isToday && 'border border-primary text-primary font-bold',
                                                                !isSelected && !isToday && !isFuture && 'hover:bg-muted',
                                                                isFuture && 'opacity-25 cursor-not-allowed',
                                                            )}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {value && (
                                    <div className="px-3 pb-3 border-t">
                                        <button
                                            type="button"
                                            onClick={() => { onChange(undefined); setIsOpen(false); }}
                                            className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-2 rounded-lg hover:bg-muted font-medium flex items-center justify-center gap-1.5"
                                        >
                                            <X size={11} />
                                            Limpar data
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
