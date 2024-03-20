"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateDescriptionBarbershopParams {
    formData: FormData
}

export const UpdateDescriptionBarbershop = async (params: UpdateDescriptionBarbershopParams) => {
    const id = params.formData.get("id") as string;
    const description = params.formData.get("description") as string;

    await db.barbershop.update({
        where: {
            id: id,
        },
        data: {
            description: description,
        },
    });

    revalidatePath("/");
    revalidatePath("/barbershops");
};