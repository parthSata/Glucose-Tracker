import { z } from 'zod'
import {
  loginPasswordSchema,
  registerPasswordSchema,
} from './password.validators'

export const registerBodySchema = z.object({
  name: z
    .string({ error: 'Please enter your name.' })
    .trim()
    .min(1, 'Please enter your name.'),
  email: z
    .string({ error: 'Please enter your email.' })
    .trim()
    .min(1, 'Please enter your email.')
    .email('Please enter a valid email address.')
    .transform((value) => value.toLowerCase()),
  password: registerPasswordSchema,
})

export const loginBodySchema = z.object({
  email: z
    .string({ error: 'Please enter your email.' })
    .trim()
    .min(1, 'Please enter your email.')
    .email('Please enter a valid email address.')
    .transform((value) => value.toLowerCase()),
  password: loginPasswordSchema,
})

export type RegisterBody = z.infer<typeof registerBodySchema>
export type LoginBody = z.infer<typeof loginBodySchema>
