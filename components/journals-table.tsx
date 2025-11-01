import { getJournals } from "@/server/journal";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";

import JournalDeleteButton from "./journal-delete-button";
import JournalUpdateButton from "./journal-update.button";
import { getTags } from "@/server/tag";

const JournalTable = async() => {
    const journals = await getJournals();
    console.log('journals:', journals)
    const tags = await getTags();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Mood</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {journals.map((journal) => (<TableRow key={journal.id}>
                    <TableCell>{journal.createdAt?.toLocaleString()}</TableCell>
                    <TableCell>{journal.title}</TableCell>
                    <TableCell>{journal.entry}</TableCell>
                    <TableCell>{journal.mood}</TableCell>
                    {/* todo: make isfavorite a button (with start icon) */}
                    <TableCell className="border-l-1 border-r-1">
                        <div className="flex gap-1">
                            <JournalUpdateButton journal={journal} tags={tags} />
                            <JournalDeleteButton journalId={journal.id} />
                        </div>
                    </TableCell>
                </TableRow>))}
            </TableBody>
        </Table>
    )
}

export default JournalTable;
