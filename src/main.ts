import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './modules/user/user.service';
import { seedAdmin } from './seeder/admin.seeder';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation with transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Strip unknown properties
      forbidNonWhitelisted: true,    // Throw error for extra properties
      transform: true,               // Convert JSON to DTO instances
    }),
  );

  // Get the UserService from the app context
  const userService = app.get(UserService);

  // Run the admin seeder
  await seedAdmin(userService);

  // This makes all routes start with /api/v1
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
