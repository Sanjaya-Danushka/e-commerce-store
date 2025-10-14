import React, { useState, useEffect } from 'react';
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
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }
    };
  };

  // Apply calendar styles on component mount and when dark mode changes
  useEffect(() => {
    const applyCalendarStyles = () => {
      const styleId = 'calendar-custom-styles';
      let styleElement = document.getElementById(styleId);

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const styles = `
        /* Calendar container */
        .rbc-calendar {
          background-color: transparent !important;
          color: ${isDarkMode ? '#f1f5f9' : '#1e293b'} !important;
        }

        /* Toolbar styles */
        .rbc-toolbar {
          background-color: ${isDarkMode ? 'rgba(51, 65, 85, 0.7)' : 'rgba(248, 250, 252, 0.7)'} !important;
          border-radius: 16px !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          border: 1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)'} !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: ${isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)'} !important;
        }

        /* Toolbar button styles */
        .rbc-toolbar button {
          background-color: ${isDarkMode ? 'rgba(71, 85, 105, 0.8)' : 'rgba(226, 232, 240, 0.8)'} !important;
          color: ${isDarkMode ? '#f1f5f9' : '#475569'} !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
          margin: 0 2px !important;
        }

        .rbc-toolbar button:hover {
          background-color: ${isDarkMode ? 'rgba(71, 85, 105, 1)' : 'rgba(203, 213, 225, 1)'} !important;
          transform: translateY(-1px) !important;
          box-shadow: ${isDarkMode
            ? '0 4px 12px rgba(0, 0, 0, 0.4)'
            : '0 4px 12px rgba(0, 0, 0, 0.15)'} !important;
        }

        /* Month header (days of week) */
        .rbc-month-view .rbc-header {
          background-color: ${isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)'} !important;
          color: ${isDarkMode ? '#cbd5e1' : '#475569'} !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          padding: 12px 8px !important;
          border-bottom: 1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)'} !important;
          backdrop-filter: blur(10px) !important;
        }

        /* Date cells */
        .rbc-date-cell {
          color: ${isDarkMode ? '#e2e8f0' : '#334155'} !important;
          font-weight: 500 !important;
        }

        .rbc-date-cell:hover {
          background-color: ${isDarkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'} !important;
        }

        .rbc-date-cell.rbc-off-range {
          color: ${isDarkMode ? '#64748b' : '#94a3b8'} !important;
        }

        .rbc-date-cell.rbc-now {
          background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'} !important;
          color: ${isDarkMode ? '#3b82f6' : '#1d4ed8'} !important;
          font-weight: 700 !important;
        }

        /* Today highlight */
        .rbc-today {
          background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)'} !important;
          position: relative !important;
        }

        .rbc-today::after {
          content: "" !important;
          position: absolute !important;
          bottom: 4px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 20px !important;
          height: 2px !important;
          background-color: ${isDarkMode ? '#3b82f6' : '#1d4ed8'} !important;
          border-radius: 1px !important;
        }

        /* Selected date */
        .rbc-selected {
          background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} !important;
          color: ${isDarkMode ? '#3b82f6' : '#1d4ed8'} !important;
          font-weight: 600 !important;
        }

        /* Event styles */
        .rbc-event {
          border-radius: 8px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          padding: 4px 8px !important;
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        /* Week/Day view styles */
        .rbc-time-view .rbc-header {
          background-color: ${isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)'} !important;
          color: ${isDarkMode ? '#cbd5e1' : '#475569'} !important;
          border-bottom: 1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)'} !important;
        }

        .rbc-time-content {
          background-color: ${isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.5)'} !important;
          border: 1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'} !important;
        }

        .rbc-current-time-indicator {
          background-color: ${isDarkMode ? '#ef4444' : '#dc2626'} !important;
        }

        /* Month view grid */
        .rbc-month-view {
          border-radius: 12px !important;
          overflow: hidden !important;
          background-color: ${isDarkMode ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.3)'} !important;
          border: 1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'} !important;
        }

        .rbc-month-row {
          background-color: transparent !important;
        }

        .rbc-day-bg {
          background-color: transparent !important;
        }
      `;

      styleElement.textContent = styles;
    };

    applyCalendarStyles();
  }, [isDarkMode]);

  return (
    <div className="space-y-10">
      <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Calendar & Scheduling</h2>

      <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow} relative overflow-hidden`}>
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isDarkMode
            ? 'from-blue-500/5 via-purple-500/5 to-emerald-500/5'
            : 'from-blue-50/50 via-purple-50/50 to-emerald-50/50'
        } rounded-3xl`}></div>

        {/* Calendar container */}
        <div className="relative z-10">
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
            components={{
              toolbar: ({ label, onNavigate, onView }) => (
                <div className="rbc-toolbar">
                  <span className="rbc-toolbar-label">{label}</span>
                  <div className="rbc-btn-group">
                    <button type="button" onClick={() => onNavigate('PREV')}>
                      ‹
                    </button>
                    <button type="button" onClick={() => onNavigate('TODAY')}>
                      Today
                    </button>
                    <button type="button" onClick={() => onNavigate('NEXT')}>
                      ›
                    </button>
                  </div>
                  <div className="rbc-btn-group">
                    {['month', 'week', 'day', 'agenda'].map(view => (
                      <button
                        key={view}
                        type="button"
                        className={`text-sm px-3 py-1 rounded-md transition-all ${
                          view === 'month'
                            ? isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-200 text-slate-700'
                            : isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        onClick={() => onView(view)}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarContent;
