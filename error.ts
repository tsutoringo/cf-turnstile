import { TurnstileAPIErrorCode } from './types.ts';

export class TurnstileError extends Error {
  constructor(codes: TurnstileAPIErrorCode[]) {
    super("Cloudflare Turnstile returned error codes: '" + codes.join("', '") + "'");
  }
}
