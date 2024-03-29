"use server"

import { db } from "@/app/_lib/prisma"

export const getUsers = async () => {
    const bookings = await db.user.findMany(
        {orderBy: {
            name: "asc"
        }}
    )

    return bookings;
}