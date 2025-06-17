export type StatusInterface = {
  _id: string;
  website: string;
  websiteStatus: "up" | "down";
  statusCode: number;
  responseTime: number;
  createdAt: string
}