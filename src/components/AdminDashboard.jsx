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
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <LayoutDashboard size={28} />
          <h3>Admin Portal</h3>
        </div>
        
        <div className="admin-sidebar-nav">
          {[
            { icon: <BarChart3 size={20} />, label: 'Analytics' },
            { icon: <Users size={20} />, label: 'Voter Data' },
            { icon: <Calendar size={20} />, label: 'Schedules' },
            { icon: <Bell size={20} />, label: 'Notifications' },
            { icon: <MessageSquare size={20} />, label: 'Chat Logs' },
            { icon: <Settings size={20} />, label: 'Settings' }
          ].map((item, i) => (
            <div key={i} className={`admin-nav-item ${i === 0 ? 'active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-main-header">
          <h2>Dashboard Overview</h2>
          <div className="btn-group">
            <button className="btn admin-btn-secondary">Reports</button>
            <button className="btn btn-primary">Publish</button>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="card stat-card">
              <div className="stat-card-header">
                <div className="stat-icon-bg">{stat.icon}</div>
                <span className={`stat-change-indicator ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="stat-main-value">{stat.value}</div>
              <div className="stat-main-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="admin-cards-grid">
          <div className="card stat-card">
            <h3 className="admin-card-title">Recent AI Inquiries</h3>
            <div className="inquiry-list">
              {[
                { q: "How to apply for voter ID online?", t: "2 mins ago" },
                { q: "Where is my booth in Sector 45?", t: "15 mins ago" },
                { q: "Can I vote without EPIC card?", t: "1 hour ago" }
              ].map((item, i) => (
                <div key={i} className="inquiry-item">
                  <span>"{item.q}"</span>
                  <span>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card stat-card">
            <h3 className="admin-card-title">Election Alerts</h3>
            <div className="alert-list">
              <div className="alert-item accent">
                <div className="alert-item-title">Nomination Deadline</div>
                <p className="alert-item-desc">2 days remaining for candidates.</p>
              </div>
              <div className="alert-item success">
                <div className="alert-item-title">Voter List Updated</div>
                <p className="alert-item-desc">New electoral rolls published.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
