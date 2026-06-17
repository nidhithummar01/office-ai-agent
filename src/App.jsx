import { useState } from 'react'
import {
  LayoutDashboard, Mail, CheckSquare, Users, MessageCircle,
  FileText, Bell, BarChart2, Star, Clock, Bot, Send, Check, X,
  Brain, RefreshCw, AlertTriangle, ChevronRight, ArrowUpRight,
  Phone, Wifi, CircleCheck, Timer, Edit3
} from 'lucide-react'

// ── Mock Data ──────────────────────────────────────────────────────────────

const EMAILS = [
  { id:1, sender:'Client XYZ', subject:'Website Redesign – Urgent Changes Required', priority:'High', time:'9:15 AM', read:false, body:'We need the homepage redesigned with new branding. Contact form update required. Delivery expected by Friday EOD.', aiSummary:'Client requires homepage redesign, updated contact form. Deadline: Friday EOD.', action:'Assign to Emma (Design Lead)', assignee:'Emma' },
  { id:2, sender:'Marcus Reed', subject:'API Integration Status Update', priority:'Medium', time:'10:30 AM', read:true, body:'The payment gateway API integration is 60% complete. Expecting to finish by tomorrow.', aiSummary:'Payment gateway API 60% done. Marcus estimates completion tomorrow.', action:'Log progress, schedule follow-up tomorrow', assignee:'Marcus' },
  { id:3, sender:'Client ABC', subject:'Meeting Request – Product Demo', priority:'High', time:'11:00 AM', read:false, body:'Please schedule a product demo for next Tuesday at 3 PM. Entire decision-making team will be present.', aiSummary:'Client ABC requesting product demo next Tuesday at 3 PM.', action:'Schedule calendar event + confirm with team', assignee:'Admin' },
  { id:4, sender:'Emma', subject:'Homepage Update – Completed', priority:'Low', time:'12:45 PM', read:true, body:'I have completed the homepage update as requested. Please review and provide feedback.', aiSummary:'Emma completed homepage update. Awaiting management review.', action:'Notify management to review', assignee:'Admin' },
  { id:5, sender:'Vendor Supplies', subject:'Invoice #1042 Payment Due', priority:'High', time:'2:00 PM', read:false, body:'Invoice #1042 for $4,500 is due on June 20. Please arrange payment.', aiSummary:'Invoice #1042 — $4,500 due June 20.', action:'Flag for finance team approval', assignee:'Finance' },
  { id:6, sender:'Tyler Brooks', subject:'Database Migration Complete', priority:'Low', time:'3:30 PM', read:true, body:'Successfully migrated the database to new server. All tests passing.', aiSummary:'Database migration completed. All systems operational.', action:'Mark task as completed', assignee:'Tyler' },
]

const TASKS = [
  { id:1,  title:'Homepage Redesign',        assignee:'Emma',   priority:'High',   status:'In Progress', due:'Jun 20', progress:70,  source:'Email' },
  { id:2,  title:'Payment Gateway API',      assignee:'Marcus', priority:'High',   status:'In Progress', due:'Jun 18', progress:60,  source:'Meeting' },
  { id:3,  title:'Contact Form Update',      assignee:'Tyler',  priority:'Medium', status:'Pending',     due:'Jun 21', progress:0,   source:'Email' },
  { id:4,  title:'Product Demo Prep',        assignee:'Emma',   priority:'High',   status:'Pending',     due:'Jun 22', progress:20,  source:'Email' },
  { id:5,  title:'Database Migration Test',  assignee:'Tyler',  priority:'Medium', status:'Completed',   due:'Jun 17', progress:100, source:'Manual' },
  { id:6,  title:'Client XYZ Report',        assignee:'Marcus', priority:'Low',    status:'Pending',     due:'Jun 25', progress:0,   source:'Manual' },
  { id:7,  title:'Mobile App Bug Fix',       assignee:'Chris',  priority:'High',   status:'In Progress', due:'Jun 19', progress:45,  source:'Bug Tracker' },
  { id:8,  title:'SEO Optimization',         assignee:'Olivia', priority:'Low',    status:'Completed',   due:'Jun 15', progress:100, source:'Meeting' },
  { id:9,  title:'Social Media Content',     assignee:'Olivia', priority:'Medium', status:'Pending',     due:'Jun 23', progress:30,  source:'Manual' },
  { id:10, title:'Invoice Processing',       assignee:'Admin',  priority:'High',   status:'Pending',     due:'Jun 20', progress:0,   source:'Email' },
]

