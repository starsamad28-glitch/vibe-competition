import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { makeSeed } from '../lib/seed'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [data, setData] = useLocalStorage('lumen-data-v1', makeSeed)
  const [theme, setTheme] = useLocalStorage('lumen-theme', 'system')
  const [toast, setToast] = useState('')
  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(''), 2400); return () => clearTimeout(timer) }, [toast])
  const actions = useMemo(() => ({
    setToast, setTheme,
    addTask: (task) => setData((state) => ({ ...state, tasks: [...state.tasks, { ...task, id: crypto.randomUUID(), done: false }] })),
    toggleTask: (id) => setData((state) => ({ ...state, tasks: state.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task) })),
    deleteTask: (id) => setData((state) => ({ ...state, tasks: state.tasks.filter((task) => task.id !== id) })),
    toggleHabitDay: (id, day) => setData((state) => ({ ...state, habits: state.habits.map((habit) => habit.id !== id ? habit : { ...habit, days: habit.days.includes(day) ? habit.days.filter((item) => item !== day) : [...habit.days, day] }) })),
    addHabit: (name) => setData((state) => ({ ...state, habits: [...state.habits, { id: crypto.randomUUID(), name, days: [] }] })),
    deleteHabit: (id) => setData((state) => ({ ...state, habits: state.habits.filter((habit) => habit.id !== id) })),
    setGoalProgress: (id, progress) => setData((state) => ({ ...state, goals: state.goals.map((goal) => goal.id === id ? { ...goal, progress } : goal) })),
    addGoal: (goal) => setData((state) => ({ ...state, goals: [...state.goals, { ...goal, id: crypto.randomUUID(), progress: 0 }] })),
    saveJournal: (date, entry) => setData((state) => ({ ...state, journal: { ...state.journal, [date]: entry } })),
    savePlan: (date, hour, value) => setData((state) => ({ ...state, plan: { ...state.plan, [date]: { ...state.plan[date], [hour]: value } } })),
    updateData: (key, value) => setData((state) => ({ ...state, [key]: value })),
    saveReview: (key, value) => setData((state) => ({ ...state, reviews: { ...state.reviews, [key]: value } })),
  }), [setData, setTheme])
  return <AppContext.Provider value={{ data, theme, toast, ...actions }}>{children}</AppContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)