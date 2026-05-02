import React from 'react';
import { LayoutDashboard, Users, MessageSquare, Bell, BarChart3, Settings, AlertCircle, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,284', change: '+12%', icon: <Users color="#3b82f6" /> },
    { label: 'AI Queries', value: '5,492', change: '+25%', icon: <MessageSquare color="#10b981" /> },
    { label: 'Booth Searches', value: '843', change: '+8%', icon: <BarChart3 color="#f59e0b" /> },
    { label: 'Complaints', value: '12', change: '-5%', icon: <AlertCircle color="#ef4444" /> }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: 'var(--primary)', color: 'white', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem', padding: '0 1rem' }}>
          <LayoutDashboard size={28} />
          <h3 style={{ color: 'white', margin: 0 }}>Admin Portal</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { icon: <BarChart3 size={20} />, label: 'Analytics' },
            { icon: <Users size={20} />, label: 'Voter Data' },
            { icon: <Calendar size={20} />, label: 'Schedules' },
            { icon: <Bell size={20} />, label: 'Notifications' },
            { icon: <MessageSquare size={20} />, label: 'Chat Logs' },
            { icon: <Settings size={20} />, label: 'Settings' }
          ].map((item, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', 
              padding: '0.8rem 1rem', borderRadius: '10px', 
              cursor: 'pointer', transition: 'background 0.2s',
              background: i === 0 ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}>
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'white' }}>Download Reports</button>
            <button className="btn btn-primary">Publish Alert</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {stats.map((stat, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem', margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '10px', background: '#f8fafc' }}>{stat.icon}</div>
                <span style={{ fontSize: '0.8rem', color: stat.change.startsWith('+') ? 'var(--success)' : 'var(--error)', fontWeight: 700 }}>{stat.change}</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.2rem' }}>{stat.value}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem', margin: 0 }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Recent AI Inquiries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: "How to apply for voter ID online?", t: "2 mins ago" },
                { q: "Where is my booth in Sector 45?", t: "15 mins ago" },
                { q: "Can I vote without EPIC card?", t: "1 hour ago" }
              ].map((item, i) => (
                <div key={i} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>"{item.q}"</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card" style={{ padding: '2rem', margin: 0 }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Election Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderLeft: '4px solid var(--accent)', paddingLeft: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Nomination Deadline</div>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>2 days remaining for candidates.</p>
              </div>
              <div style={{ borderLeft: '4px solid var(--success)', paddingLeft: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Voter List Updated</div>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>New electoral rolls published.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
