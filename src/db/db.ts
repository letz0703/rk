import {PrismaClient} from "@prisma/client"

const prismaClientSingleton = () => new PrismaClient()
const db = globalThis.prisma ?? prismaClientSingleton()
if (process.env.NODE_ENV !== "production") globalThis.prisma = db

export default db
