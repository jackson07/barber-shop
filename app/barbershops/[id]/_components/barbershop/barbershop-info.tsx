"use client"
import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BarbershopAddress from "./barbershop-address";

interface BarberShopInfoProps {
    barbershop: Barbershop
}

const BarberShopInfo = ({barbershop}:BarberShopInfoProps) => {
    const router = useRouter();  

    const handleBackClick = () => {
        router.replace("/");
    }

    return (
        <div>
            <div className="h-[250px] w-full relative">
                <Button 
                    size="icon"
                    variant="outline" 
                    className="z-50 absolute top-4 left-4"
                    onClick={handleBackClick}
                    >
                    <ChevronLeftIcon />
                </Button>                

                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline" className="z-50 absolute top-4 right-4">
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>

                    <SheetContent className="p-0">
                        <SideMenu />
                    </SheetContent>
                </Sheet>

                <Image
                    src={barbershop.imageUrl}
                    alt={barbershop.name}
                    fill
                    style={{
                        objectFit: "cover"
                    }}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="opacity-75"
                />
                
            </div>

            <div className="px-5 py-6 border-b border-solid border-secondary">
                <h1 className="text-xl font-bold">
                    {barbershop.name}
                </h1>
                <BarbershopAddress  barbershop={barbershop}/>
                {/* <div className="flex items-center gap-1 mt-2">
                    <StarIcon className="text-primary fill-primary" size={18}/>
                    <p className="text-sm">5,0 (899 avaliações)</p>
                </div> */}
            </div>
        </div>
    );
}
 
export default BarberShopInfo;