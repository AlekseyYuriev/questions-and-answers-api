import * as bcrypt from 'bcrypt';

import { Injectable, RequestTimeoutException } from '@nestjs/common';

import { HashingProvider } from './hashing.provider';

import { SALT_ROUNDS } from '../auth/constants/auth.constants';

/**
 * Provides password hashing and comparison functionality using the bcrypt library.
 * Implements the `HashingProvider` interface to ensure consistent hashing operations.
 * @class
 * @implements {HashingProvider}
 */
@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * Hashes the provided data using bcrypt with a configurable number of salt rounds.
   *
   * @param {string | Buffer} data - The data (e.g., a password) to be hashed.
   * @returns {Promise<string>} A promise resolving to the hashed string.
   * @throws {RequestTimeoutException} If the hashing operation fails due to a timeout or internal error.
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      return await bcrypt.hash(data, salt);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Failed to hash password',
      });
    }
  }

  /**
   * Compares plain text data with a hashed string using bcrypt to verify equality.
   *
   * @param {string | Buffer} data - The plain text data (e.g., a password) to compare.
   * @param {string} encrypted - The previously hashed string to compare against.
   * @returns {Promise<boolean>} A promise resolving to a boolean indicating whether the data matches the hashed string.
   * @throws {RequestTimeoutException} If the comparison operation fails due to a timeout or internal error.
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
