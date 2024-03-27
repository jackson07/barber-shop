import { Barbershop, Service } from "@prisma/client";
import ServiceCreate from "../service/service-create";
import ServiceItem from "../service/service-item";

interface ServicesTabProps {
    barbershop: Barbershop,
    service: Service[],
}

const ServicesTab = ({barbershop, service}:ServicesTabProps) => {
    return (
        <>
            <div className="flex justify-start">
                <ServiceCreate barbershopID={barbershop.id} />
            </div>
            <div className="flex flex-col gap-4 py-6">
                {service.map(service => (
                    <ServiceItem key={service.id} barbershop={barbershop} service={service} />
                ))}
            </div>
        </>
    );
}

export default ServicesTab;