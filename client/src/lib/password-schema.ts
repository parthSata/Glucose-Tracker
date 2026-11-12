import { z } from 'zod'

/** bcrypt only uses the first 72 bytes of a password. */
export const PASSWORD_MAX_LENGTH = 72
export const PASSWORD_MIN_LENGTH = 8

const passwordMessages = {
  required: 'Please enter a password.',
  nullChar: 'Password cannot contain null characters.',
  min: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  max: `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`,
  lowercase: 'Password must include at least one lowercase letter.',
  uppercase: 'Password must include at least one uppercase letter.',
  number: 'Password must include at least one number.',
  special: 'Password must include at least one special character.',
} as const

/**
 * Full password policy for registration.
 * Checks stop at the first failure so the UI shows one clear message.
 */
export const registerPasswordSchema = z
  .string({ error: passwordMessages.required })
  .superRefine((value, ctx) => {
    if (value.length === 0) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.required })
      return
    }

    if (value.includes('\0')) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.nullChar })
      return
    }

    if (value.length < PASSWORD_MIN_LENGTH) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.min })
      return
    }

    if (value.length > PASSWORD_MAX_LENGTH) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.max })
      return
    }

    if (!/[a-z]/.test(value)) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.lowercase })
      return
    }

    if (!/[A-Z]/.test(value)) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.uppercase })
      return
    }

    if (!/[0-9]/.test(value)) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.number })
      return
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.special })
    }
  })

/**
 * Login password checks: required, no null bytes, bcrypt-safe max length.
 * Strength rules are not re-checked on login (avoids confusing credential errors).
 */
export const loginPasswordSchema = z
  .string({ error: passwordMessages.required })
  .superRefine((value, ctx) => {
    if (value.length === 0) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.required })
      return
    }

    if (value.includes('\0')) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.nullChar })
      return
    }

    if (value.length > PASSWORD_MAX_LENGTH) {
      ctx.addIssue({ code: 'custom', message: passwordMessages.max })
    }
  })
