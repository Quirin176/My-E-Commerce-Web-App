import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true  // Every module can access environment variables
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // Database connection configuration using environment variables (.env file)
        type: 'mssql',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        options: {
          encrypt: false,
          trustServerCertificate: true,
          instanceName: config.get('DB_INSTANCE'),
        },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Turn off in production
      }),
    }),

    AuthModule,
    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
