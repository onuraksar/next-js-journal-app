"use client"

import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createTag } from "@/server/tag"

const MAX_TAG_LENGTH = 20;

const formSchema = z.object({
    name: z.string().min(2).max(MAX_TAG_LENGTH),
})

interface TagFormProps {
    onSuccess?: () => void
}

const TagForm = ({onSuccess} : TagFormProps ) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("values:", values)
        setIsLoading(true)
        try {
            await createTag(values)
            form.reset();
            toast.success("Tag has been added successfully!");
            if(onSuccess) {
                onSuccess();
            }
            router.refresh();
        } catch(e) {
            console.error(e)
            toast.error("Failed to add the tag")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input maxLength={MAX_TAG_LENGTH} placeholder="Enter name for your tag" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} type="submit" className="float-right">
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Add Tag"}
                </Button>
            </form>
        </Form>
    )
}

export default TagForm;