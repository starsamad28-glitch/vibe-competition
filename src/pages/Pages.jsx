import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, Check, ChevronLeft, ChevronRight, CircleCheck, Plus, Search as SearchIcon, SlidersHorizontal, Sparkles, Target, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { addDays, formatDate, iso, weekStart } from '../lib/dates'
import { Card, EmptyState, ProgressBar, TaskRow } from '../components/UI'

const navDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const moods = ['ðŸ˜ž', 'ðŸ˜', 'ðŸ™‚', 'ðŸ˜„']
const timeLabel = (hour) => `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? ' PM' : ' AM'}`
function Header({ eyebrow, title, subtitle, action }) { return <header className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p className="subtitle">{subtitle}</p>}</div>{action}</header> }
function WidgetHeading({ title, to, action }) { return <div className="card-head"><h2 className="card-title">{title}</h2>{action || (to && <a className="small muted" href={`#${to}`}>View all</a>)}</div> }
function streakFor(habit) { let count = 0; let day = iso(); if (!habit.days.includes(day)) day = addDays(day, -1); while (habit.days.includes(day)) { count += 1; day = addDays(day, -1) } return count }

export function Dashboard() {
  const { data, toggleTask, toggleHabitDay, updateData } = useApp()
  const today = iso()
  const todaysTasks = data.tasks.filter((task) => task.date === today)
  const doneTasks = todaysTasks.filter((task) => task.done).length
  const checkedHabits = data.habits.filter((habit) => habit.days.includes(today)).length
  const average = data.goals.length ? Math.round(data.goals.reduce((sum, goal) => sum + goal.progress, 0) / data.goals.length) : 0
  const [customizing, setCustomizing] = useState(false)
  const nowHour = new Date().getHours()
  const greeting = nowHour < 12 ? 'Good morning' : nowHour < 18 ? 'Good afternoon' : 'Good evening'
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const widgets = [['tasks', 'Todayâ€™s tasks'], ['habits', 'Habits today'], ['goals', 'Goals'], ['note', 'Quick note'], ['journal', 'Todayâ€™s journal']]
  return <div className="page"><Header eyebrow={dateLabel} title={`${greeting}.`} subtitle="A little clarity for whatever today brings." action={<button className="button" onClick={() => setCustomizing(!customizing)}><SlidersHorizontal size={14} />Customize</button>} />
    {customizing && <div className="customize-panel">{widgets.map(([key, label]) => <button key={key} className={`chip-toggle ${data.widgets[key] ? 'on' : ''}`} onClick={() => updateData('widgets', { ...data.widgets, [key]: !data.widgets[key] })}>{data.widgets[key] ? 'âœ“ ' : '+ '}{label}</button>)}</div>}
    <div className="grid stats-grid"><Card className="stat"><div className="stat-label"><Check size={14} />Tasks done today</div><div className="stat-number">{doneTasks} <small>/ {todaysTasks.length}</small></div></Card><Card className="stat"><div className="stat-label"><CircleCheck size={14} />Habits checked today</div><div className="stat-number">{checkedHabits} <small>/ {data.habits.length}</small></div></Card><Card className="stat"><div className="stat-label"><Target size={14} />Average goal progress</div><div className="stat-number">{average}<small>%</small></div></Card></div>
    <div className="grid dashboard-grid"><div className="widget-list">
      {data.widgets.tasks && <Card><WidgetHeading title="Todayâ€™s tasks" to="/tasks" />{todaysTasks.length ? <div className="task-list">{todaysTasks.slice(0, 5).map((task) => <TaskRow key={task.id} task={task} toggleTask={toggleTask} />)}</div> : <EmptyState icon={Check}>No tasks today. Add one in Tasks.</EmptyState>}</Card>}
      {data.widgets.goals && <Card><WidgetHeading title="Goals" to="/goals" />{data.goals.length ? data.goals.slice(0, 3).map((goal) => <div className="goal-row" key={goal.id}><div className="goal-meta"><span>{goal.title}</span><span className="muted">{goal.progress}%</span></div><ProgressBar value={goal.progress} /></div>) : <EmptyState icon={Target}>No goals yet. Add one in Goals.</EmptyState>}</Card>}
      {data.widgets.journal && <Card><WidgetHeading title="Todayâ€™s journal" action={<a className="button" href="#/journal">Write entry</a>} />{data.journal[today] ? <><div className="journal-preview">{data.journal[today].text || 'A new page is waiting.'}</div><div className="small muted" style={{ marginTop: 10 }}>{data.journal[today].mood} {data.journal[today].title}</div></> : <EmptyState icon={BookOpen}>No entry yet. Make a little space to reflect.</EmptyState>}</Card>}
    </div><div className="widget-list">
      {data.widgets.habits && <Card><WidgetHeading title="Habits today" to="/habits" />{data.habits.length ? data.habits.map((habit) => <div className="habit-row" key={habit.id}><input className="check" type="checkbox" checked={habit.days.includes(today)} onChange={() => toggleHabitDay(habit.id, today)} aria-label={`Mark ${habit.name} complete today`} /><span className="habit-name">{habit.name}</span><span className="streak">{streakFor(habit)}-day streak</span></div>) : <EmptyState icon={CircleCheck}>No habits yet. Add one in Habits.</EmptyState>}</Card>}
      {data.widgets.note && <Card><WidgetHeading title="Quick note" /><textarea className="note-area" value={data.note} onChange={(event) => updateData('note', event.target.value)} placeholder="Capture a thought for laterâ€¦" aria-label="Quick note" /><div className="small muted">Saved automatically</div></Card>}
    </div></div>
  </div>
}

