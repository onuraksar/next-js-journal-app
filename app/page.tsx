
import JournalDialog from "@/components/dialogs/journal-dialog";
import TagDialog from "@/components/dialogs/tag-dialog";
import JournalTable from "@/components/journals-table";
import { getTags } from "@/server/tag";
export const revalidate = 0;

export default async function Home() {
  const tags = await getTags();
  return (
    <div className="flex flex-col w-full p-4 mx-auto md:p-16 gap-4">
      <h1 className="text-2xl font-bold">Journals</h1>
      <div className="flex justify-end gap-2">
        <TagDialog />
        <JournalDialog tags={tags}/>
      </div>
      <JournalTable />
    </div>
  );
}