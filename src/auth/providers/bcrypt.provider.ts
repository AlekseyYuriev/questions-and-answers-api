import * as bcrypt from 'bcrypt';

import { Injectable, RequestTimeoutException } from '@nestjs/common';

import { HashingProvider } from './hashing.provider';

/**
 * The `BcryptProvider` is responsible for handling password hashing and comparison
 * using the bcrypt library.
 */
@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * Hashes the provided data (string or buffer) using bcrypt and returns the hashed string.
   * @param data - The data to be hashed.
   * @returns A promise that resolves to the hashed string.
   * @throws RequestTimeoutException If hashing the password fails.
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(data, salt);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Failed to hash password',
      });
    }
  }

  /**
   * Compares the provided data (string or buffer) with the encrypted (hashed) string using bcrypt.
   * @param data - The plain text data to compare.
   * @param encrypted - The hashed string to compare against.
   * @returns A promise that resolves to a boolean indicating whether the data matches the encrypted string.
   * @throws RequestTimeoutException If comparing the passwords fails.
   */
  public async comparePassword(
    data: string | Buffer,
    encrypred: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(data, encrypred);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }
  }
}
