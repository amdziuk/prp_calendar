import React, { useEffect, useState } from "react";
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
  const RESOURCE_NAME = 'prp_calendar';

  const fetchEvents = () => {
    console.log('Fetching events...');
    fetch(`https://${RESOURCE_NAME}/getEvents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      console.log('NUI Message Received:', data);

      if (data.action === 'fetchEvents') {
        fetchEvents();
      } else if (data.action === 'receiveEvents') {
        console.log('NUI Action: receiveEvents', data.events);
        const formattedEvents = data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start_time,
          end: event.end_time,
          extendedProps: {
            description: event.description,
            location: event.location,
            owners: event.owners,
            guests: event.guests,
          },
        }));
        setEvents(formattedEvents);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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

  const handleEventDelete = (eventId: string) => {
    console.log('Clicked: handleEventDelete');
    fetch(`https://${RESOURCE_NAME}/deleteEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId }),
    }).catch((error) => {
      console.error('Error deleting event:', error);
    });
    setModalOpen(false);
  };
  
  const handleEventSubmit = (eventData: any) => {
    console.log('Submitting event:', eventData);
    fetch(`https://prp_calendar/createEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch((error) => {
      console.error('Error submitting event:', error);
    });
    setModalOpen(false);
  };

  const handleEventEdit = (eventData: any) => {
    console.log('Editing event:', eventData);
    fetch(`https://prp_calendar/editEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch((error) => {
      console.error('Error editing event:', error);
    });
    setModalOpen(false);
  };

  const handleInviteGuest = (eventData: any) => {
    console.log('Clicked: handleInviteGuest');
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log('Event clicked:', clickInfo.event);
    setSelectedEvent(clickInfo.event);
    setModalOpen(true);
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
            events={events}
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
                  onEdit={handleEventEdit}
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
