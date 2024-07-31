import { User } from '@prisma/client';

export type Key = keyof User;

export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export type BatchPayload = {
  count: number
}
