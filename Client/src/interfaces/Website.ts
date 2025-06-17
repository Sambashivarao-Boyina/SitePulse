import type { StatusInterface } from "./Status";

export interface WebsiteInterface {
  _id: string;
  name: string;
  url: string;
  logo: string;
  enableAlerts: boolean;
  user: string;
  status: "Enable" | "Disable";
  lastWebsiteStatus: StatusInterface | null
}
