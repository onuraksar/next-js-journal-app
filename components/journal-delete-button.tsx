"use client";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { deleteJournal } from "@/server/journal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface JournalDeleteButtonProps {
    journalId: string
}

const JournalDeleteButton = ({journalId} : JournalDeleteButtonProps) => {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter();

    const handleJournalDelete = async() => {
        setIsLoading(true)
        try {
            await deleteJournal(journalId);
            toast.success("Journal is deleted successfully");
            router.refresh();
            setIsDialogOpen(false)
        } catch(e) {
            console.error(e)
            toast.error("Journal could not be deleted");
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Trash color="red" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Journal</DialogTitle>
                        <div className="mb-4">Are you sure you want to delete this journal?</div>
                        <div className="flex justify-end gap-4">
                            <Button disabled={isLoading} variant="default" size="sm" onClick={() => handleJournalDelete()}>
                               {isLoading ? <Loader2 className="animate-spin" /> : "Yes"}
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default JournalDeleteButton;