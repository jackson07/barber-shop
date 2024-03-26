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
import { Service } from "@prisma/client"
import { Textarea } from "@/app/_components/ui/textarea"
import { UpdateService } from "../_actions/update-service"
import { FormSchema } from "../_models/serice-model"

interface ServiceFormProps {
    barbershopID: string,
    service: Service | null
    onClose: () => void,
}

const ServiceForm = ({ barbershopID, service, onClose }: ServiceFormProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            serviceName: service?.name || "",
            description: service?.description || "",
            price: service?.price !== undefined ? Number(service.price.toString()) : 0.0
        }
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
        if (!selectedFile && !service?.id) {
            toast.error("Erro ao cadastrar o serviço.", {
                description: "Necessário selecionar uma imagem."
            });
            return;
        };

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("id", service?.id || "");
            formData.append("name", data.serviceName);
            formData.append("description", data.description);
            formData.append("price", String(data.price));
            formData.append("photo", selectedFile as File);
            formData.append("photoName", selectedFile ? selectedFile?.name : '');
            formData.append("barbershopId", barbershopID);            

            if (!service?.id) {
                try {
                    await SaveService({ formData });
                    toast.success("Serviço cadastrado com sucesso!")
                } catch (error) {
                    console.error("Erro ao cadastrar o serviço:", error);
                    let errorMessage = '';

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    toast.error("Erro ao confirmar o agendamento, atualize a página ou refaça o login no menu.", {
                        description: errorMessage
                    });
                }
            } else {
                try {
                    await UpdateService({ formData });
                    toast.success("Serviço atualizado com sucesso!")
                } catch (error) {
                    console.error("Erro ao atualizar o serviço:", error);
                    let errorMessage = '';

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    toast.error("Erro ao atualizar o agendamento, atualize a página ou refaça o login no menu.", {
                        description: errorMessage
                    });
                }
            }
            setIsLoading(false);
            onClose();
        } catch (error) {
            console.error(error)
            let errorMessage = "";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Erro ao cadastrar o serviço.", {
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
                            <FormControl >
                                <Textarea className="h-36 resize-y text-wrap" placeholder="Descrição" {...field} />
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
                                <Input type="number" placeholder="Preço" {...field} step="0.01" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!service?.imageUrl &&
                    <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                            <Input type="file" onChange={handleFileChange} className="w-full" />
                        </FormControl>
                    </FormItem>
                }
                <div className="flex flex-row gap-3 mt-6">
                    <Button type="button" className="w-full text-xs" variant="secondary" onClick={() => { onClose() }}>Voltar</Button>
                    <Button type="submit" disabled={isLoading} className="w-full space-x-2">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                            <span>Confirmar Cadastro</span>}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ServiceForm;
