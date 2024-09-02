/**
 * @module
 * 
 * @tsutoringo/cf-turnstile is [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) API Wrapper
 * 
 * ## Example
 * 
 * ```ts
 * const tunrstileSecretKey = "1x0000000000000000000000000000000AA";
 * const response = await new CfTurnstile(tunrstileSecretKey)
 *     .validate(body['cf-turnstile-response'], ip);
 * 
 * 
 * ```
 */

export * from './validate.ts';
export * from './error.ts';
export * from './types.ts';
