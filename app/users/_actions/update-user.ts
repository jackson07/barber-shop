"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateUsersParams {
    userId: string;
    role: string;
}

export const updateUser = async (params: UpdateUsersParams) => {
  await db.user.update({
    where: {
        id: params.userId,
    },
    data: {
        role: params.role,
    }
  });

  revalidatePath("/");
  revalidatePath("/users");
};