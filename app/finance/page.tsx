// app/finance/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, Donation, FinanceStats } from '../../services/api';

export default function FinancePage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<FinanceStats>({
    monthlyTotal: 0,
    yearlyTotal: 0,
    typeBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDonation, setNewDonation] = useState({
    member_id: '',
    amount: '',
    type: 'tithe',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Load finance data
  const loadFinanceData = async () => {
    try {
      const [donationsData, statsData] = await Promise.all([
        apiService.getDonations(),
        apiService.getFinanceStats()
      ]);
      setDonations(donationsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Record new donation
  const handleRecordDonation = async () => {
    try {
      await apiService.recordDonation({
        ...newDonation,
        amount: parseFloat(newDonation.amount)
      });
      setShowAddForm(false);
      setNewDonation({
        member_id: '',
        amount: '',
        type: 'tithe',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      loadFinanceData(); // Refresh data
      alert('Donation recorded successfully!');
    } catch (error) {
      console.error('Error recording donation:', error);
      alert('Error recording donation');
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tithe': return '#3498db';
      case 'offering': return '#2ecc71';
      case 'donation': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Finance Management</h1>
        <p>Loading financial data...</p>
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
        <h1>Finance Management</h1>
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
          Record Donation
        </button>
      </div>

      {/* Financial Overview */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Financial Overview</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#3498db', margin: '0 0 10px 0' }}>Monthly Total</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {formatCurrency(stats.monthlyTotal)}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#2ecc71', margin: '0 0 10px 0' }}>Yearly Total</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {formatCurrency(stats.yearlyTotal)}
            </p>
          </div>
        </div>

        {/* Type Breakdown */}
        <div>
          <h3>This Month by Type</h3>
          {stats.typeBreakdown.map((item, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '5px'
              }}>
                <span style={{ 
                  backgroundColor: getTypeColor(item.type),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {item.type}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {formatCurrency(item.total)}
                </span>
              </div>
              <div style={{ 
                height: '8px', 
                backgroundColor: '#ecf0f1', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    height: '100%', 
                    backgroundColor: getTypeColor(item.type),
                    width: `${(item.total / stats.monthlyTotal) * 100}%`
                  }} 
                />
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {item.count} transactions • {((item.total / stats.monthlyTotal) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Recent Donations</h2>
        
        {donations.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Donor</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {donation.first_name} {donation.last_name}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        backgroundColor: getTypeColor(donation.type),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {donation.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                      {formatCurrency(donation.amount)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {donation.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h3>No donations recorded yet</h3>
            <p>Record your first donation to get started!</p>
          </div>
        )}
      </div>

      {/* Record Donation Form Modal */}
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
            maxWidth: '500px'
          }}>
            <h2>Record New Donation</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Member ID"
                value={newDonation.member_id}
                onChange={(e) => setNewDonation({...newDonation, member_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <input
                type="number"
                placeholder="Amount"
                step="0.01"
                value={newDonation.amount}
                onChange={(e) => setNewDonation({...newDonation, amount: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <select
                value={newDonation.type}
                onChange={(e) => setNewDonation({...newDonation, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              >
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="donation">Donation</option>
              </select>
              <input
                type="date"
                value={newDonation.date}
                onChange={(e) => setNewDonation({...newDonation, date: e.target.value})}
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
                placeholder="Description"
                value={newDonation.description}
                onChange={(e) => setNewDonation({...newDonation, description: e.target.value})}
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
                onClick={handleRecordDonation}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Record Donation
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