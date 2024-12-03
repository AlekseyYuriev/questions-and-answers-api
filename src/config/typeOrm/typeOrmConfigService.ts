import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      port: +this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      host: this.configService.get('DATABASE_HOST'),
      database: this.configService.get('DATABASE_NAME'),
    };
  }
}
