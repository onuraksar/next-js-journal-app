
"use client";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Check, Loader2, Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { deleteTag, updateTag } from "@/server/tag";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface TagItemProps {
    id: string,
    name: string
}

const TagItem = ({id, name} : TagItemProps) => {
    const router = useRouter();
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

    const [value, setValue] = useState<string>(name)

    const handleUpdate = async() => {
        setIsUpdateLoading(true)
        try {
            await updateTag({id, name: value})
            toast.success("Tag updated successfully!")
            router.refresh();
        } catch (err) {
            console.error(err)
            toast.error("An error ocured! Could not update the tag.")
        } finally {
            setIsUpdateLoading(false)
            setIsEdit(false)
        }
    }

    const handleDelete = async() => {
        setIsDeleteLoading(true)
        try {
            await deleteTag(id)
            toast.success("Tag deleted successfully!")
            setIsDeleteDialogOpen(false)
            router.refresh()
        } catch(err) {
            console.error(err)
            toast.error("An error ocured! Could not delete the tag.")
        } finally {
            setIsDeleteLoading(false)
        }
    }

    return (
        <div className="flex justify-between items-center p-1 border-b-1">
            <div>
                {isEdit ?
                    <Input
                        name={id}
                        id={id}
                        value={value}
                        onChange={(e) => setValue(e.target.value)} 
                        onBlur={(e) => {
                            setIsEdit(false)
                            setValue(name)
                        }}
                        autoFocus={isEdit}
                    /> : 
                    value
                }
            </div>
            <div className="flex gap-1">
                {isEdit ?  
                    <Button 
                        disabled={isUpdateLoading || isDeleteLoading} 
                        type="button" 
                        variant="ghost" 
                        onMouseDown={(e) => {
                            e.preventDefault();
                            if(value === name) {
                                setTimeout(( ) => {
                                    setIsEdit(false)
                                }, 200)
                                return
                            } 
                            handleUpdate()
                        }}
                    >
                        {isUpdateLoading ? <Loader2 className="animate-spin" /> : <Check /> } 
                    </Button>
                : 
                    <Button variant="ghost" type="button" onClick={() => {
                        setIsEdit(true)
                    }}>
                        <Pencil />
                    </Button>
                }

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} >
                    <DialogTrigger asChild>
                        <Button disabled={isUpdateLoading} variant="ghost" onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash color="red" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-sm">
                        <DialogHeader>
                            <div className="mb-4">Are you sure you want to delete this tag?</div>
                            <div className="flex justify-end gap-4">
                                <Button disabled={isDeleteLoading} onClick={handleDelete}>
                                    Yes {isDeleteLoading && <Loader2 className="animate-spin" /> }
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>



            </div>
        </div>
    )
}

export default TagItem;