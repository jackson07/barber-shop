"use client"
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from '@prisma/client';
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopItemProps {
    barbershop: Barbershop;
}

const BarberShopItem = ({ barbershop }:BarbershopItemProps) => {    
    const router = useRouter();

    const handleBookingClick = () => {
        router.push(`/barbershops/${barbershop.id}`)
    }

    return ( 
        <Card className="min-w-full max-w-full rounded-2xl">
            <CardContent className="px-1 py-0 pt-1">
                <div className="h-[159px] w-full relative">
                    <div className="absolute top-2 left-2 z-50">
                        <Badge variant="secondary" className="opacity-90 flex gap-1 items-center justify-center top-3 left-3">
                            <StarIcon size={12} className="fill-primary text-primary"/>
                            <span className="text-xs">5,0</span>
                        </Badge>
                    </div>
                    <Image
                        src={barbershop.imageUrl}
                        style={{
                            objectFit: "cover"
                        }}
                        alt={barbershop.name}
                        className="rounded-2xl"
                        height={0}
                        width={0}
                        fill
                        sizes="100vw"                    
                    />
                </div>
                <div className="px-3 pb-3">
                    <h2 className="font-bold mt-2 overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
                    <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">{barbershop.address}</p>
                    <Button variant="secondary" className="w-full mt-3" onClick={handleBookingClick}>Conhecer</Button>
                </div>
            </CardContent>
        </Card>
     );
}
 
export default BarberShopItem;