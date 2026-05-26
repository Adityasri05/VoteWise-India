import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, MessageSquare, Bell, BarChart3,
  Settings, AlertCircle, Calendar, Search, Filter, Download,
  CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown,
  MapPin, Shield, Eye, EyeOff, Save, RefreshCw, Trash2,
  ChevronRight, Phone, Mail, Globe, Lock, ToggleLeft, ToggleRight,
  UserCheck, FileText, AlertTriangle, Info, Star, Zap
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const VOTER_DATA = [
  { id: 'V001', name: 'Priya Sharma', epic: 'DL/01/234/123456', ward: 'Ward 12 – Connaught Place', status: 'Verified', phone: '98765-43210', registered: '12 Jan 2024' },
  { id: 'V002', name: 'Rahul Mehta', epic: 'DL/01/234/234567', ward: 'Ward 12 – Connaught Place', status: 'Pending', phone: '98765-43211', registered: '15 Jan 2024' },
  { id: 'V003', name: 'Anita Singh', epic: 'DL/02/234/345678', ward: 'Ward 08 – Karol Bagh', status: 'Verified', phone: '98765-43212', registered: '18 Jan 2024' },
  { id: 'V004', name: 'Vikram Kumar', epic: 'DL/02/234/456789', ward: 'Ward 08 – Karol Bagh', status: 'Rejected', phone: '98765-43213', registered: '20 Jan 2024' },
  { id: 'V005', name: 'Sunita Rao', epic: 'DL/03/234/567890', ward: 'Ward 15 – Lajpat Nagar', status: 'Verified', phone: '98765-43214', registered: '22 Jan 2024' },
  { id: 'V006', name: 'Amit Joshi', epic: 'DL/03/234/678901', ward: 'Ward 15 – Lajpat Nagar', status: 'Pending', phone: '98765-43215', registered: '25 Jan 2024' },
];

const CHAT_LOGS = [
  { id: 1, user: 'Anonymous User', query: 'How to apply for voter ID online?', response: 'You can register at voters.eci.gov.in using Form 6.', time: '2 mins ago', resolved: true },
  { id: 2, user: 'Priya S.', query: 'Where is my polling booth in Sector 45?', response: 'Your booth is at Central Public School, Sector 45.', time: '15 mins ago', resolved: true },
  { id: 3, user: 'Anonymous User', query: 'Can I vote without EPIC card?', response: 'Yes, any of the 12 approved photo IDs are accepted.', time: '1 hour ago', resolved: true },
  { id: 4, user: 'Rahul M.', query: 'What is the deadline for voter registration?', response: 'Applications are open throughout the year via VSP.', time: '2 hours ago', resolved: false },
  { id: 5, user: 'Anita K.', query: 'How to report a complaint about a polling officer?', response: 'You can call 1950 or use the C-Vigil app.', time: '3 hours ago', resolved: true },
];

const SCHEDULES = [
  { id: 1, title: 'Voter List Publication', date: '2026-06-01', type: 'deadline', desc: 'Final electoral rolls to be published by DEO office.' },
  { id: 2, title: 'Nomination Filing Opens', date: '2026-06-10', type: 'event', desc: 'Window opens for candidate nominations (Form 2B).' },
  { id: 3, title: 'Nomination Deadline', date: '2026-06-18', type: 'deadline', desc: 'Last date for filing nomination papers.' },
  { id: 4, title: 'Scrutiny of Nominations', date: '2026-06-19', type: 'info', desc: 'ECI officials review all nomination documents.' },
  { id: 5, title: 'Withdrawal of Candidature', date: '2026-06-21', type: 'info', desc: 'Last date for withdrawal by nominated candidates.' },
  { id: 6, title: 'Polling Day', date: '2026-07-05', type: 'election', desc: 'General election voting across all constituencies.' },
  { id: 7, title: 'Counting of Votes', date: '2026-07-07', type: 'event', desc: 'Votes counted and results declared at counting centres.' },
];

