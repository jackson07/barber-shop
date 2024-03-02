import { redirect } from "next/navigation";
import BarberShopItem from "../(home)/_components/barbsershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import Search from "../(home)/_components/search";
import { getServerSession } from "next-auth";
import { authOption } from "../_lib/auth";
import BookingItem from "../_components/booking-item";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BarbershopPageProps {
    searchParams: {
        search?: string;
    }
}

const BarbershopsPage = async ({ searchParams }: BarbershopPageProps) => {
    if (!searchParams.search) {
        return redirect('/')
    }

    const session = await getServerSession(authOption);

    const [barbershops, confirmedBookings] = await Promise.all([
        db.barbershop.findMany({
            where: {
                name: {
                    contains: searchParams.search,
                    mode: 'insensitive'
                }
            }
        }),
        session?.user
            ? await db.booking.findMany({
                where: {
                    userId: (session.user as any).id,
                    date: {
                        gte: new Date(),
                    }
                },
                include: {
                    service: true,
                    barbershop: true,
                }
            })
            : Promise.resolve([])
    ]);

    return (
        <>
            <Header />
            <div className="px-5 pt-5">
                <h2 className="text-xl font-bold">{session?.user ? `Olá, ${session.user.name?.split(" ")[0]}` : 'Seja Bem vindo!'}</h2>
                <p className="capitalize text-sm">
                    {format(new Date(), "EEEE',' dd 'de' MMMM", {
                        locale: ptBR
                    })}
                </p>
            </div>
            
            <div className="px-5 py-6 flex flex-col gap-6">
                <Search defaultValues={{
                    search: searchParams.search
                }} />
                <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para &quot;{searchParams.search}&quot;.</h1>

                <div className="grid grid-cols-2 mt-3 gap-4">
                    {barbershops.map((barbershop) => (
                        <div className="w-full max-w-[220px]" key={barbershop.id}>
                            <BarberShopItem barbershop={barbershop} />
                        </div>
                    ))}
                </div>


                {confirmedBookings.length > 0 && (
                    <div className="mt-6">
                        <h2 className="pl-5 text-xs uppercase text-gray-400 font-bold mb-3">Agendamentos</h2>
                        <div className="px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                            {confirmedBookings.map((booking) => (
                                <BookingItem key={booking.id} booking={booking} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default BarbershopsPage;