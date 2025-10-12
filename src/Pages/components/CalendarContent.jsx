import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

const CalendarContent = ({ theme, isDarkMode }) => {
  const [events] = useState([
    {
      id: 1,
      title: 'Product Launch Meeting',
      start: new Date(2024, 11, 15, 10, 0),
      end: new Date(2024, 11, 15, 11, 0),
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Marketing Campaign Review',
      start: new Date(2024, 11, 18, 14, 0),
      end: new Date(2024, 11, 18, 15, 30),
      type: 'review'
    },
    {
      id: 3,
      title: 'Inventory Check',
      start: new Date(2024, 11, 20, 9, 0),
      end: new Date(2024, 11, 20, 17, 0),
      type: 'task'
    },
  ]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3B82F6';
    if (event.type === 'meeting') backgroundColor = '#EF4444';
    if (event.type === 'review') backgroundColor = '#10B981';
    if (event.type === 'task') backgroundColor = '#F59E0B';

    return {
      style: {
        backgroundColor,
        borderRadius: '12px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        padding: '6px 10px',
      }
    };
  };

  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Calendar & Scheduling</h2>

      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow}`}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 800 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          className={`rbc-calendar-modern ${isDarkMode ? 'rbc-dark' : ''}`}
        />
      </div>
    </div>
  );
};

export default CalendarContent;
