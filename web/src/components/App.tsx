import React, { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import EventModal from './EventModal';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import "./App.css";
import { debugData } from "../utils/debugData";

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateEventClick = () => {
    // Use the selected date or current date if none is selected
    const date = selectedDate || new Date().toISOString().split('T')[0];
    console.log('Selected: ', date.start);
    setSelectedEvent({
      start: date.start,
      end: date.end,
    });
    setModalOpen(true);
  };

  const handleDateSelect = (arg: DateSelectArg) => {
    console.log('Date selected:', arg.startStr);
    setSelectedDate({start: arg.start, end: arg.end});
  };

  const handleEventDelete = (eventData: any) => {
    console.log('Clicked: handleEventDelete');
  };
  
  const handleEventSubmit = (eventData: any) => {
    console.log('Clicked: handleEventSubmit');
  };

  const handleInviteGuest = (eventData: any) => {
    console.log('Clicked: handleInviteGuest');
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log('Event clicked:', clickInfo.event);
    setSelectedEvent(clickInfo.event);
  };

  const handleCloseModal = () => {
      setModalOpen(false);
      setSelectedEvent(null);
  };

  return (
    <div className="nui-wrapper">
      <div className="content">
        <div>
          <FullCalendar
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            select={handleDateSelect}
            eventClick={handleEventClick}
            selectable={true}
          />
          <button className="create-event-button" onClick={handleCreateEventClick}>
            Create Event
          </button>
          {modalOpen && (
              <EventModal
                  event={selectedEvent}
                  onClose={handleCloseModal}
                  onSubmit={handleEventSubmit}
                  onDelete={handleEventDelete}
                  onInvite={handleInviteGuest}
              />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
