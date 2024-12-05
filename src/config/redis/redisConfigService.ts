import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createRedisModuleOptions(): RedisModuleOptions {
    return { type: 'single', url: this.configService.get('CACHE_URL') };
  }
}
