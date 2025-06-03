'use client'
import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarModal({ isOpen, onClose, onDateSelect, completedDates }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  if (!isOpen) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handlePrevMonth}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-gray-800">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            
            <button 
              onClick={handleNextMonth}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {daysInMonth.map(day => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isCompleted = completedDates.some(d => isSameDay(d, day));
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => {
                    onDateSelect(day);
                    onClose();
                  }}
                  disabled={!isCurrentMonth}
                  className={`
                    p-2 rounded-lg text-center
                    ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                    ${isTodayDate ? 'bg-[#FFCB69] text-white' : ''}
                    hover:bg-gray-100 transition-colors
                  `}
                >
                  <div className="relative mx-auto w-8 h-8 flex items-center justify-center">
                    {format(day, 'd')}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}