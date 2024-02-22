import { Prisma } from '@prisma/client'

export type CustomPrismaError = Prisma.PrismaClientValidationError | Prisma.PrismaClientKnownRequestError | Error;