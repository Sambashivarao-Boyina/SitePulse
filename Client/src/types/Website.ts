import type { Status } from "./Status";

export type Website = {
  _id: string;
  name: string;
  url: string;
  logo: string;
  user: string;
  status: "Enable" | "Disable";
  lastWebsiteStatus: Status | null
}
