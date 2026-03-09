import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './users/users.module';

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

        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),

        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        autoLoadEntities: true,
        synchronize: true,

        options: {
          encrypt: false,
          trustServerCertificate: true,
        },

        extra: {
          instanceName: config.get<string>('DB_INSTANCE'),
        },

      }),
    }),
    
    AuthModule,
    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
