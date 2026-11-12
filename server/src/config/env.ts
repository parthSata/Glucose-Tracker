import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
