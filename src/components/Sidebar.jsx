import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpen, CalendarDays, CheckSquare, CircleDot, Compass, LayoutDashboard, Link2, Moon, Search, Sun, Target, Timer, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

const items = [['Dashboard', '/dashboard', LayoutDashboard], ['Planner', '/planner', Timer], ['Calendar', '/calendar', CalendarDays], ['Tasks', '/tasks', CheckSquare], ['Journal', '/journal', BookOpen], ['Habits', '/habits', CircleDot], ['Goals', '/goals', Target], ['Weekly review', '/review', Compass], ['Search', '/search', Search]]
export default function Sidebar() {
  const { theme, setTheme, setToast } = useApp()
  const [manualDark, setManualDark] = useState(theme === 'dark')
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); setToast('Link copied to clipboard') } catch { setToast('Could not copy link on this device') } }
  const toggleTheme = () => { const next = manualDark ? 'light' : 'dark'; setManualDark(!manualDark); setTheme(next); setToast(`${next === 'dark' ? 'Dark' : 'Light'} theme enabled`) }
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={15} /></span>Lumen</div><div className="nav-label">Workspace</div><nav className="nav-list" aria-label="Main navigation">{items.map(([label, path, Icon]) => <NavLink key={path} to={path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span></NavLink>)}</nav><div className="sidebar-bottom"><button className="side-action" onClick={share}><Link2 size={16} />Share link</button><button className="side-action" onClick={toggleTheme}>{manualDark ? <Sun size={16} /> : <Moon size={16} />}Switch theme</button></div></aside>
}