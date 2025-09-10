import { TagProp } from './TagProp';

export interface ImageMetadata {
    url: string;
    fileName: string;
    uploadedAt: string;
    size: number;
    mimeType: string;
    order: number;
}

export default interface JournalEntryProp {
    _id: string;
    title: string;
    content: string;
    user: string;
    ownerName: string | null;
    createdAt: string;
    updatedAt: string;
    tags: TagProp[];
    images?: ImageMetadata[];
  }
  