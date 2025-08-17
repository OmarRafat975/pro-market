export type RegisterDataType = {
  name: string;
  email: string;
  password: string;
};
export type LoginDataType = {
  email: string;
  password: string;
};
export type ApiError = {
  message: string; // always a string
  status?: number;
  fieldErrors?: Record<string, string>; // e.g. { email: "Already taken" }
  raw?: unknown; // optional raw server payload
};
