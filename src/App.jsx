import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import { Dashboard, Planner, CalendarPage, Tasks, Journal, Habits, Goals, Review, Search } from './pages/Pages'
import './App.css'

function AppLayout() {
  return <div className="app-shell"><Sidebar /><main className="main-area"><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} /><Route path="/planner" element={<Planner />} />
    <Route path="/calendar" element={<CalendarPage />} /><Route path="/tasks" element={<Tasks />} />
    <Route path="/journal" element={<Journal />} /><Route path="/habits" element={<Habits />} />
    <Route path="/goals" element={<Goals />} /><Route path="/review" element={<Review />} />
    <Route path="/search" element={<Search />} /><Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></main><Toast /></div>
}

export default function App() { return <HashRouter><AppProvider><AppLayout /></AppProvider></HashRouter> }
