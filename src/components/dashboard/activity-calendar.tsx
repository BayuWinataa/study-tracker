"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  format, isSameDay, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth
} from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface CheckIn {
  date: Date;
  id: string;
  userId: string;
  createdAt: Date;
}

interface ActivityCalendarProps {
  checkIns: CheckIn[];
}

export function ActivityCalendar({ checkIns }: ActivityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-6">
        <h3 className="text-xl font-bold font-sans tracking-tight text-foreground uppercase">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-none border-foreground hover:bg-foreground hover:text-background transition-colors">
            <FaChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-none border-foreground hover:bg-foreground hover:text-background transition-colors">
            <FaChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div>
        <div className="grid grid-cols-7 gap-1 text-center mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-xs font-bold uppercase tracking-widest text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 lg:gap-2">
          {days.map((day, idx) => {
            const isCheckedIn = checkIns.some((ci) => {
              // Convert DB UTC midnight date to the same day local
              const dbDateStr = new Date(ci.date).toISOString().split('T')[0];
              const calDateStr = format(day, 'yyyy-MM-dd');
              return dbDateStr === calDateStr;
            });
            
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div
                key={idx}
                className={`aspect-square flex items-center justify-center text-sm font-bold transition-all relative border-2 ${
                  !isCurrentMonth ? 'opacity-20 pointer-events-none' : ''
                } ${
                  isCheckedIn 
                    ? 'bg-foreground border-foreground text-background' 
                    : isCurrentMonth ? 'border-transparent bg-secondary/30 hover:border-foreground/30 text-foreground' : 'border-transparent text-transparent'
                } ${
                  isToday && !isCheckedIn ? 'border-foreground text-foreground' : ''
                }`}
              >
                {format(day, dateFormat)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
