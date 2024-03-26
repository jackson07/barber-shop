"use server";

import { db } from "@/app/_lib/prisma";
import { supabase } from "@/app/_lib/supabase";
import { revalidatePath } from "next/cache";

interface DeleteServiceParams {
  serviceId: string;
  serviceImageName: string;
  barbershopID: string;
}

export const deleteService = async ({serviceId, serviceImageName, barbershopID}: DeleteServiceParams) => {  
  const bookingsCount = await db.booking.count({
    where: {
      serviceId: serviceId
    }
  });

  bookingsCount > 0 ?
    await db.service.update({
      where: {
        id: serviceId
    },
      data: {
        active: false,
      },      
    })
  :
  ( 
    await supabase()
      .storage.from(barbershopID)
      .remove([serviceImageName]),
    await db.service.delete({
      where: {
          id: serviceId
      }
    })
  );

  revalidatePath("/");
  revalidatePath("/bookings");
};