import * as bcrypt from 'bcrypt';

import { Injectable, RequestTimeoutException } from '@nestjs/common';

import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
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
