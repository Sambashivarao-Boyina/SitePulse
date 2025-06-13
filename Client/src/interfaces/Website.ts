export interface WebsiteInterface {
  _id: string;
  name: string;
  url: string;
  logo: string;
  enableAlerts: string;
  user: string;
  status: "Active" | "Deactive";
}
