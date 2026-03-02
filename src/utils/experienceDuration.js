const MONTHS = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

function parseMonthYear(value) {
  if (!value || typeof value !== 'string') return null
  const trimmed = value.trim().toLowerCase()
  const match = trimmed.match(/^([a-z]+)\s+(\d{4})$/)
  if (!match) return null

  const month = MONTHS[match[1]]
  const year = Number(match[2])
  if (!Number.isFinite(year) || month === undefined) return null

  return { year, month }
}

function toMonthIndex(parts) {
  return parts.year * 12 + parts.month
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return []
  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  const merged = [sorted[0]]

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = merged[merged.length - 1]
    const next = sorted[i]
    if (next.start <= prev.end) {
      prev.end = Math.max(prev.end, next.end)
    } else {
      merged.push(next)
    }
  }

  return merged
}

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`
}

function durationBetween(start, end, now = new Date()) {
  const startParts = parseMonthYear(start)
  if (!startParts) return null

  const startMonthIndex = toMonthIndex(startParts)
  const currentMonthIndex = now.getFullYear() * 12 + now.getMonth()
  const isPresent = typeof end === 'string' && end.trim().toLowerCase() === 'present'
  const endParts = isPresent ? null : parseMonthYear(end)
  const endMonthIndex = isPresent
    ? currentMonthIndex + 1
    : endParts
      ? toMonthIndex(endParts) + 1
      : null

  if (endMonthIndex === null || endMonthIndex <= startMonthIndex) return null

  const totalMonths = endMonthIndex - startMonthIndex
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years > 0 && months > 0) return `${pluralize(years, 'year')} ${pluralize(months, 'month')}`
  if (years > 0) return pluralize(years, 'year')
  return pluralize(months, 'month')
}

export function formatExperienceDuration(start, end, now = new Date()) {
  return durationBetween(start, end, now) || ''
}

export function formatTotalExperience(experienceItems = [], now = new Date()) {
  const ranges = experienceItems
    .map((item) => {
      const startParts = parseMonthYear(item.start)
      if (!startParts) return null
      const start = toMonthIndex(startParts)

      const isPresent = typeof item.end === 'string' && item.end.trim().toLowerCase() === 'present'
      const endParts = isPresent ? null : parseMonthYear(item.end)
      const currentMonthIndex = now.getFullYear() * 12 + now.getMonth()
      const end = isPresent ? currentMonthIndex + 1 : endParts ? toMonthIndex(endParts) + 1 : null
      if (end === null || end <= start) return null

      return { start, end }
    })
    .filter(Boolean)

  if (ranges.length === 0) return '0 months'

  const merged = mergeRanges(ranges)
  const totalMonths = merged.reduce((sum, range) => sum + (range.end - range.start), 0)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years > 0 && months > 0) {
    return `${pluralize(years, 'year')} ${pluralize(months, 'month')}`
  }
  if (years > 0) return pluralize(years, 'year')
  return pluralize(months, 'month')
}
