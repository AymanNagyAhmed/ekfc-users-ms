import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { TransformResponseInterceptor } from '@/common/interceptors/transform-response.interceptor';
import { API } from '@/common/constants/api.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix(API.PREFIX);

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global response transformer
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const configService = app.get(ConfigService);
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));
  
  const port = configService.get<number>('PORT', 4003);
  
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
