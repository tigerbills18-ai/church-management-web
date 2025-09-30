// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { apiService, DashboardStats, Member, Event } from '../services/api';
// Add at the top with other imports
import Link from 'next/link';

{/* Add this under the header */}
<div style={{ marginBottom: '20px' }}>
  <Link 
    href="/members"
    style={{
      color: '#2c3e50',
      textDecoration: 'none',
      fontWeight: 'bold',
      backgroundColor: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      display: 'inline-block'
    }}
  >
    Manage Members →
  </Link>
</div>

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    upcomingEvents: 0,
    recentAttendance: 0,
    totalDonations: 0
  });
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, membersData, eventsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getMembers(),
        apiService.getEvents()
      ]);
      
      setStats(statsData);
      setRecentMembers(membersData.slice(0, 3)); // Show 3 most recent
      setUpcomingEvents(eventsData.slice(0, 3)); // Show 3 upcoming
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px', 
        marginBottom: '20px',
        borderRadius: '8px'
      }}>
        <h1>Church Management Dashboard</h1>
        <p>Live data from your church database</p>
      </div>

      {/* Navigation Links */}
<div style={{ 
  display: 'flex', 
  gap: '10px', 
  marginBottom: '20px',
  flexWrap: 'wrap'
}}>
  <Link 
    href="/members"
    style={{
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 'bold'
    }}
  >
    👥 Manage Members
  </Link>
  <Link 
    href="/events"
    style={{
      backgroundColor: '#2ecc71',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 'bold'
    }}
  >
    📅 Manage Events
  </Link>
  <Link 
    href="/finance"
    style={{
      backgroundColor: '#e74c3c',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 'bold'
    }}
  >
    💰 Manage Finance
  </Link>
</div>

      {/* Statistics Cards with REAL DATA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#3498db', margin: '0 0 10px 0' }}>Total Members</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.totalMembers}</p>
          <small style={{ color: '#666' }}>Actual database count</small>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2ecc71', margin: '0 0 10px 0' }}>Upcoming Events</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.upcomingEvents}</p>
          <small style={{ color: '#666' }}>Events in database</small>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>Monthly Donations</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>${stats.totalDonations}</p>
<small style={{ color: '#666' }}>This month&apos;s total</small>        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#f39c12', margin: '0 0 10px 0' }}>Recent Attendance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.recentAttendance}</p>
          <small style={{ color: '#666' }}>Last 7 days</small>
        </div>
      </div>

      {/* Recent Members & Events with REAL DATA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Recent Members</h3>
          {recentMembers.length > 0 ? (
            <ul style={{ paddingLeft: '20px' }}>
              {recentMembers.map((member) => (
                <li key={member.id}>
                  <strong>{member.first_name} {member.last_name}</strong>
                  <br />
                  <small style={{ color: '#666' }}>
                    {member.email} • {member.phone}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>No members found</p>
          )}
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <ul style={{ paddingLeft: '20px' }}>
              {upcomingEvents.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong>
                  <br />
                  <small style={{ color: '#666' }}>
                    {new Date(event.date).toLocaleDateString()} • {event.time} • {event.rsvp_count} attending
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>No upcoming events</p>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={loadData}
          style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}