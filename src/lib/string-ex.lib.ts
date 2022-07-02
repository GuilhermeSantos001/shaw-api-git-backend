import { deflate, inflate } from 'pako';

import { createHash } from 'crypto';

export class StringEx {
  /**
   * @description Compresses a {string | Uint8Array | Buffer} to base64
   */
  static Compress(data: string | Uint8Array | Buffer) {
    const base64 = Buffer.from(deflate(data)).toString('base64');

    return base64;
  }

  /**
   * @description Decompresses a string from base64 to {Type | string | Uint8Array | Buffer}
   */
  static Decompress<Type>(
    encoded: string,
  ): Type | string | Uint8Array | Buffer {
    const base64 = JSON.parse(
      inflate(new Uint8Array(Buffer.from(encoded, 'base64')), {
        to: 'string',
      }),
    );

    return base64;
  }

  /**
   * @description Return hash from string
   */
  static Hash(
    txt: string,
    algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512',
    digest: 'base64' | 'base64url' | 'hex',
  ): string {
    const hash = createHash(algorithm);

    hash.update(txt);

    return hash.digest(digest);
  }
}