const STAFF = [
  { id:1, name:'Emma',   role:'Design Lead',      avatar:'E', color:'#2563eb', bg:'#dbeafe', tasks:6, completed:4, pending:2, rate:80 },
  { id:2, name:'Tyler',  role:'Full Stack Dev',   avatar:'T', color:'#7c3aed', bg:'#ede9fe', tasks:5, completed:4, pending:1, rate:85 },
  { id:3, name:'Marcus', role:'Backend Dev',      avatar:'M', color:'#0891b2', bg:'#cffafe', tasks:4, completed:2, pending:2, rate:60 },
  { id:4, name:'Olivia', role:'Marketing',        avatar:'O', color:'#16a34a', bg:'#dcfce7', tasks:4, completed:3, pending:1, rate:75 },
  { id:5, name:'Chris',  role:'Mobile Dev',       avatar:'C', color:'#d97706', bg:'#fef3c7', tasks:3, completed:1, pending:2, rate:45 },
]

const CHATS = {
  Emma: [
    { from:'AI',   text:'Hi Emma, can you provide an update on the Homepage Redesign task?', time:'10:00 AM' },
    { from:'Emma', text:'Hi! Work is 70% complete. Finishing mobile responsiveness now.', time:'10:15 AM' },
    { from:'AI',   text:'Great progress! What is the expected completion date?', time:'10:16 AM' },
    { from:'Emma', text:"I'll finish by tomorrow EOD, June 18.", time:'10:30 AM' },
    { from:'AI',   text:'Perfect. Task status updated. Let me know if you need anything.', time:'10:31 AM' },
  ],
  Marcus: [
    { from:'AI',     text:'Hi Marcus, the Payment Gateway API was assigned 3 days ago. Please share a status update.', time:'11:00 AM' },
    { from:'Marcus', text:'Working on it. About 60% done. Minor issue with authentication.', time:'11:20 AM' },
    { from:'AI',     text:'Do you need support from the engineering team?', time:'11:21 AM' },
    { from:'Marcus', text:"Yes, Tyler's help with OAuth setup would be useful.", time:'11:35 AM' },
    { from:'AI',     text:'Notified Tyler to assist. Expected completion?', time:'11:36 AM' },
    { from:'Marcus', text:'Tomorrow.', time:'11:50 AM' },
  ],
  Tyler: [
    { from:'AI',    text:'Hi Tyler, Marcus needs help with OAuth for Payment Gateway. Can you assist today?', time:'11:37 AM' },
    { from:'Tyler', text:'Sure, will connect with Marcus after lunch.', time:'11:45 AM' },
    { from:'AI',    text:'Database migration confirmed complete. Great work!', time:'11:46 AM' },
    { from:'Tyler', text:'Thanks! Starting Contact Form task today.', time:'12:00 PM' },
  ],
  Olivia: [
    { from:'AI',     text:'Hi Olivia, Social Media Content is due June 23. Current progress?', time:'2:00 PM' },
    { from:'Olivia', text:'30% done. Working on Instagram posts for this week.', time:'2:15 PM' },
    { from:'AI',     text:"You'll need to reach 60% by tomorrow to stay on track.", time:'2:16 PM' },
  ],
  Chris: [
    { from:'AI',    text:'Hi Chris, Mobile App Bug Fix is high priority, due June 19. Status?', time:'1:00 PM' },
    { from:'Chris', text:'Found the root cause. Should be resolved by EOD today.', time:'1:30 PM' },
    { from:'AI',    text:'Excellent. Please confirm once done so management can verify.', time:'1:31 PM' },
  ],
}

const APPROVALS_INIT = [
  { id:1, type:'Email Reply', to:'Client XYZ', subject:'Project Update', body:'Dear Client,\n\nThank you for your email. We have assigned your homepage redesign to our Design Lead and it will be completed by June 20.\n\nBest regards,\nNorthline Team', urgency:'High', time:'5 min ago' },
  { id:2, type:'WhatsApp',    to:'Chris',      subject:'Task Reminder',  body:'Hi Chris, the Mobile App Bug Fix is due tomorrow June 19. Please ensure it is completed and tested before EOD. Thank you.', urgency:'Medium', time:'12 min ago' },
  { id:3, type:'Email Reply', to:'Client ABC', subject:'Demo Confirmation', body:'Dear Client ABC,\n\nWe confirm the product demo for Tuesday at 3 PM. Our team will prepare a comprehensive presentation. Please share any specific focus areas.\n\nBest regards.', urgency:'High', time:'28 min ago' },
]

