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
    <Card className="bg-card text-card-foreground border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-serif font-bold text-primary">
          {format(currentMonth, "MMMM yyyy")}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-7 w-7">
            <FaChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-7 w-7">
            <FaChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
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
                className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all relative ${
                  !isCurrentMonth ? 'text-muted-foreground/30' : ''
                } ${
                  isCheckedIn 
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm ring-1 ring-primary/20' 
                    : isCurrentMonth ? 'bg-secondary/20 hover:bg-secondary/40' : 'bg-transparent'
                } ${
                  isToday && !isCheckedIn ? 'border border-primary text-primary font-bold' : ''
                }`}
              >
                {format(day, dateFormat)}
                
                {isCheckedIn && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-background" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
