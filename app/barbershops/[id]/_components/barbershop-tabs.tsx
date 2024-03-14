"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import ServiceItem from "./service-item";
import { Prisma } from "@prisma/client";
import InformationTab from "./information-tab";
import ServiceCreate from "./service-create";

interface BarbershopTabsProps {
    barbershop: Prisma.BarbershopGetPayload<{
        include: {
            openingHour: true,
            services: true,
        }
    }>
    IsAuthenticated: boolean
}

const BarbershopTabs = ({ barbershop, IsAuthenticated }: BarbershopTabsProps) => {    
    return (
        <Tabs defaultValue="services" className="py-4">
            <TabsList className="flex justify-start bg-default text-white px-5">
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="information">Informações</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="p-5">
                <div className="flex justify-start">
                    <ServiceCreate barbershopID={barbershop.id}/>
                </div>
                <div className="flex flex-col gap-4 py-6">
                    {barbershop.services.map(service => (
                        <ServiceItem key={service.id} barbershop={barbershop} service={service} isAuthenticated={IsAuthenticated} />
                    ))}
                </div>                
            </TabsContent>
            <TabsContent value="information">
                <InformationTab barbershop={barbershop} />
            </TabsContent>
        </Tabs>
    );
}

export default BarbershopTabs;