const NOTIFICATIONS = [
  { id: 1, title: 'New Voter Registration', desc: '48 new voter applications received today.', time: '5 mins ago', type: 'info', read: false },
  { id: 2, title: 'Booth B-047 Complaint Filed', desc: 'A citizen reported missing facilities at booth B-047.', time: '32 mins ago', type: 'warning', read: false },
  { id: 3, title: 'Electoral Roll Updated', desc: 'Ward 12 electoral roll updated with 312 new entries.', time: '1 hour ago', type: 'success', read: false },
  { id: 4, title: 'AI System Alert', desc: 'Chatbot handled 1,200+ queries without escalation today.', time: '3 hours ago', type: 'success', read: true },
  { id: 5, title: 'Nomination Deadline Reminder', desc: 'Nomination window closes in 2 days.', time: '6 hours ago', type: 'warning', read: true },
  { id: 6, title: 'System Maintenance Scheduled', desc: 'Planned downtime on Sunday 2–4 AM IST.', time: '1 day ago', type: 'info', read: true },
];

const STATS = [
  { label: 'Total Registered Voters', value: '1,28,456', change: '+12%', up: true, icon: <Users color="#3b82f6" size={22} /> },
  { label: 'AI Queries Today', value: '5,492', change: '+25%', up: true, icon: <MessageSquare color="#10b981" size={22} /> },
  { label: 'Booth Searches', value: '843', change: '+8%', up: true, icon: <MapPin color="#f59e0b" size={22} /> },
  { label: 'Active Complaints', value: '12', change: '-5%', up: false, icon: <AlertCircle color="#ef4444" size={22} /> },
];

const BAR_DATA = [
  { day: 'Mon', queries: 820, registrations: 45 },
  { day: 'Tue', queries: 932, registrations: 60 },
  { day: 'Wed', queries: 1100, registrations: 78 },
  { day: 'Thu', queries: 890, registrations: 52 },
  { day: 'Fri', queries: 1200, registrations: 91 },
  { day: 'Sat', queries: 780, registrations: 33 },
  { day: 'Sun', queries: 550, registrations: 18 },
];

// ─── Section Components ───────────────────────────────────────────────────────

