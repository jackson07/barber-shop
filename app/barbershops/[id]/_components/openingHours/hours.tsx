import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { getWeekdayName } from "@/app/_lib/utils";
import { OpeningHour } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateHours } from "../../_actions/update-hours";
import useAuth from "@/app/_components/useAuth";

interface HoursProps {
    hour: OpeningHour,
    barbershopUserID: string,
}

const parseTimeInput = (value: string): Date => {
    const [hours, minutes] = value.split(":").map(num => parseInt(num, 10));
    const date = new Date();
    if (!isNaN(hours) && !isNaN(minutes)) {
        date.setHours(hours, minutes);
    }
    return date;
}

const Hours = ({ hour, barbershopUserID }: HoursProps) => {
    const [editHour, setEditHour] = useState<Boolean>(false);
    const [newDateStart, setNewDateStart] = useState<Date>(hour.dateStart);
    const [newDateEnd, setNewDateEnd] = useState<Date>(hour.dateEnd);
    const [isLoading, setIsLoading] = useState(false);

    const { isAuthorized } = useAuth(barbershopUserID);

    const handleUpdateHourClick = async () => {
        setIsLoading(true);
        try {
            await UpdateHours({
                id: hour.id,
                barbershopId: hour.barbershopId,
                day: hour.day,
                dateStart: newDateStart,
                dateEnd: newDateEnd,
            });
            toast.success("Horário de funcionamento atualizado com sucesso!")
            setEditHour(false)
        } catch (error) {
            console.error("Erro ao atualizar o horário:", error);
            let errorMessage = '';

            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error("Erro ao atualizar o horário, atualize a página ou refaça o login no menu.", {
                description: errorMessage
            });
        }
        setIsLoading(false);
    };

    const handleCancelClick = () => {
        setEditHour(false);
        setNewDateStart(hour.dateStart);
        setNewDateEnd(hour.dateEnd);
    }

    return (
        <div className="flex justify-between items-center py-2">
            <span className="font-semibold text-gray-400 uppercase text-xs">{getWeekdayName(hour.day)}</span>
            {editHour ?
                <div className="flex items-center h-6">
                    <Input
                        type="time"
                        value={newDateStart ? format(newDateStart, "HH:mm") : ""}
                        onChange={(e) => setNewDateStart(parseTimeInput(e.target.value))}
                    />
                    -
                    <Input
                        type="time"
                        value={newDateEnd ? format(newDateEnd, "HH:mm") : ""}
                        onChange={(e) => setNewDateEnd(parseTimeInput(e.target.value))}
                    />
                    <Button className="p-0 pl-1" variant="ghost" onClick={handleUpdateHourClick}>
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" />
                            : <Save color="green" size={18} />}
                    </Button>
                    <Button className="p-0 pl-1" variant="ghost" onClick={handleCancelClick}>
                        <X size={18} className="text-destructive" />
                    </Button>
                </div>
                :
                <div>
                    {hour.dateStart.getHours() === 0 && hour.dateStart.getMinutes() === 0 && hour.dateEnd.getHours() === 0 && hour.dateEnd.getMinutes() === 0 ? (
                        <span>Fechado</span>
                    ) : (
                        <span>
                            {format(hour.dateStart.toISOString(), "HH:mm", {
                                locale: ptBR,
                            })} - {format(hour.dateEnd.toISOString(), "HH:mm", {
                                locale: ptBR,
                            })}
                        </span>
                    )}
                    {isAuthorized &&
                        <Button className="p-0 pl-1 h-[8px]" variant="ghost" onClick={() => { setEditHour(true) }}>
                            <Edit2 size={14} />
                        </Button>
                    }
                </div>
            }
        </div >
    );
}

export default Hours;