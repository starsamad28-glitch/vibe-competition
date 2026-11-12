export const iso = (date = new Date()) => {
  const value = new Date(date)
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset())
  return value.toISOString().slice(0, 10)
}
export const addDays = (date, amount) => {
  const value = new Date(`${date}T12:00:00`)
  value.setDate(value.getDate() + amount)
  return iso(value)
}
export const formatDate = (date, options = { month: 'short', day: 'numeric' }) => new Intl.DateTimeFormat(undefined, options).format(new Date(`${date}T12:00:00`))
export const weekStart = (date) => {
  const value = new Date(`${date}T12:00:00`)
  value.setDate(value.getDate() - ((value.getDay() + 6) % 7))
  return iso(value)
}