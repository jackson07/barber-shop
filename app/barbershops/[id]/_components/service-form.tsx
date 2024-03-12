"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/_components/ui/form"
import { SaveService } from "../_actions/save-service"
import { ChangeEvent, useState } from "react"
import { Loader2 } from "lucide-react"
import useAuth from "@/app/_components/useAuth"

interface ServiceFormProps {
    barbershopID: string,   
    onClose: () => void,
}

const FormSchema = z.object({
    serviceName: z.string().min(2, {
        message: "O nome do serviço deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().min(2, {
        message: "A descrição deve ter pelo menos 2 caracteres.",
    }),
    price: z
        .string()
        .refine(value => !isNaN(parseFloat(value)), {
            message: "O preço deve ser maior que 0.",
        })
        .transform(value => parseFloat(value)),
})

const ServiceForm = ({ barbershopID, onClose }: ServiceFormProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            serviceName: "",
            description: "",
            price: 0,
        },
    })

    const { isAuthorized } = useAuth();   
    if (!isAuthorized) {
        return null;
    };    

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            setSelectedFile(files[0]);
        }
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!selectedFile) {
            toast("Erro ao cadastrar o serviço.", {
                description: "Necessário selecionar uma imagem."
            });

            return;
        };

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("name", data.serviceName);
            formData.append("description", data.description);
            formData.append("price", String(data.price));
            formData.append("photo", selectedFile as File);
            formData.append("barbershopId", barbershopID);

            await SaveService({formData});

            toast("Serviço cadastrado com sucesso!")
            setIsLoading(false);
            onClose();
        } catch (error) {
            console.error(error)
            let errorMessage = "";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast("Erro ao cadastrar o serviço.", {
                description: errorMessage
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="serviceName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Serviço</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do Serviço" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Input placeholder="Descrição" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preço</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Preço" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Imagem</FormLabel>
                    <FormControl>
                        <Input type="file" onChange={handleFileChange} className="w-full"/>
                    </FormControl>
                </FormItem>
                <Button type="submit" disabled={isLoading} className="w-full space-x-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Confirmar Cadastro</span>
                </Button>
            </form>
        </Form>
    )
}

export default ServiceForm;
