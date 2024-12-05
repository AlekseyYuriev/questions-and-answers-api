import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(data: string | Buffer): Promise<string>;

  abstract comparePassword(
    data: string | Buffer,
    encrypred: string
  ): Promise<boolean>;
}
