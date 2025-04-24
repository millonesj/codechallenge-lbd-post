import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from 'src/application/organization/organization.service';

import { OrganizationController } from './organization.controller';
import { Organization } from 'src/domain/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationController],
  providers: [Logger, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
