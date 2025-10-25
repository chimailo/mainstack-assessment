import { describe, it, expect } from 'vitest'
import {
  getInitials,
  formatToCurrency,
  filterFalsyValues,
  describeDateRange,
  cn,
} from '../utils'
import { subDays, startOfMonth } from 'date-fns'

describe('utils', () => {
  it('getInitials returns first letters of first and last name', () => {
    expect(getInitials({ first_name: 'John', last_name: 'Doe', email: 'j@example.com' })).toBe('JD')
  })

  it('getInitials falls back to first name or email', () => {
  expect(getInitials({ first_name: 'Alice', email: 'a@example.com' } as any)).toBe('AL')
  expect(getInitials({ last_name: 'Smith', email: 's@example.com' } as any)).toBe('SM')
  expect(getInitials({ email: 'bob@example.com' } as any)).toBe('BO')
  })

  it('formatToCurrency formats numbers for given locale', () => {
    const formatted = formatToCurrency(1234.5, 'USD', 'en-US')
    expect(formatted).toBe('$1,234.50')
  })

  it('filterFalsyValues removes empty strings and falsy values but keeps 0 and booleans', () => {
    const input = {
      a: '',
      b: '  ',
      c: 'value',
      d: 0,
      e: false,
      f: null,
      g: undefined,
      h: [],
      i: [null, {}, { x: '' }, { x: 'ok' }],
      j: { k: '', l: 'yes', m: { n: '' } },
    }

    const out = filterFalsyValues(input as any)
    expect(out).toHaveProperty('c')
    expect(out).toHaveProperty('d')
    expect(out).toHaveProperty('e')
    expect(out).not.toHaveProperty('a')
    expect(out).not.toHaveProperty('b')
    expect(out).not.toHaveProperty('f')
    expect(out).not.toHaveProperty('g')
    expect(out).not.toHaveProperty('h')
    expect((out as any).i).toBeInstanceOf(Array)
    expect((out as any).j).toHaveProperty('l')
  })

  it('describeDateRange recognizes today and last 7 days and this month', () => {
    const today = new Date()
    expect(describeDateRange(today, today)).toBe('today')

    const sevenAgo = subDays(today, 7)
    expect(describeDateRange(sevenAgo, today)).toBe('last 7 days')

    const start = startOfMonth(today)
    expect(describeDateRange(start, today)).toBe('this month')
  })

  it('cn merges and deduplicates classes', () => {
    const out = cn('btn', 'btn-primary', { 'hidden': false }, 'btn')
    expect(typeof out).toBe('string')
    expect(out.includes('btn')).toBeTruthy()
  })
})
