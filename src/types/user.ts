export interface User {
  id: string;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt?: Date;
}
