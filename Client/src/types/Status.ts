export type Status = {
  _id: string;
  website: string;
  websiteStatus: "up" | "down";
  statusCode: number;
  responseTime: number;
  createdAt: string,
  errorMessage: string | null
}