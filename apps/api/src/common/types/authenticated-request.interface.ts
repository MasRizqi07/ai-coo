export interface JwtUserPayload {
  sub: string;
  companyId: string;
  role: string;
}

export interface AuthenticatedRequest {
  user: JwtUserPayload;
}