export function Planner() {
  const { data, savePlan, addTask, toggleTask } = useApp()
  const [params] = useSearchParams()
  const [date, setDate] = useState(params.get('date') || iso())
  const [title, setTitle] = useState('')
  const tasks = data.tasks.filter((task) => task.date === date)
  const shift = (amount) => setDate((current) => addDays(current, amount))
  const quickAdd = (event) => { event.preventDefault(); if (!title.trim()) return; addTask({ title: title.trim(), date, priority: 'm', tags: [] }); setTitle('') }
  return <div className="page"><Header eyebrow="Make room for what matters" title="Daily planner" subtitle={formatDate(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} action={<div className="week-nav"><button className="icon-button" onClick={() => shift(-1)} aria-label="Previous day"><ChevronLeft size={17} /></button><button className="button" onClick={() => setDate(iso())}>Today</button><button className="icon-button" onClick={() => shift(1)} aria-label="Next day"><ChevronRight size={17} /></button></div>} />
    <div className="grid planner-layout"><Card><div className="card-head"><h2 className="card-title">Time blocks</h2><span className="small muted">6:00 AM â€“ 9:00 PM</span></div>{Array.from({ length: 16 }, (_, index) => index + 6).map((hour) => <div className="hour-row" key={hour}><span className="hour">{timeLabel(hour)}</span><input className="hour-input" value={data.plan[date]?.[hour] || ''} onChange={(event) => savePlan(date, hour, event.target.value)} placeholder="Add a focus or planâ€¦" aria-label={`Plan for ${timeLabel(hour)}`} /></div>)}</Card><Card><WidgetHeading title="Tasks for this day" />{tasks.length ? tasks.map((task) => <TaskRow key={task.id} task={task} toggleTask={toggleTask} />) : <EmptyState icon={Check}>No tasks planned for this day.</EmptyState>}<form className="form-row" onSubmit={quickAdd}><input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a taskâ€¦" aria-label="New task title" /><button className="button primary" aria-label="Add task"><Plus size={15} /></button></form></Card></div>
  </div>
}

export function CalendarPage() {
  const { data } = useApp()
  const [month, setMonth] = useState(() => { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), 1) })
  const navigate = useNavigate()
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const cells = Array.from({ length: 42 }, (_, index) => iso(new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1)))
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(month)
  const move = (offset) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  return <div className="page"><Header eyebrow="See the shape of your days" title="Calendar" subtitle="Tasks and reflections, all in one place." /><Card><div className="calendar-top"><div className="week-nav"><button className="icon-button" onClick={() => move(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button><button className="icon-button" onClick={() => move(1)} aria-label="Next month"><ChevronRight size={18} /></button><span className="month-label">{monthLabel}</span></div><button className="button" onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>Today</button></div><div className="calendar-grid">{navDays.map((day) => <div className="weekday" key={day}>{day}</div>)}{cells.map((day) => { const tasks = data.tasks.filter((task) => task.date === day); const inMonth = Number(day.slice(5, 7)) === month.getMonth() + 1; return <div key={day} className={`calendar-cell ${day === iso() ? 'today' : ''} ${inMonth ? '' : 'outside'}`} onClick={() => navigate(`/planner?date=${day}`)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && navigate(`/planner?date=${day}`)} aria-label={`Open planner for ${formatDate(day, { month: 'long', day: 'numeric', year: 'numeric' })}`}><div className="calendar-day">{Number(day.slice(8, 10))}</div>{tasks.slice(0, 2).map((task) => <div className="calendar-chip" key={task.id}>{task.title}</div>)}{data.journal[day] && <div className="calendar-chip journal">Journal</div>}</div> })}</div></Card></div>
}

function parseTags(text) { return [...new Set((text.match(/#([\w-]+)/g) || []).map((tag) => tag.slice(1)))] }
export function Tasks() {
  const { data, addTask, toggleTask, deleteTask } = useApp()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(iso())
  const [priority, setPriority] = useState('m')
  const [filter, setFilter] = useState('All')
  const onSubmit = (event) => { event.preventDefault(); if (title.trim()) { addTask({ title: title.trim(), date, priority, tags: parseTags(title) }); setTitle('') } }
  const visible = data.tasks.filter((task) => filter === 'All' || (filter === 'Open' ? !task.done : task.done)).sort((a, b) => Number(a.done) - Number(b.done) || a.date.localeCompare(b.date))
  return <div className="page"><Header eyebrow="Keep the next step visible" title="Tasks" subtitle={`${data.tasks.filter((task) => !task.done).length} open tasks`} /><Card style={{ marginBottom: 16 }}><form className="form-row" onSubmit={onSubmit}><input className="input" style={{ flex: 1 }} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs doing? Add #tags" aria-label="Task title" /><input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Task date" /><select className="select" value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Priority"><option value="l">Low</option><option value="m">Medium</option><option value="h">High</option></select><button className="button primary" type="submit"><Plus size={14} />Add task</button></form></Card><Card><div className="filters">{['All', 'Open', 'Done'].map((tab) => <button key={tab} onClick={() => setFilter(tab)} className={`filter ${filter === tab ? 'active' : ''}`}>{tab}</button>)}</div>{visible.length ? visible.map((task) => <TaskRow key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} showDate />) : <EmptyState icon={Check}>Nothing here yet. Add a task to get started.</EmptyState>}</Card></div>
}

export function Journal() {
  const { data, saveJournal } = useApp()
  const [params] = useSearchParams()
  const entries = Object.entries(data.journal).sort(([a], [b]) => b.localeCompare(a))
  const [selected, setSelected] = useState(params.get('date') || entries[0]?.[0] || iso())
  const entry = data.journal[selected] || { title: '', mood: 'ðŸ™‚', text: '' }
  const update = (key, value) => saveJournal(selected, { ...entry, [key]: value })
  const words = entry.text.trim() ? entry.text.trim().split(/\s+/).length : 0
  return <div className="page"><Header eyebrow="A place to notice" title="Journal" subtitle="A few honest words are enough." action={<button className="button primary" onClick={() => setSelected(iso())}><Plus size={14} />New entry for today</button>} /><div className="journal-layout"><Card><WidgetHeading title="Entries" /><div className="entry-list">{entries.length ? entries.map(([date, item]) => <button key={date} className={`entry-item ${date === selected ? 'active' : ''}`} onClick={() => setSelected(date)}><div className="entry-title">{item.mood} {item.title || 'Untitled entry'}</div><div className="entry-meta">{formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })}</div></button>) : <EmptyState icon={BookOpen}>Your reflections will appear here.</EmptyState>}</div></Card><Card><div className="card-head"><span className="small muted">{formatDate(selected, { weekday: 'long', month: 'long', day: 'numeric' })}</span><div className="mood-picker" aria-label="Choose a mood">{moods.map((mood) => <button key={mood} className={`mood ${entry.mood === mood ? 'selected' : ''}`} onClick={() => update('mood', mood)} aria-label={`Mood ${mood}`}>{mood}</button>)}</div></div><input className="journal-title" value={entry.title} onChange={(event) => update('title', event.target.value)} placeholder="A title for todayâ€¦" aria-label="Journal title" /><textarea className="journal-body" value={entry.text} onChange={(event) => update('text', event.target.value)} placeholder="Whatâ€™s on your mind?" aria-label="Journal entry" /><div className="word-count">{words} {words === 1 ? 'word' : 'words'} Â· Saved automatically</div></Card></div></div>
}

export function Habits() {
  const { data, addHabit, toggleHabitDay, deleteHabit } = useApp()
  const [name, setName] = useState('')
  const days = Array.from({ length: 7 }, (_, index) => addDays(iso(), index - 6))
  const submit = (event) => { event.preventDefault(); if (name.trim()) { addHabit(name.trim()); setName('') } }
  return <div className="page"><Header eyebrow="Small steps, repeated" title="Habits" subtitle="Consistency is built one day at a time." /><Card style={{ marginBottom: 16 }}><form className="form-row" onSubmit={submit}><input className="input" style={{ flex: 1 }} value={name} onChange={(event) => setName(event.target.value)} placeholder="Add a habitâ€¦" aria-label="New habit name" /><button className="button primary"><Plus size={14} />Add habit</button></form></Card><Card><div className="habit-grid"><div className="habit-grid-head" />{days.map((day) => <div className="habit-grid-head" key={day}>{new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(new Date(`${day}T12:00:00`))}<br />{Number(day.slice(8, 10))}</div>)}<div className="habit-grid-head">Streak</div><div />{data.habits.map((habit) => <HabitGridRow key={habit.id} habit={habit} days={days} toggleHabitDay={toggleHabitDay} deleteHabit={deleteHabit} />)}</div>{!data.habits.length && <EmptyState icon={CircleCheck}>No habits yet. Add one to start your rhythm.</EmptyState>}</Card></div>
}
function HabitGridRow({ habit, days, toggleHabitDay, deleteHabit }) { return <><div className="habit-grid-name">{habit.name}</div>{days.map((day) => <button key={day} className={`habit-square ${habit.days.includes(day) ? 'checked' : ''}`} onClick={() => toggleHabitDay(habit.id, day)} aria-label={`${habit.name}, ${formatDate(day)}: ${habit.days.includes(day) ? 'done' : 'not done'}`}>{habit.days.includes(day) && <Check size={14} />}</button>)}<div className="habit-streak-cell">{streakFor(habit)}-day streak</div><button className="icon-button" onClick={() => deleteHabit(habit.id)} aria-label={`Delete ${habit.name}`}><Trash2 size={14} /></button></> }

export function Goals() {
  const { data, addGoal, setGoalProgress } = useApp()
  const [title, setTitle] = useState('')
  const [due, setDue] = useState(addDays(iso(), 30))
  const submit = (event) => { event.preventDefault(); if (title.trim()) { addGoal({ title: title.trim(), due }); setTitle('') } }
  return <div className="page"><Header eyebrow="Make progress visible" title="Goals" subtitle="Longer horizons, broken into everyday progress." /><div className="grid goal-cards">{data.goals.map((goal) => <Card className="goal-card" key={goal.id}><div className="goal-meta"><div><h2 className="card-title">{goal.title}</h2><span className="small muted">Due {formatDate(goal.due, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div><strong>{goal.progress}%</strong></div><ProgressBar value={goal.progress} /><input className="range" type="range" min="0" max="100" value={goal.progress} onChange={(event) => setGoalProgress(goal.id, Number(event.target.value))} aria-label={`Progress for ${goal.title}`} /></Card>)}<Card className="goal-card"><div><h2 className="card-title">A new goal</h2><p className="small muted" style={{ marginTop: 5 }}>What would you like to work toward?</p></div><form onSubmit={submit} className="widget-list"><input className="input full-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Name your goal" aria-label="Goal title" /><label className="form-field"><span className="small muted">Due date</span><input className="input full-input" type="date" value={due} onChange={(event) => setDue(event.target.value)} /></label><button className="button primary" type="submit"><Plus size={14} />Add goal</button></form></Card></div></div>
}

export function Review() {
  const { data, saveReview } = useApp()
  const start = weekStart(iso())
  const review = data.reviews[start] || { wentWell: '', change: '' }
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index))
  const completed = data.tasks.filter((task) => days.includes(task.date) && task.done).length
  const total = data.tasks.filter((task) => days.includes(task.date)).length
  const journalCount = days.filter((day) => data.journal[day]).length
  const moodValues = { 'ðŸ˜ž': 1, 'ðŸ˜': 2, 'ðŸ™‚': 3, 'ðŸ˜„': 4 }
  const moodEntries = days.map((day) => data.journal[day]).filter(Boolean)
  const mood = moodEntries.length ? (moodEntries.reduce((sum, item) => sum + moodValues[item.mood], 0) / moodEntries.length).toFixed(1) : 'â€”'
  const update = (key, value) => saveReview(start, { ...review, [key]: value })
  return <div className="page"><Header eyebrow={`${formatDate(start)} â€“ ${formatDate(days[6], { month: 'short', day: 'numeric', year: 'numeric' })}`} title="Weekly review" subtitle="Take a moment to notice what moved you forward." /><div className="grid review-grid"><Card className="review-stat"><div className="small muted">Tasks completed</div><div className="review-stat-value">{completed}<small className="small muted"> / {total}</small></div></Card><Card className="review-stat"><div className="small muted">Journal entries</div><div className="review-stat-value">{journalCount}<small className="small muted"> / 7</small></div></Card><Card className="review-stat"><div className="small muted">Average mood</div><div className="review-stat-value">{mood}<small className="small muted"> / 4</small></div></Card><Card className="review-stat"><div className="small muted">Habits tracked</div><div className="review-stat-value">{data.habits.length}<small className="small muted"> habits</small></div></Card></div><div className="grid dashboard-grid"><Card><WidgetHeading title="Habit consistency" />{data.habits.length ? data.habits.map((habit) => { const count = habit.days.filter((day) => days.includes(day)).length; return <div className="goal-row" key={habit.id}><div className="goal-meta"><span>{habit.name}</span><span className="muted">{count}/7 days</span></div><ProgressBar value={count / 7 * 100} green /></div> }) : <EmptyState icon={CircleCheck}>Add habits to see your weekly rhythm.</EmptyState>}</Card><div className="widget-list"><Card><WidgetHeading title="What went well?" /><textarea className="reflection" value={review.wentWell} onChange={(event) => update('wentWell', event.target.value)} placeholder="What are you proud of this week?" aria-label="What went well" /></Card><Card><WidgetHeading title="What will you change next week?" /><textarea className="reflection" value={review.change} onChange={(event) => update('change', event.target.value)} placeholder="What would make next week feel better?" aria-label="What will you change next week" /></Card></div></div></div>
}

export function Search() {
  const { data } = useApp()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(params.get('tag') ? `#${params.get('tag')}` : '')
  const needle = query.trim().replace(/^#/, '').toLowerCase()
  const matches = (value) => !needle || value.toLowerCase().includes(needle)
  const tasks = data.tasks.filter((task) => matches(`${task.title} ${task.tags.join(' ')}`))
  const journals = Object.entries(data.journal).filter(([, entry]) => matches(`${entry.title} ${entry.text}`)).sort(([a], [b]) => b.localeCompare(a))
  const goals = data.goals.filter((goal) => matches(goal.title))
  const habits = data.habits.filter((habit) => matches(habit.name))
  const note = data.note && matches(data.note) ? data.note : ''
  const hasQuery = Boolean(needle)
  return <div className="page"><Header eyebrow="Find a thought or next step" title="Search" subtitle="Search tasks, journal entries, goals, habits, and your note." /><div className="search-box"><SearchIcon size={18} className="muted" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try a word or #tagâ€¦" aria-label="Search everything" /></div>{!hasQuery ? <EmptyState icon={SearchIcon}>Start typing to search your workspace.</EmptyState> : <div className="grid dashboard-grid"><div className="widget-list">{tasks.length > 0 && <SearchSection title="Tasks" items={tasks.map((task) => ({ text: task.title, icon: Check, onClick: () => navigate('/tasks') }))} />}{journals.length > 0 && <SearchSection title="Journal" items={journals.map(([date, item]) => ({ text: `${item.mood} ${item.title || 'Untitled entry'} Â· ${formatDate(date)}`, icon: BookOpen, onClick: () => navigate(`/journal?date=${date}`) }))} />}{note && <SearchSection title="Quick note" items={[{ text: note, icon: Sparkles }]} />}</div><div className="widget-list">{goals.length > 0 && <SearchSection title="Goals" items={goals.map((goal) => ({ text: goal.title, icon: Target, onClick: () => navigate('/goals') }))} />}{habits.length > 0 && <SearchSection title="Habits" items={habits.map((habit) => ({ text: habit.name, icon: CircleCheck, onClick: () => navigate('/habits') }))} />}{!tasks.length && !journals.length && !goals.length && !habits.length && !note && <EmptyState icon={SearchIcon}>No matches. Try another search.</EmptyState>}</div></div>}</div>
}
function SearchSection({ title, items }) { return <Card className="result-section"><WidgetHeading title={title} />{items.map((item, index) => <button className="result" key={`${title}-${index}`} onClick={item.onClick}><item.icon size={14} className="muted" /><span>{item.text}</span></button>)}</Card> }

