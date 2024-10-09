import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import './EventModal.css';

interface EventModalProps {
    event: any;
    onClose: () => void;
    onSubmit: (eventData: any) => void;
    onEdit: (eventData: any) => void;
    onDelete: (eventId: string) => void;
    onInvite: (eventId: string, guestUserId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSubmit, onEdit, onDelete, onInvite }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const isEditMode = !!event.id;

    const formatDateTimeInput = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const [id, setID] = useState(event.id || '');
    const [title, setTitle] = useState(event.title || '');
    const [description, setDescription] = useState(event.extendedProps?.description || '');
    const [location, setLocation] = useState(event.extendedProps?.location || '');
    const [startTime, setStartTime] = useState(
        event.start ? formatDateTimeInput(new Date(event.start)) : formatDateTimeInput(new Date())
    );
    const [endTime, setEndTime] = useState(
        event.end ? formatDateTimeInput(new Date(event.end)) : formatDateTimeInput(new Date())
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

    const handleEdit = () => {
        const eventData = {
            id,
            title,
            description,
            location,
            start_time: startTime,
            end_time: endTime
        };
        onEdit(eventData);
    };

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete(event.id);
        setIsDeleteDialogOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleInvite = () => {
        // To Implement
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
                <input
                    type="text"
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
                    {!isEditMode && <button onClick={handleSubmit}>Create</button>}
                    {isEditMode && <button onClick={handleEdit}>Edit</button>}
                    {isEditMode && <button onClick={handleDelete}>Delete</button>}
                    {isEditMode && <button onClick={handleInvite}>Invite Guest</button>}
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
            {isDeleteDialogOpen && (
                <ConfirmationDialog
                message="Are you sure you want to delete this event?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default EventModal;
