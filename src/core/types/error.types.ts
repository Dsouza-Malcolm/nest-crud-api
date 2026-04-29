export interface ErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string | string[];
  path: string;
  timestamp: string;
}