const TIMELINE = [
  { time:'9:00 AM',  action:'Inbox Scanned',          detail:'48 emails read · 6 flagged as priority', type:'mail' },
  { time:'9:15 AM',  action:'Task Created',            detail:'Homepage Redesign → Emma (Client XYZ email)', type:'task' },
  { time:'9:30 AM',  action:'Task Created',            detail:'Demo Preparation task created (Client ABC email)', type:'task' },
  { time:'10:00 AM', action:'WhatsApp Follow-up Sent', detail:'Follow-up sent to Emma re: Homepage Redesign', type:'wa' },
  { time:'10:15 AM', action:'Response Received',       detail:'Emma: 70% complete, delivery June 18', type:'reply' },
  { time:'11:00 AM', action:'WhatsApp Follow-up Sent', detail:'Follow-up sent to Marcus re: API Integration', type:'wa' },
  { time:'11:37 AM', action:'WhatsApp Follow-up Sent', detail:'Tyler notified to assist Marcus with OAuth', type:'wa' },
  { time:'1:00 PM',  action:'WhatsApp Follow-up Sent', detail:'Follow-up sent to Chris re: Bug Fix', type:'wa' },
  { time:'1:30 PM',  action:'Response Received',       detail:'Chris: Root cause found, resolve by EOD', type:'reply' },
  { time:'2:00 PM',  action:'Meeting Notes Analyzed',  detail:'4 tasks extracted from afternoon meeting', type:'notes' },
  { time:'3:30 PM',  action:'Task Completed',          detail:'Tyler: Database Migration marked complete ✓', type:'check' },
  { time:'5:00 PM',  action:'EOD Report Generated',    detail:'Daily report ready for management review', type:'report' },
]

const MEETING_DEFAULT = `Client meeting - June 17, 2026

Attendees: James, Emma, Tyler, Client XYZ

Discussion Points:
1. Homepage redesign deadline confirmed as June 20
2. New contact form needs validation and WhatsApp integration
3. Engineering team to start mobile app testing phase next week
4. Client requested weekly progress reports every Monday

Action Items:
- Emma to finalize homepage by June 20
- Tyler to set up contact form with WhatsApp webhook
- Marcus to send weekly report template to client
- Schedule next review meeting for June 24`

const EXTRACTED = [
  { task:'Finalize homepage design',                  assignee:'Emma',   due:'Jun 20', priority:'High' },
  { task:'Set up contact form with WhatsApp webhook', assignee:'Tyler',  due:'Jun 21', priority:'High' },
  { task:'Send weekly report template to client',     assignee:'Marcus', due:'Jun 18', priority:'Medium' },
  { task:'Schedule next review meeting',              assignee:'Admin',  due:'Jun 24', priority:'Low' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function Badge({ label }) {
  const cls = label === 'High' ? 'badge-high' : label === 'Medium' ? 'badge-medium' : 'badge-low'
  return <span className={`badge ${cls}`}>{label}</span>
}
function StatusBadge({ label }) {
  const cls = label === 'Completed' ? 'badge-done' : label === 'In Progress' ? 'badge-prog' : 'badge-pend'
  return <span className={`badge ${cls}`}>{label}</span>
}
function Avatar({ name, color, bg, size = 28 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: bg, color }}>
      {name[0]}
    </div>
  )
}
function StaffAvatar({ s, size = 28 }) {
  return <Avatar name={s.name} color={s.color} bg={s.bg} size={size} />
}
function ProgressBar({ value }) {
  return (
    <div className="progress-track" style={{ width: 70 }}>
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  )
}

// ── NAV ───────────────────────────────────────────────────────────────────

const NAV = [
  { id:'dashboard',   label:'Dashboard',        Icon:LayoutDashboard },
  { id:'emails',      label:'Email Monitor',    Icon:Mail },
  { id:'tasks',       label:'Task Manager',     Icon:CheckSquare },
  { id:'followup',    label:'Staff Follow-up',  Icon:Users },
  { id:'whatsapp',    label:'WhatsApp Sim',     Icon:MessageCircle },
  { id:'notes',       label:'Meeting Notes',    Icon:FileText },
  { id:'approval',    label:'Approval Center',  Icon:Bell },
  { id:'performance', label:'Staff Performance',Icon:BarChart2 },
  { id:'report',      label:'Daily Report',     Icon:Star },
  { id:'timeline',    label:'AI Timeline',      Icon:Clock },
]

// ── PAGES ─────────────────────────────────────────────────────────────────

