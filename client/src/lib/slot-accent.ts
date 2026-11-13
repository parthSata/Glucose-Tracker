import type { TimeSlotValue } from '@/lib/time-slots'

/** Soft visual accents per slot — decorative only, not medical ranges. */
export const SLOT_ACCENT: Record<
  TimeSlotValue,
  { bar: string; chip: string; soft: string }
> = {
  MORNING: {
    bar: 'bg-teal-600',
    chip: 'bg-teal-700 text-white',
    soft: 'from-teal-50/80 to-white',
  },
  AFTER_BREAKFAST: {
    bar: 'bg-emerald-500',
    chip: 'bg-emerald-600 text-white',
    soft: 'from-emerald-50/80 to-white',
  },
  AFTER_LUNCH: {
    bar: 'bg-cyan-600',
    chip: 'bg-cyan-700 text-white',
    soft: 'from-cyan-50/80 to-white',
  },
  AFTER_DINNER: {
    bar: 'bg-sky-600',
    chip: 'bg-sky-700 text-white',
    soft: 'from-sky-50/80 to-white',
  },
}
