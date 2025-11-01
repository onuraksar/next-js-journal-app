import { Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { getTags } from "@/server/tag";
import TagItem from "../tag-item";
import AddTagDialog from "./add-tag-dialog";

const TagDialog = async() => {
    
    const tags = await getTags();
    
    console.log('tags:', tags)

    // todo: add no data view

    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-1/6">View Tags <Tag /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tags</DialogTitle>
              <DialogDescription>
                Configure Tags to categorize your journals!
              </DialogDescription>
              <AddTagDialog />
              <div className="flex flex-col border-t-1 max-h-[225px] overflow-auto">
                {tags.map(tag => <TagItem key={tag.id} id={tag.id} name={tag.name} />)}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    )
}

export default TagDialog;