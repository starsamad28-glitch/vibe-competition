import { Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/dates'

export function Card({ children, className = '', ...props }) { return <section className={`card card-pad ${className}`} {...props}>{children}</section> }
export function EmptyState({ icon: Icon = Circle, children }) { return <div className="empty"><span className="empty-icon"><Icon size={16} /></span>{children}</div> }
export function ProgressBar({ value, green = false }) { return <div className="progress-line" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100"><div className={`progress-fill ${green ? 'green' : ''}`} style={{ width: `${value}%` }} /></div> }
export function TaskRow({ task, toggleTask, deleteTask, showDate = false }) {
  return <div className="task-row"><input className="check" type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} aria-label={`${task.done ? 'Mark open' : 'Complete'} ${task.title}`} /><span className={`task-title ${task.done ? 'done' : ''}`}>{task.title.replace(/\s+#\w+/g, '')}</span>{task.tags?.length > 0 && <span className="tags">{task.tags.map((tag) => <Link className="tag" key={tag} to={`/search?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</span>}<span className="date-badge">{showDate && formatDate(task.date)}<i className={`priority-dot priority-${task.priority}`} title={`${task.priority} priority`} /></span>{deleteTask && <button className="icon-button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>×</button>}</div>
}