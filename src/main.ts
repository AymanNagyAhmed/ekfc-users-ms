import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './common/guards/roles.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  // Validate database URL before starting the application
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
