// app/events/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, Event } from '../../services/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '19:00',
    location: '',
    type: 'service',
    max_capacity: 50
  });

  // Load events from API
  const loadEvents = async () => {
    try {
      const eventsData = await apiService.getEvents();
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new event
  const handleAddEvent = async () => {
    try {
      await apiService.createEvent(newEvent);
      setShowAddForm(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '19:00',
        location: '',
        type: 'service',
        max_capacity: 50
      });
      loadEvents(); // Refresh the list
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  // Handle RSVP
  const handleRSVP = async (eventId: string) => {
    try {
      // For demo, using a fixed user ID - in real app, use actual user ID
      await apiService.rsvpToEvent(eventId, 'demo-user-id');
      alert('RSVP confirmed!');
      loadEvents(); // Refresh to update RSVP count
    } catch (error) {
      console.error('Error with RSVP:', error);
      alert('Error with RSVP');
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'service': return '#3498db';
      case 'study': return '#2ecc71';
      case 'prayer': return '#e74c3c';
      case 'youth': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Events Management</h1>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Events Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredEvents.map((event) => (
          <div 
            key={event.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${getEventColor(event.type)}`
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '10px'
            }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>{event.title}</h3>
              <span style={{
                backgroundColor: getEventColor(event.type),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}>
                {event.type}
              </span>
            </div>

            <p style={{ color: '#666', margin: '10px 0' }}>{event.description}</p>

            <div style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              <div>📅 {formatDate(event.date)}</div>
              <div>⏰ {event.time}</div>
              <div>📍 {event.location}</div>
              <div>👥 {event.rsvp_count}/{event.max_capacity} attending</div>
            </div>

            {/* RSVP Progress Bar */}
            <div style={{ 
              height: '6px', 
              backgroundColor: '#ecf0f1', 
              borderRadius: '3px',
              marginBottom: '10px',
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  height: '100%', 
                  backgroundColor: getEventColor(event.type),
                  width: `${(event.rsvp_count / event.max_capacity) * 100}%`
                }} 
              />
            </div>

            <button
              onClick={() => handleRSVP(event.id)}
              disabled={event.rsvp_count >= event.max_capacity}
              style={{
                backgroundColor: event.rsvp_count >= event.max_capacity ? '#bdc3c7' : getEventColor(event.type),
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: event.rsvp_count >= event.max_capacity ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {event.rsvp_count >= event.max_capacity ? 'Event Full' : 'RSVP Now'}
            </button>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <h3>No events scheduled</h3>
          <p>Create your first event to get started!</p>
        </div>
      )}

      {/* Add Event Form Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>Create New Event</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  resize: 'vertical'
                }}
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              >
                <option value="service">Sunday Service</option>
                <option value="study">Bible Study</option>
                <option value="prayer">Prayer Meeting</option>
                <option value="youth">Youth Event</option>
              </select>
              <input
                type="number"
                placeholder="Max Capacity"
                value={newEvent.max_capacity}
                onChange={(e) => setNewEvent({...newEvent, max_capacity: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Back to Dashboard */}
      <div style={{ marginTop: '20px' }}>
        <Link 
          href="/"
          style={{
            color: '#2c3e50',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}