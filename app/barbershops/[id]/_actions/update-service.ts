"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateServiceParams {
    formData: FormData
}

export const UpdateService = async (params: UpdateServiceParams) => {
    const id = params.formData.get("id") as string;
    const name = params.formData.get("name") as string;
    const description = params.formData.get("description") as string;
    const price = Number(params.formData.get("price"));
    const barbershopId = params.formData.get("barbershopId") as string;

    await db.service.update({
        where: {
            id: id,
        },
        data: {
            name: name,
            description: description,
            price: price,
            barbershopId: barbershopId,
        },
    });

    revalidatePath("/");
    revalidatePath("/bookings");
};