function PageHeader({ Icon, title, sub }) {
  return (
    <div className="page-header">
      <div className="page-title-row">
        <div className="page-icon"><Icon size={18} /></div>
        <h1 className="page-title">{title}</h1>
      </div>
      <p className="page-sub">{sub}</p>
    </div>
  )
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────

function Dashboard({ setTab }) {
  const STATS = [
    { label:'Emails Today',     value:'48', sub:'6 priority',      color:'#2563eb', Icon:Mail },
    { label:'Tasks Pending',    value:'7',  sub:'3 overdue',       color:'#dc2626', Icon:CheckSquare },
    { label:'Tasks Completed',  value:'3',  sub:'today',           color:'#16a34a', Icon:CircleCheck },
    { label:'Follow-ups Sent',  value:'5',  sub:'2 awaiting reply',color:'#d97706', Icon:MessageCircle },
    { label:'Staff Active',     value:'5',  sub:'all online',      color:'#0891b2', Icon:Users },
    { label:'AI Actions Today', value:'12', sub:'all processed',   color:'#7c3aed', Icon:Bot },
  ]
  const highTasks = TASKS.filter(t => t.priority === 'High' && t.status !== 'Completed').slice(0, 4)

  return (
    <div>
      {/* Title */}
      <div className="hero-card">
        <div className="hero-glow" />
        <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
          <span className="online-dot" />
          <span className="hero-badge">AI Agent Active</span>
        </div>
        <h1 className="hero-title">Office AI Agent</h1>
        <p className="hero-sub">Tuesday, 17 June 2026 · Last sync 2 min ago</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS.map((s, i) => (
          <div className="stat-card" key={s.label} style={{ borderTopColor: s.color }}>
            <div className="stat-icon" style={{ background: s.color + '18' }}>
              <s.Icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Priority Tasks */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <span className="card-title">Priority Tasks</span>
            <button className="link-btn" onClick={() => setTab('tasks')}>View all <ChevronRight size={13} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {highTasks.map(t => {
              const s = STAFF.find(s => s.name === t.assignee)
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-subtle)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
                  {s && <StaffAvatar s={s} size={28} />}
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.assignee} · Due {t.due}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{t.progress}%</div>
                    <div className="progress-track" style={{ width: 50, marginTop: 4 }}>
                      <div className="progress-fill" style={{ width: `${t.progress}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Staff Status */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <span className="card-title">Staff Status</span>
            <button className="link-btn" onClick={() => setTab('performance')}>View <ChevronRight size={13} /></button>
          </div>
          {STAFF.map(s => (
            <div key={s.id} className="flex items-center gap-3" style={{ marginBottom: 12 }}>
              <StaffAvatar s={s} size={30} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-1)' }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.rate}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${s.rate}%`, background: s.color }} />
                </div>
              </div>
              <span style={{ fontSize: 11, color: s.pending > 1 ? 'var(--yellow)' : 'var(--text-3)', flexShrink: 0 }}>{s.pending}P</span>
            </div>
          ))}
        </div>

        {/* AI Activity */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <span className="card-title">Recent AI Activity</span>
            <button className="link-btn" onClick={() => setTab('timeline')}>Full log <ChevronRight size={13} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TIMELINE.slice(-5).reverse().map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(37,99,235,0.12)' }}>
                  <Bot size={13} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{item.action}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.time} · {item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card" style={{ borderColor: '#fecaca', background: 'var(--red-soft)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
            <AlertTriangle size={15} style={{ color: 'var(--red)' }} />
            <span className="card-title">Attention Required</span>
          </div>
          {[
            { txt:'Client XYZ deadline tomorrow (Jun 18)', who:'Emma', urgent: true },
            { txt:'Invoice #1042 payment due Jun 20', who:'Finance', urgent: true },
            { txt:"Chris's completion rate is 45% — escalation needed", who:'Chris', urgent: false },
            { txt:'3 approvals pending in Approval Center', who:'Admin', urgent: false },
          ].map((a, i) => (
            <div key={i} className="alert-item" style={{ borderColor: a.urgent ? '#fecaca' : 'var(--border)', background: a.urgent ? '#fff' : 'var(--bg-subtle)' }}>
              <span className={a.urgent ? 'alert-dot-red' : 'alert-dot-yellow'} />
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{a.txt}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Responsible: {a.who}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── EMAIL MONITOR ──────────────────────────────────────────────────────────

function EmailMonitor() {
  const [selected, setSelected] = useState(null)
  const [created, setCreated] = useState([])

  return (
    <div>
      <PageHeader Icon={Mail} title="Email Monitor" sub="AI reads and summarises every incoming email automatically" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* List */}
        <div>
          {EMAILS.map(e => (
            <div key={e.id} className={`email-item ${selected?.id === e.id ? 'selected' : ''}`} onClick={() => setSelected(e)}>
              <span className={`email-dot ${e.read ? 'read' : ''}`} style={{ marginTop: 4 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{e.sender}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>{e.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.subject}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.aiSummary}</div>
              </div>
              <Badge label={e.priority} />
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <div className="flex items-start justify-between gap-10" style={{ marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{selected.subject}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{selected.sender} · {selected.time}</div>
                </div>
                <Badge label={selected.priority} />
              </div>
              <hr className="divider" style={{ marginTop: 12, marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{selected.body}</p>
            </div>

            <div className="card" style={{ borderColor: 'rgba(37,99,235,0.2)', background: 'var(--accent-soft)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                <Brain size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>AI Summary</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6 }}>{selected.aiSummary}</p>
              <hr className="divider" style={{ margin: '10px 0' }} />
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3 }}>Suggested Action</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{selected.action}</div>
            </div>

            <button
              className={`btn ${created.includes(selected.id) ? 'btn-success' : 'btn-primary'}`}
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
              onClick={() => setCreated(p => p.includes(selected.id) ? p : [...p, selected.id])}
            >
              {created.includes(selected.id)
                ? <><Check size={14} /> Task Created → {selected.assignee}</>
                : <><CheckSquare size={14} /> Create Task & Assign to {selected.assignee}</>}
            </button>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
            <Mail size={36} style={{ color: 'var(--text-3)', marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Select an email to view AI analysis</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── TASK MANAGER ───────────────────────────────────────────────────────────

function TaskManager() {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Pending', 'In Progress', 'Completed', 'High Priority']
  const filtered = TASKS.filter(t =>
    filter === 'All' ? true :
    filter === 'High Priority' ? t.priority === 'High' :
    t.status === filter
  )

  return (
    <div>
      <PageHeader Icon={CheckSquare} title="Task Manager" sub="AI-generated tasks from emails, meetings and meeting notes" />
      <div className="filter-row">
        {filters.map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {['Task', 'Assigned To', 'Priority', 'Status', 'Due', 'Progress', 'Source'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const s = STAFF.find(s => s.name === t.assignee)
              return (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text-1)', fontWeight: 500 }}>{t.title}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {s && <StaffAvatar s={s} size={24} />}
                      <span>{t.assignee}</span>
                    </div>
                  </td>
                  <td><Badge label={t.priority} /></td>
                  <td><StatusBadge label={t.status} /></td>
                  <td style={{ color: 'var(--text-3)' }}>{t.due}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={t.progress} />
                      <span style={{ fontSize: 11, color: 'var(--text-3)', width: 28 }}>{t.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.source}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── STAFF FOLLOW-UP ────────────────────────────────────────────────────────

function StaffFollowup() {
  const [sel, setSel] = useState(STAFF[0])
  const tasks = TASKS.filter(t => t.assignee === sel.name)
  const chat = CHATS[sel.name] || []

  return (
    <div>
      <PageHeader Icon={Users} title="Staff Follow-up" sub="AI tracks every staff member and sends automated follow-up messages" />
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Staff list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {STAFF.map(s => (
            <button
              key={s.id}
              onClick={() => setSel(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 10, border: `1px solid ${sel.id === s.id ? 'rgba(37,99,235,0.35)' : 'var(--border)'}`,
                background: sel.id === s.id ? 'var(--accent-soft)' : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
              }}
            >
              <StaffAvatar s={s} size={32} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.role}</div>
              </div>
              <span style={{ fontSize: 11, color: s.rate >= 75 ? 'var(--green)' : s.rate >= 60 ? 'var(--yellow)' : 'var(--red)', flexShrink: 0 }}>{s.rate}%</span>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tasks */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>{sel.name}'s Tasks</div>
            {tasks.length === 0
              ? <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No tasks assigned.</p>
              : tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3" style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '10px 12px', marginBottom: 8, border: '1px solid var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{t.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Due {t.due}</div>
                    </div>
                    <div className="flex items-center gap-8">
                      <ProgressBar value={t.progress} />
                      <StatusBadge label={t.status} />
                    </div>
                  </div>
                ))}
          </div>

          {/* Conversation */}
          <div className="card">
            <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
              <MessageCircle size={14} style={{ color: 'var(--accent)' }} />
              <span className="card-title">AI Follow-up Conversation</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
              {chat.map((msg, i) => (
                <div key={i} className="flex" style={{ justifyContent: msg.from === 'AI' ? 'flex-start' : 'flex-end' }}>
                  <div className={msg.from === 'AI' ? 'bubble-ai' : 'bubble-user'}>
                    {msg.from === 'AI' && <div className="bubble-from">AI Agent</div>}
                    <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{msg.text}</div>
                    <div className="bubble-time">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ flex: 1, background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: 'var(--text-3)' }}>
                AI will send next follow-up tomorrow at 9:00 AM…
              </div>
              <button className="wa-send"><Send size={13} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── WHATSAPP SIMULATION ────────────────────────────────────────────────────

function WhatsAppSim() {
  const [sel, setSel] = useState(STAFF[0])
  const [localChats, setLocalChats] = useState(CHATS)
  const [input, setInput] = useState('')

  const chat = localChats[sel.name] || []

  const send = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setLocalChats(p => ({ ...p, [sel.name]: [...(p[sel.name] || []), { from: 'AI', text: input, time: now }] }))
    setInput('')
  }

  return (
    <div>
      <PageHeader Icon={MessageCircle} title="WhatsApp Simulation" sub="Simulated AI-to-staff WhatsApp Business conversations" />
      <div className="wa-layout">
        {/* Sidebar */}
        <div className="wa-sidebar">
          <div className="wa-header">
            <Wifi size={13} style={{ color: '#b8f0d8' }} />
            WhatsApp Business
          </div>
          <div className="wa-list">
            {STAFF.map(s => {
              const last = (localChats[s.name] || []).slice(-1)[0]
              return (
                <div key={s.id} className={`wa-contact ${sel.id === s.id ? 'active' : ''}`} onClick={() => setSel(s)}>
                  <div style={{ position: 'relative' }}>
                    <StaffAvatar s={s} size={36} />
                    <span className="online-dot" style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, border: '2px solid var(--bg-panel)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="wa-name">{s.name}</div>
                    <div className="wa-last">{last?.text || 'No messages'}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat */}
        <div className="wa-chat">
          <div className="wa-chat-hdr">
            <StaffAvatar s={sel} size={32} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{sel.name}</div>
              <div style={{ fontSize: 11, color: 'var(--green)' }}>online</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Phone size={15} style={{ color: 'var(--text-3)' }} />
            </div>
          </div>

          <div className="wa-messages">
            {chat.map((msg, i) => (
              <div key={i} className="flex" style={{ justifyContent: msg.from === 'AI' ? 'flex-start' : 'flex-end' }}>
                <div className={msg.from === 'AI' ? 'bubble-ai' : 'bubble-user'}>
                  {msg.from === 'AI' && <div className="bubble-from">AI Agent</div>}
                  <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{msg.text}</div>
                  <div className="bubble-time">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="wa-input-row">
            <input
              className="wa-input"
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className="wa-send" onClick={send}><Send size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MEETING NOTES ──────────────────────────────────────────────────────────

function MeetingNotes() {
  const [notes, setNotes] = useState(MEETING_DEFAULT)
  const [state, setState] = useState('idle') // idle | loading | done

  const analyze = () => {
    setState('loading')
    setTimeout(() => setState('done'), 1600)
  }

  return (
    <div>
      <PageHeader Icon={FileText} title="Meeting Notes Assistant" sub="Paste meeting notes — AI extracts tasks and assigns them automatically" />
      <div className="two-col">
        <div>
          <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Input Notes</div>
          <textarea
            className="notes-area"
            value={notes}
            onChange={e => { setNotes(e.target.value); setState('idle') }}
          />
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '10px' }}
            onClick={analyze}
            disabled={state === 'loading'}
          >
            {state === 'loading'
              ? <><RefreshCw size={14} className="spin" /> Analyzing…</>
              : <><Brain size={14} /> Analyze with AI</>}
          </button>
        </div>

        <div>
          {state === 'done' ? (
            <div>
              <div className="banner banner-info" style={{ marginBottom: 14 }}>
                <Brain size={14} />
                AI found {EXTRACTED.length} tasks in these notes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EXTRACTED.map((t, i) => (
                  <div key={i} className="card flex items-start gap-3" style={{ padding: '12px 14px' }}>
                    <span style={{ width: 24, height: 24, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(37,99,235,0.12)' }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{t.task}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>→ {t.assignee} · Due {t.due}</div>
                    </div>
                    <Badge label={t.priority} />
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px' }}>
                <CheckSquare size={14} /> Create All Tasks & Notify Staff
              </button>
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center" style={{ minHeight: 360 }}>
              <FileText size={40} style={{ color: 'var(--text-3)', marginBottom: 14 }} />
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>Paste your meeting notes on the left</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', opacity: 0.6 }}>AI will extract and assign tasks automatically</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── APPROVAL CENTER ────────────────────────────────────────────────────────

function ApprovalCenter() {
  const [pending, setPending] = useState(APPROVALS_INIT)
  const [done, setDone] = useState([])

  const act = (id, action) => {
    const item = pending.find(a => a.id === id)
    setPending(p => p.filter(a => a.id !== id))
    setDone(p => [{ ...item, action }, ...p])
  }

  return (
    <div>
      <PageHeader Icon={Bell} title="Approval Center" sub="Review AI-generated emails and messages before they are sent" />

      {pending.length > 0 && (
        <div className="banner banner-warn" style={{ marginBottom: 18 }}>
          <AlertTriangle size={14} />
          {pending.length} action{pending.length > 1 ? 's' : ''} waiting for your approval
        </div>
      )}

      {pending.map(a => (
        <div className="approval-card" key={a.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 600, background: a.type === 'Email Reply' ? 'var(--accent-soft)' : 'var(--green-soft)', color: a.type === 'Email Reply' ? 'var(--accent)' : 'var(--green)', border: `1px solid ${a.type === 'Email Reply' ? 'rgba(37,99,235,0.15)' : '#bbf7d0'}` }}>{a.type}</span>
                <Badge label={a.urgency} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>To: {a.to}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Subject: {a.subject} · {a.time}</div>
            </div>
          </div>
          <div className="approval-body">{a.body}</div>
          <div className="flex items-center gap-2">
            <button className="btn btn-success btn-sm" onClick={() => act(a.id, 'approved')}><Check size={13} /> Approve & Send</button>
            <button className="btn btn-ghost btn-sm"><Edit3 size={13} /> Edit</button>
            <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }} onClick={() => act(a.id, 'rejected')}><X size={13} /> Reject</button>
          </div>
        </div>
      ))}

      {done.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 10 }}>Processed</div>
          {done.map((d, i) => (
            <div key={i} className="flex items-center gap-3" style={{ background: 'var(--bg-panel)', border: `1px solid ${d.action === 'approved' ? '#bbf7d0' : '#fecaca'}`, borderRadius: 10, padding: '11px 14px', marginBottom: 8, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: d.action === 'approved' ? 'var(--green-soft)' : 'var(--red-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {d.action === 'approved' ? <Check size={13} style={{ color: 'var(--green)' }} /> : <X size={13} style={{ color: 'var(--red)' }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{d.type} to {d.to}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'capitalize' }}>{d.action}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && done.length === 0 && (
        <div className="card flex flex-col items-center justify-center" style={{ minHeight: 260 }}>
          <CircleCheck size={36} style={{ color: 'var(--green)', opacity: 0.4, marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>All actions reviewed</p>
        </div>
      )}
    </div>
  )
}

// ── STAFF PERFORMANCE ──────────────────────────────────────────────────────

function StaffPerformance() {
  return (
    <div>
      <PageHeader Icon={BarChart2} title="Staff Performance" sub="AI-tracked completion rates and task metrics per team member" />

      <div className="three-col" style={{ marginBottom: 24 }}>
        {STAFF.map(s => {
          const rateColor = s.rate >= 75 ? 'var(--green)' : s.rate >= 60 ? 'var(--yellow)' : 'var(--red)'
          const status = s.rate >= 75 ? 'On Track' : s.rate >= 60 ? 'Needs Attention' : 'At Risk'
          return (
            <div className="perf-card" key={s.id}>
              <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                <div className="perf-avatar" style={{ background: s.bg, color: s.color }}>{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="perf-name">{s.name}</div>
                  <div className="perf-role">{s.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="perf-pct" style={{ color: rateColor }}>{s.rate}%</div>
                </div>
              </div>

              {[{ label: 'Tasks Assigned', val: s.tasks, max: 10 }, { label: 'Completed', val: s.completed, max: s.tasks }, { label: 'Pending', val: s.pending, max: s.tasks }].map(row => (
                <div key={row.label}>
                  <div className="perf-row"><span>{row.label}</span><span style={{ color: 'var(--text-1)' }}>{row.val}</span></div>
                  <div className="perf-bar-track">
                    <div className="perf-bar-fill" style={{ width: `${(row.val / row.max) * 100}%`, background: s.color }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 12, background: 'var(--bg-subtle)', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>AI Status</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: rateColor }}>{status}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bar chart */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 20 }}>Team Completion Rate Overview</div>
        {STAFF.map(s => {
          const rateColor = s.rate >= 75 ? '#16a34a' : s.rate >= 60 ? '#ca8a04' : '#dc2626'
          return (
            <div className="staff-bar-row" key={s.id}>
              <div className="staff-bar-name">{s.name}</div>
              <div className="staff-bar-track">
                <div className="staff-bar-fill" style={{ width: `${s.rate}%`, background: `linear-gradient(90deg, ${rateColor}80, ${rateColor})` }}>
                  <span className="staff-bar-pct">{s.rate}%</span>
                </div>
              </div>
              <div className="staff-bar-count">{s.completed}/{s.tasks} done</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── DAILY REPORT ───────────────────────────────────────────────────────────

function DailyReport() {
  const [sent, setSent] = useState(false)

  return (
    <div>
      <PageHeader Icon={Star} title="Daily EOD Report" sub="AI-generated end-of-day summary delivered to management" />

      <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
        <div className="banner banner-info" style={{ padding: '8px 14px' }}>
          <Brain size={13} /><span>Generated by AI Agent · 5:00 PM, Tuesday 17 Jun 2026</span>
        </div>
        <button className={`btn ${sent ? 'btn-success' : 'btn-primary'}`} onClick={() => setSent(true)}>
          {sent ? <><Check size={14} /> Sent to Management</> : <><Send size={14} /> Send Report</>}
        </button>
      </div>

      <div className="card">
        {/* Header */}
        <div className="flex items-start justify-between" style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 6 }}>Daily Office Report</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)' }}>Tuesday, 17 June 2026</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>Prepared by Office AI Agent · Delivered at 5:00 PM</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-1)' }}>75%</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Overall Completion</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label:'Emails Processed', value:'48', color:'#2563eb' },
            { label:'Tasks Created',    value:'10', color:'#7c3aed' },
            { label:'Completed Today',  value:'3',  color:'#16a34a' },
            { label:'Still Pending',    value:'7',  color:'#d97706' },
          ].map(s => (
            <div className="report-stat" key={s.label}>
              <div className="report-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="report-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Staff updates */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 12 }}>Staff Updates</div>
          {STAFF.map(s => {
            const tasks = TASKS.filter(t => t.assignee === s.name)
            const done = tasks.filter(t => t.status === 'Completed')
            const pend = tasks.filter(t => t.status !== 'Completed')
            const rateColor = s.rate >= 75 ? 'var(--green)' : s.rate >= 60 ? 'var(--yellow)' : 'var(--red)'
            return (
              <div key={s.id} className="flex items-start gap-3" style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '12px 14px', marginBottom: 8, border: '1px solid var(--border)' }}>
                <StaffAvatar s={s} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2" style={{ marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.role}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                    {done.length > 0 && <span style={{ color: 'var(--green)' }}>✓ {done.map(t => t.title).join(', ')}. </span>}
                    {pend.length > 0 && <span>Pending: {pend.map(t => `${t.title} (${t.progress}%)`).join(', ')}.</span>}
                    {tasks.length === 0 && 'No tasks today.'}
                  </p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: rateColor, flexShrink: 0 }}>{s.rate}%</span>
              </div>
            )
          })}
        </div>

        {/* Alerts */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 12 }}>Action Required Tomorrow</div>
          {[
            'Client XYZ deadline June 18 — Emma must deliver homepage by EOD.',
            'Invoice #1042 ($4,500) due June 20 — Finance approval needed.',
            "Chris's completion rate (45%) is below threshold — escalation recommended.",
            'Client ABC product demo June 22 — demo prep currently at 20%.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2" style={{ marginBottom: 7 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)', flexShrink: 0, marginTop: 6 }} />
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item}</span>
            </div>
          ))}
        </div>

        <hr className="divider" />
        <div className="flex items-center gap-2">
          <Bot size={13} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Generated automatically. Next report: Wednesday 18 Jun at 5:00 PM.</span>
        </div>
      </div>
    </div>
  )
}

// ── ACTIVITY TIMELINE ──────────────────────────────────────────────────────

function ActivityTimeline() {
  const dotColor = { mail:'#2563eb', task:'#7c3aed', wa:'#16a34a', reply:'#0891b2', notes:'#d97706', check:'#16a34a', report:'#ca8a04' }
  return (
    <div>
      <PageHeader Icon={Clock} title="AI Activity Timeline" sub="Complete chronological log of all AI agent actions today" />
      <div className="card">
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div className="tl-item" key={i}>
              <div className="tl-dot" style={{ background: dotColor[item.type] || '#6366f1', borderColor: 'var(--bg-card)' }} />
              <div className="tl-time">{item.time}</div>
              <div className="tl-action">{item.action}</div>
              <div className="tl-detail">{item.detail}</div>
            </div>
          ))}
          <div className="tl-item">
            <div className="tl-dot" style={{ background: 'var(--text-3)', borderColor: 'var(--bg-card)' }} />
            <div className="tl-time">Next cycle</div>
            <div className="tl-action" style={{ color: 'var(--text-3)' }}>Agent restarts tomorrow at 9:00 AM</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ROOT ───────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState('dashboard')

  const PAGES = {
    dashboard: <Dashboard setTab={setTab} />,
    emails:      <EmailMonitor />,
    tasks:       <TaskManager />,
    followup:    <StaffFollowup />,
    whatsapp:    <WhatsAppSim />,
    notes:       <MeetingNotes />,
    approval:    <ApprovalCenter />,
    performance: <StaffPerformance />,
    report:      <DailyReport />,
    timeline:    <ActivityTimeline />,
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><Bot size={17} /></div>
          <div>
            <div className="logo-text">Office AI</div>
            <div className="logo-sub">Workplace Assistant</div>
          </div>
          <div className="status-dot" />
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              <Icon size={15} className="nav-icon" />
              {label}
              {id === 'approval' && <span className="nav-badge">3</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #dbeafe, #eff6ff)', color: 'var(--accent)' }}>J</div>
            <div>
              <div className="user-name">James Carter</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="main-content">
        <div className="page-inner">
          {PAGES[tab]}
        </div>
      </main>
    </div>
  )
}
