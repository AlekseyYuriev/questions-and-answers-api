import { Injectable } from '@nestjs/common';

/**
 * Abstract class for handling password hashing and comparison.
 * This provider is responsible for defining the methods to hash passwords
 * and compare hashed passwords with plain text data.
 */
@Injectable()
export abstract class HashingProvider {
  /**
   * Hashes the provided data (string or buffer) and returns the hashed string.
   * @param data - The data to be hashed.
   * @returns A promise that resolves to the hashed string.
   */
  abstract hashPassword(data: string | Buffer): Promise<string>;

  /**
   * Compares the provided data (string or buffer) with the encrypted (hashed) string.
   * @param data - The plain text data to compare.
   * @param encrypted - The hashed string to compare against.
   * @returns A promise that resolves to a boolean indicating whether the data matches the encrypted string.
   */
  abstract comparePassword(
    data: string | Buffer,
    encrypred: string
  ): Promise<boolean>;
}
