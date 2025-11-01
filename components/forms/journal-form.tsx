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
import { createJournal, updateJournal } from "@/server/journal"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Journal, JournalWithTags, Tag } from "@/db/schema"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const formSchema = z.object({
    title: z.string().min(2).max(50),
    entry: z.string().min(2, "Entry boş olamaz"), 
    mood: z.enum(["happy", "sad", "neutral", "anxious", "excited"]),
    // todo: add tag :
    tags: z.array(z.string()).optional()
})

interface JournalFormProps {
    onSuccess?: () => void,
    journal?: JournalWithTags,
    tags?: Array<Tag>
}

const JournalForm = ({onSuccess, journal, tags} : JournalFormProps ) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    console.log('journal', journal)
    console.log('tags', tags)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: journal?.title ?? (new Date()).toLocaleDateString(),
            entry: journal?.entry ?? "",
            mood: journal?.mood ?? "happy",
            tags: journal?.tags ?? []
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            if(journal) {
                await updateJournal({
                    ...values,
                    id: journal.id
                })
            } else {
                console.log('onSubmitte values:', values)
                await createJournal(values)
            }
            form.reset();
            if(onSuccess) {
                onSuccess();
            }
            toast.success(journal ? "Journal has been updated successfully" : "Journal has been added successfully!");
            router.refresh();
        } catch(e) {
            console.error(e)
            toast.error(journal ? "Failed to update the journal" : "Failed to add the journal")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="entry"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Entry</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Write your thoughts..."
                                className="min-h-[120px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mood</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your mood" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="happy">Happy</SelectItem>
                                    <SelectItem value="sad">Sad</SelectItem>
                                    <SelectItem value="neutral">Neutral</SelectItem>
                                    <SelectItem value="anxious">Anxious</SelectItem>
                                    <SelectItem value="excited">Excited</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <select
                                    multiple
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(
                                            Array.from(e.target.selectedOptions, (option) => option.value)
                                        )
                                    }
                                    className="w-full border rounded-md p-2 h-32"
                                >
                                    {tags?.map((tag) => (
                                        <option key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} type="submit" className="float-right">
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : `${journal ? "Update" : "Add"} Journal`}
                </Button>
            </form>
        </Form>
    )
}

export default JournalForm;