import { ChecklistItem } from './checklist-item';

export interface Checklist {
  id: string;
  title: string;
  ionicon: string;
  items: ChecklistItem[];
}
