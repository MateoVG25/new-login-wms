export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
  sessionGUID: string;
};