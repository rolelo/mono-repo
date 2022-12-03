export type Context = {
  headers: Record<string, unknown>,
  sub: string,
  name: string,
  email: string,
  phoneNumber?: string,
  organization?: string,
}
