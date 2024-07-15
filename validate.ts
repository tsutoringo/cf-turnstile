import { TurnstileError } from './error.ts';
import { TunstileAPIResponse } from './types.ts';

/**
 * 
 * [./CfTurnstile.validate](CfTurnstile.prototype.validate) Or [./CfTurnstile.withFormRequest](CfTurnstile.prototype.validate)
 */
export class CfTurnstile {
  static ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  static withAlwaysPassesToken (): CfTurnstile {
    return new CfTurnstile('1x0000000000000000000000000000000AA');
  }

  static withAlwaysFailsToken (): CfTurnstile {
    return new CfTurnstile('2x0000000000000000000000000000000AA');
  }

  static withAlreadySpentErrorToken (): CfTurnstile {
    return new CfTurnstile('3x0000000000000000000000000000000AA');
  }

  /**
   * @param secretKey Secret key provided by cloudflare dashboard
   */
  constructor (
    public secretKey: string
  ) {

  }

  /**
   * 
   * @example
   * <caption>Shorthand but throws error when field is invalid</caption>
   * 
   * ```ts
   * // This is the demo secret key. In production, we recommend
   * // you store your secret key(s) safely.
   * const SECRET_KEY = '1x0000000000000000000000000000000AA';
   * 
   * async function handlePost(request) {
   *   const body = await request.formData();
   * 
   *   const response = new CfTurnstile(SECRET_KEY).validate(request):
   * 
   *   if (response.success) {
   *   	// Your code...
   *   }
   * }
   * ```
   * 
   * @param request 
   * @param idempotencyKey 
   * @returns 
	 */
  async withFormRequest (request: Request, idempotencyKey?: string): Promise<{form: FormData, response: TunstileAPIResponse}> {
    const body = await request.formData();

    const token = body.get('cf-turnstile-response');

    if (!token || !(typeof token === 'string')) throw new TurnstileError('cf-turnstile-response field of body is invalid.');

    const ip = request.headers.get('CF-Connecting-IP');

    if (!ip) throw new TurnstileError('CF-Connecting-IP header is invalid.');

    return {
      form: body,
      response: await this.validate(token, ip, idempotencyKey)
    };
  }

  /**
   * @example
   * <caption>Basic usage</caption>
   * 
   * ```ts
   * // This is the demo secret key. In production, we recommend
   * // you store your secret key(s) safely.
   * const SECRET_KEY = '1x0000000000000000000000000000000AA';
   * 
   * async function handlePost(request) {
   *   const body = await request.formData();
   *   // Turnstile injects a token in "cf-turnstile-response".
   *   const token = body.get('cf-turnstile-response');
   *   const ip = request.headers.get('CF-Connecting-IP');
   * 
   *   const response = new CfTurnstile(SECRET_KEY).validate(token, ip):
   * 
   *   if (response.success) {
   *   	// Your code...
   *   }
   * }
   * ```
   * @param token 
   * @param ip 
   * @param idempotencyKey 
   * @returns 
   */
  validate (token: string, ip: string, idempotencyKey?: string): Promise<TunstileAPIResponse> {
    const formData = new FormData();

    formData.append('secret', this.secretKey);
    formData.append('response', token);
    formData.append('remoteip', ip);

    if (idempotencyKey) formData.append('idempotency_key', idempotencyKey);

    const request = new Request(CfTurnstile.ENDPOINT, {
      body: formData,
      method: 'POST'
    });

    return this.req(request);
  }

  async req (request: Request): Promise<TunstileAPIResponse> {
    const response = await fetch(request);

    const result = await response.json() as TunstileAPIResponse;

    return result;
  }
}
