"use client";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import JournalForm from "./forms/journal-form";
import { Journal, JournalWithTags, Tag } from "@/db/schema";
import { useEffect, useState } from "react";
import { getTags } from "@/server/tag";

interface JournalUpdateButtonProps {
  journal: JournalWithTags;
  tags?: Array<Tag>;
}

const JournalUpdateButton = ({journal, tags} : JournalUpdateButtonProps ) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" >
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Journal</DialogTitle>
                    <JournalForm journal={journal} tags={tags} onSuccess={() => setIsDialogOpen(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default JournalUpdateButton;