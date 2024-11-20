import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const configService = app.get(ConfigService)
  const PORT = configService.get('API_PORT') || 3000
  const ENV = configService.get('API_ENV') || 'development'

  await app.listen(PORT, () => {
    console.log(`Server started in MODE: ${ENV} on Port: ${PORT}`)
  })
}
bootstrap()
