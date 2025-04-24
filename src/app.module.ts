import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './infraestructure/config/configuration';
import { LoggingMiddleware } from './infraestructure/logger/logging.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infraestructure/config/type-orm-config';
import { OrganizationModule } from './presentation/organization/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      useFactory: async () => typeOrmConfig,
      inject: [ConfigService],
    }),
    OrganizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
