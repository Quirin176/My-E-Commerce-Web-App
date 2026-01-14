export interface ErrorType {
  name?: string;
  message?: string;
}

export interface ApiError extends ErrorType {
  status?: number;
  code?: string;
}

export interface ValidationError extends ErrorType {
  field?: string;
  value?: unknown;
}
