import { addDays, iso } from './dates'

export function makeSeed() {
  const today = iso()
  return {
    tasks: [
      { id: 's1', title: 'Review the Q3 project brief #work', date: today, priority: 'h', done: false, tags: ['work'] },
      { id: 's2', title: 'Take a walk before lunch #wellbeing', date: today, priority: 'm', done: true, tags: ['wellbeing'] },
      { id: 's3', title: 'Read for twenty minutes', date: today, priority: 'l', done: false, tags: [] },
      { id: 's4', title: 'Plan next week’s meals', date: addDays(today, 1), priority: 'l', done: false, tags: [] },
    ],
    habits: [
      { id: 'h1', name: 'Morning pages', days: [addDays(today, -3), addDays(today, -2), addDays(today, -1), today] },
      { id: 'h2', name: 'Move for 30 minutes', days: [addDays(today, -1), today] },
      { id: 'h3', name: 'Read before bed', days: [addDays(today, -4), addDays(today, -3), addDays(today, -1)] },
    ],
    goals: [
      { id: 'g1', title: 'Finish the portfolio refresh', progress: 64, due: addDays(today, 24) },
      { id: 'g2', title: 'Build a steady reading habit', progress: 38, due: addDays(today, 52) },
    ],
    journal: {
      [addDays(today, -1)]: { title: 'A slower kind of progress', mood: '🙂', text: 'I made a little space today and noticed how much easier it was to focus. The small things are adding up.' },
      [addDays(today, -3)]: { title: 'Finding my rhythm', mood: '😄', text: 'A good day for getting outside and resetting my week. I want to carry this calmer pace into tomorrow.' },
    },
    plan: {}, note: 'One thing at a time. Start with the brief, then take a proper break.',
    widgets: { tasks: true, habits: true, goals: true, note: true, journal: true }, reviews: {},
  }
}