function AnalyticsSection() {
  const maxVal = Math.max(...BAR_DATA.map(d => d.queries));
  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {STATS.map((stat, i) => (
          <motion.div key={i} className="card stat-card" whileHover={{ y: -4 }}>
            <div className="stat-card-header">
              <div className="stat-icon-bg">{stat.icon}</div>
              <span className={`stat-change-indicator ${stat.up ? 'positive' : 'negative'}`}>
                {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {stat.change}
              </span>
            </div>
            <div className="stat-main-value">{stat.value}</div>
            <div className="stat-main-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="admin-cards-grid">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 className="admin-card-title">Weekly AI Queries</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', height: '160px', marginTop: '1.5rem' }}>
            {BAR_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.queries}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.queries / maxVal) * 100}%` }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '6px 6px 0 0', minHeight: '4px' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 className="admin-card-title">Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {[
              { label: 'Verified Voters', val: 94, color: '#10b981' },
              { label: 'Booths Active', val: 87, color: '#3b82f6' },
              { label: 'Complaints Resolved', val: 76, color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>{item.label}</span><span style={{ color: item.color }}>{item.val}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    transition={{ delay: i * 0.15, duration: 0.7 }}
                    style={{ height: '100%', background: item.color, borderRadius: '99px' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Inquiries</div>
            {CHAT_LOGS.slice(0, 3).map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', fontSize: '0.85rem', gap: '1rem' }}>
                <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{log.query}"</span>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VoterDataSection() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = VOTER_DATA.filter(v =>
    (v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.epic.toLowerCase().includes(search.toLowerCase()) ||
      v.ward.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || v.status === statusFilter)
  );

  const statusColor = { Verified: '#10b981', Pending: '#f59e0b', Rejected: '#ef4444' };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.4rem', width: '100%' }}
            placeholder="Search by name, EPIC, or ward…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Verified', 'Pending', 'Rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
              style={{ fontSize: '0.82rem' }}>
              {s}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Download size={16} /> Export
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                {['Voter ID', 'Name', 'EPIC No.', 'Ward', 'Status', 'Registered'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((v, i) => (
                <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#3b82f6' }}>{v.id}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{v.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.82rem' }}>{v.epic}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{v.ward}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ background: statusColor[v.status] + '18', color: statusColor[v.status], padding: '0.25rem 0.75rem', borderRadius: '99px', fontWeight: 700, fontSize: '0.78rem' }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{v.registered}</td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No voters found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Showing {filtered.length} of {VOTER_DATA.length} voters</span>
          <span>Last synced: Today, 3:30 PM</span>
        </div>
      </div>
    </div>
  );
}

function SchedulesSection() {
  const typeConfig = {
    deadline: { color: '#ef4444', bg: '#fef2f2', icon: <AlertTriangle size={16} /> },
    event: { color: '#3b82f6', bg: '#eff6ff', icon: <Calendar size={16} /> },
    info: { color: '#6366f1', bg: '#eef2ff', icon: <Info size={16} /> },
    election: { color: '#10b981', bg: '#f0fdf4', icon: <Star size={16} /> },
  };
  const [addMode, setAddMode] = useState(false);
  const [events, setEvents] = useState(SCHEDULES);
  const [form, setForm] = useState({ title: '', date: '', type: 'event', desc: '' });

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    setEvents(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ title: '', date: '', type: 'event', desc: '' });
    setAddMode(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upcoming election milestones and key dates</p>
        <button className="btn btn-primary" onClick={() => setAddMode(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {addMode ? <XCircle size={16} /> : <Calendar size={16} />} {addMode ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      <AnimatePresence>
        {addMode && (
          <motion.div className="card" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#f8fafc' }}>
            <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>Add New Event</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <input className="form-input" placeholder="Event title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              <input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              <select className="form-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="event">Event</option>
                <option value="deadline">Deadline</option>
                <option value="info">Info</option>
                <option value="election">Election</option>
              </select>
            </div>
            <input className="form-input" style={{ marginTop: '1rem', width: '100%' }} placeholder="Description" value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleAdd}><Save size={16} /> Save Event</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map((ev, i) => {
          const cfg = typeConfig[ev.type] || typeConfig.info;
          const isPast = new Date(ev.date) < new Date();
          return (
            <motion.div key={ev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', opacity: isPast ? 0.6 : 1, flexWrap: 'wrap' }}>
              <div style={{ background: cfg.bg, color: cfg.color, width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {cfg.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{ev.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{ev.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: cfg.color, fontSize: '0.9rem' }}>{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isPast ? 'Completed' : `In ${Math.ceil((new Date(ev.date) - new Date()) / 86400000)} days`}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const typeConfig = {
    info: { color: '#3b82f6', bg: '#eff6ff', icon: <Info size={16} /> },
    warning: { color: '#f59e0b', bg: '#fffbeb', icon: <AlertTriangle size={16} /> },
    success: { color: '#10b981', bg: '#f0fdf4', icon: <CheckCircle2 size={16} /> },
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {unread > 0 && (
            <span style={{ background: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
              {unread} Unread
            </span>
          )}
        </div>
        <button className="btn admin-btn-secondary" onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} /> Mark All Read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {notifications.map((n, i) => {
            const cfg = typeConfig[n.type] || typeConfig.info;
            return (
              <motion.div key={n.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.04 }} className="card"
                style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: n.read ? 0.65 : 1, flexWrap: 'wrap', borderLeft: `4px solid ${n.read ? 'transparent' : cfg.color}` }}>
                <div style={{ background: cfg.bg, color: cfg.color, width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '0.9rem' }}>{n.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{n.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</span>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} title="Mark read"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex' }}>
                      <Eye size={16} />
                    </button>
                  )}
                  <button onClick={() => deleteNotif(n.id)} title="Delete"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {notifications.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={40} style={{ margin: '0 auto 1rem', color: '#10b981' }} />
            <div>All caught up! No notifications.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatLogsSection() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? CHAT_LOGS : CHAT_LOGS.filter(l => filter === 'Resolved' ? l.resolved : !l.resolved);

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Resolved', 'Pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            style={{ fontSize: '0.82rem' }}>
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} conversations
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((log, i) => (
          <motion.div key={log.id} layout className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: log.resolved ? '#f0fdf4' : '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={16} color={log.resolved ? '#10b981' : '#f59e0b'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.15rem' }}>{log.user}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{log.query}"</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span style={{ background: log.resolved ? '#f0fdf4' : '#fffbeb', color: log.resolved ? '#10b981' : '#f59e0b', padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {log.resolved ? 'Resolved' : 'Pending'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.time}</span>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', transform: expanded === log.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>
            <AnimatePresence>
              {expanded === log.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.25rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.85rem 1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>User Query</div>
                      <div style={{ fontSize: '0.9rem' }}>{log.query}</div>
                    </div>
                    <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '0.85rem 1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>AI Response</div>
                      <div style={{ fontSize: '0.9rem' }}>{log.response}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    aiChatbot: true,
    maintenanceMode: false,
    publicRegistration: true,
    twoFactor: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {on
        ? <ToggleRight size={32} color="#3b82f6" />
        : <ToggleLeft size={32} color="#94a3b8" />}
    </button>
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Notifications */}
        <div className="card" style={{ padding: '1.5rem 2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="#3b82f6" /> Notification Settings
          </h3>
          {[
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive system alerts and reports via email' },
            { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive critical election alerts via SMS' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <Toggle on={settings[item.key]} onClick={() => toggle(item.key)} />
            </div>
          ))}
        </div>

        {/* System */}
        <div className="card" style={{ padding: '1.5rem 2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} color="#6366f1" /> System Settings
          </h3>
          {[
            { key: 'aiChatbot', label: 'AI Chatbot Active', desc: 'Enable the public-facing AI voter assistant' },
            { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Take the portal offline for maintenance' },
            { key: 'publicRegistration', label: 'Public Registration', desc: 'Allow new voter registrations through the portal' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <Toggle on={settings[item.key]} onClick={() => toggle(item.key)} />
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="card" style={{ padding: '1.5rem 2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} color="#10b981" /> Security
          </h3>
          {[
            { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require OTP for all admin logins' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <Toggle on={settings[item.key]} onClick={() => toggle(item.key)} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className="btn admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Lock size={16} /> Change Admin Password
            </button>
            <button className="btn admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <RefreshCw size={16} /> Reset API Keys
            </button>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save Settings
          </button>
          <AnimatePresence>
            {saved && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> Settings saved successfully!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('Analytics');

  const navItems = [
    { icon: <BarChart3 size={20} />, label: 'Analytics' },
    { icon: <Users size={20} />, label: 'Voter Data' },
    { icon: <Calendar size={20} />, label: 'Schedules' },
    { icon: <Bell size={20} />, label: 'Notifications' },
    { icon: <MessageSquare size={20} />, label: 'Chat Logs' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  const sectionTitles = {
    Analytics: 'Dashboard Overview',
    'Voter Data': 'Voter Registry',
    Schedules: 'Election Schedule',
    Notifications: 'Notifications',
    'Chat Logs': 'AI Chat Logs',
    Settings: 'System Settings',
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Analytics': return <AnalyticsSection />;
      case 'Voter Data': return <VoterDataSection />;
      case 'Schedules': return <SchedulesSection />;
      case 'Notifications': return <NotificationsSection />;
      case 'Chat Logs': return <ChatLogsSection />;
      case 'Settings': return <SettingsSection />;
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <LayoutDashboard size={24} />
          <h3>Admin Portal</h3>
        </div>
        <div className="admin-sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`admin-nav-item ${activeSection === item.label ? 'active' : ''}`}
              onClick={() => setActiveSection(item.label)}
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-main-header">
          <h2>{sectionTitles[activeSection]}</h2>
          <div className="btn-group">
            <button className="btn admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} /> Export
            </button>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} /> Publish
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
