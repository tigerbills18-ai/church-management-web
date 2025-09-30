// app/members/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { apiService, Member } from '../../services/api';
// Add this import at the top
import Link from 'next/link';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    gender: '',
    baptism_date: '',
    confirmation_date: ''
  });

  // Load members from API
  const loadMembers = async () => {
    try {
      const membersData = await apiService.getMembers();
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter members
  useEffect(() => {
    const filtered = members.filter(member =>
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  // Add new member
  const handleAddMember = async () => {
    try {
      await apiService.createMember(newMember);
      setShowAddForm(false);
      setNewMember({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        birth_date: '',
        gender: '',
        baptism_date: '',
        confirmation_date: ''
      });
      loadMembers(); // Refresh the list
      alert('Member added successfully!');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member');
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Members Management</h1>
        <p>Loading members...</p>
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
        <h1>Members Management</h1>
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
          Add New Member
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search members by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Members Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Baptism Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>
                  <strong>{member.first_name} {member.last_name}</strong>
                </td>
                <td style={{ padding: '12px' }}>{member.email}</td>
                <td style={{ padding: '12px' }}>{member.phone}</td>
                <td style={{ padding: '12px' }}>
                  {member.baptism_date ? new Date(member.baptism_date).toLocaleDateString() : 'Not baptized'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    backgroundColor: member.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: member.status === 'active' ? '#155724' : '#721c24'
                  }}>
                    {member.status || 'active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            No members found
          </div>
        )}
      </div>

      {/* Add Member Form Modal */}
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
            <h2>Add New Member</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="First Name"
                value={newMember.first_name}
                onChange={(e) => setNewMember({...newMember, first_name: e.target.value})}
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
                placeholder="Last Name"
                value={newMember.last_name}
                onChange={(e) => setNewMember({...newMember, last_name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
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
                onClick={handleAddMember}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Add Member
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