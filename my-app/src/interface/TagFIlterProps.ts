
import JournalEntryProp from "./JournalEntryProp";

export default interface TagsFilterProps {
    //entries: JournalEntryProp[];
    //onFilterChange: (filteredEntries: JournalEntryProp[]) => void;
    //ProfileUser: string | null;
    selectedTag: string;
  setSelectedTag: (tag: string) => void;
  allTags: string[];
  };
  