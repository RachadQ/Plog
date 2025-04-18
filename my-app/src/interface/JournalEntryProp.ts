import { TagProp } from './TagProp';


export default interface JournalEntryProp {
    _id: string;
    title: string;
    content: string;
    user: string;
    ownerName: string | null;
    createdAt: string;
    updatedAt: string;
    tags: TagProp[];


  }
  