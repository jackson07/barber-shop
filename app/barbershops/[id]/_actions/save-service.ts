"use server";

import { db } from "@/app/_lib/prisma";
import { supabase } from "@/app/_lib/supabase";
import { revalidatePath } from "next/cache";

interface SaveServiceParams {
  formData: FormData
}

export const SaveService = async (params: SaveServiceParams) => {
  const name = params.formData.get("name") as string;
	const description = params.formData.get("description") as string;
	const price = Number(params.formData.get("price"));
	const photo = params.formData.get("photo") as File;
  const photoName = params.formData.get("photoName") as string;
  const barbershopId = params.formData.get("barbershopId") as string;

  await supabase()
    .storage
    .createBucket(barbershopId, {
      public: true,
    });

  await supabase()
			.storage.from(barbershopId)
			.upload(photo.name, photo);

  const publicUrl = await supabase().storage
			.from(barbershopId)
			.getPublicUrl(photo.name);

  await db.service.create({
    data: {
      name: name,
      description: description,
      price: price,
      imageUrl: publicUrl.data.publicUrl, 
      imageName: photoName,
      barbershopId: barbershopId,      
    },
  });

  revalidatePath("/");
  revalidatePath("/bookings");
};