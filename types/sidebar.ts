export interface SidebarItem {
    id: number;
    icon: string;
    title: string;
    active: boolean;
    alert: boolean;
    to: string; // Required property
    count?: number; // Optional property
  }