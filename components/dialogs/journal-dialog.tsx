"use client";

import { useState } from "react";
import JournalForm from "../forms/journal-form";
import { Button } from "../ui/button";
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Tag } from "@/db/schema";

interface JournalDialogProps {
  tags?: Array<Tag> 
}
const JournalDialog = ({tags} : JournalDialogProps) => {
    const [isDialogOpen, setIsDialogOpen]= useState<boolean>(false)
    // todo: add no data view
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogTrigger asChild>
            <Button className="w-1/6">Add Journal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Journal</DialogTitle>
              <DialogDescription>
                Add a new journal to the database
              </DialogDescription>
              <JournalForm tags={tags} onSuccess={() => setIsDialogOpen(false)} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
    )
}

export default JournalDialog;