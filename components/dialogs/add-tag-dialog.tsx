"use client";

import { useState } from "react";
import JournalForm from "../forms/journal-form";
import { Button } from "../ui/button";
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Form } from "../ui/form";
import TagForm from "../forms/tag-form";

const AddTagDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogTrigger asChild>
            <Button className="w-2/6 ml-auto">Add New Tag</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                Add a new tag to the database
              </DialogDescription>
              <TagForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
    )
}

export default AddTagDialog;