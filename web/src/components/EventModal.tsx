import React, { useState } from 'react';
import './EventModal.css';

interface EventModalProps {
    event: any;
    onClose: () => void;
    onSubmit: (eventData: any) => void;
    onDelete: (eventId: string) => void;
    onInvite: (eventId: string, guestUserId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSubmit, onDelete, onInvite }) => {
    const isEditMode = !!event.id;

    const formatDateTimeInput = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const [title, setTitle] = useState(event.title || '');
    const [description, setDescription] = useState(event.extendedProps?.description || '');
    const [location, setLocation] = useState(event.extendedProps?.location || '');
    const [startTime, setStartTime] = useState(
        isEditMode || event.start ? formatDateTimeInput(new Date(event.start)) : formatDateTimeInput(new Date())
    );
    const [endTime, setEndTime] = useState(
        isEditMode || event.end ? formatDateTimeInput(new Date(event.end)) : formatDateTimeInput(new Date())
    );

    const handleSubmit = () => {
        const eventData = {
            title,
            description,
            location,
            start_time: startTime,
            end_time: endTime
        };
        onSubmit(eventData);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
        }
    };

    const handleInvite = () => {
        const guestUserId = prompt("Enter the guest's User ID:");
        if (guestUserId) {
            onInvite(event.id, guestUserId);
        }
    };

    return (
        <div className="event-modal">
            <div className="modal-content">
                <h2>{isEditMode ? 'Edit Event' : 'Create Event'}</h2>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <label>Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                />
                <label>Start Time</label>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                />
                <label>End Time</label>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Save</button>
                    {isEditMode && <button onClick={handleDelete}>Delete</button>}
                    {isEditMode && <button onClick={handleInvite}>Invite Guest</button>}
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
