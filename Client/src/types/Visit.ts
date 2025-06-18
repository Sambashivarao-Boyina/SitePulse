import type { Location } from "./Location";

export type Visit = {
  _id: string;
  website: string;
  visitedTime: string;
  closeTime: string;
  deviceType: "Desktop" | "Mobile" | "Tablet";
  location: Location;
  routes: string[];
  isActive: boolean;
};
