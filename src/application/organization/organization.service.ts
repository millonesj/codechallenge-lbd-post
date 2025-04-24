import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infraestructure/common/base.service';
import { errorCodes } from 'src/infraestructure/config/error-messages';
import { CustomException } from 'src/infraestructure/exceptions/custom-exception';
import { Repository } from 'typeorm/repository/Repository';
import { CreateOrganizationDto } from './dto/create.organization.dto';
import { CreatedOrganizationDto } from './dto/created.organization.dto';
import { OrganizationPaginationDto } from './dto/find-all-organization/organization.pagination.dto';
import { FindOneOrganizationDto } from './dto/find-one.organization.dto';
import { UpdateOrganizationDto } from './dto/update.organization.dto';
import { Organization } from 'src/domain/organization.entity';
import { OrderByEnum } from 'src/infraestructure/common/base.pagination.dto';

@Injectable()
export class OrganizationService extends BaseService<Organization> {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {
    super(organizationRepository);
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<CreatedOrganizationDto> {
    const createdRecord = this.organizationRepository.create(
      createOrganizationDto,
    );
    const { id } = await this.organizationRepository.save(createdRecord);
    this.logger.log(`${this.getNamespace()}.create`, {
      id,
    });
    return { id };
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<CreatedOrganizationDto> {
    this.logger.log(`${this.getNamespace()}.update`, {
      id,
    });

    const existingOrganization = await this.findOne({ id });

    existingOrganization.name = updateOrganizationDto.name;
    existingOrganization.isActive = updateOrganizationDto.isActive;

    const updatedOrganization = await this.organizationRepository.save(
      existingOrganization,
    );
    this.logger.log(`${this.getNamespace()}.update`, {
      updated: updatedOrganization,
    });
    return updatedOrganization;
  }

  async findOne(findOneOrganizationDto: FindOneOrganizationDto) {
    this.logger.log(`${this.getNamespace()}.findOne`, {
      id: findOneOrganizationDto.id,
    });

    const existingOrganization = await this.organizationRepository.findOne({
      where: findOneOrganizationDto,
    });

    if (!existingOrganization) {
      throw new CustomException(
        errorCodes.ORGANIZATION_NOT_FOUND.message,
        404,
        errorCodes.ORGANIZATION_NOT_FOUND.code,
      );
    }

    this.logger.log(`${this.getNamespace()}.findOne`, {
      found: existingOrganization,
    });
    return existingOrganization;
  }

  async findAll({ page, limit, isActive }: OrganizationPaginationDto) {
    this.logger.log(`${this.getNamespace()}.findAll`, {
      start: true,
    });

    const queryBuilder =
      this.organizationRepository.createQueryBuilder('organization');

    if (isActive != undefined) {
      queryBuilder.andWhere('organization.isActive = :isActive', { isActive });
    }

    const [items, count] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('organization.createdAt', OrderByEnum.DESC)
      .getManyAndCount();

    this.logger.log(`${this.getNamespace()}.findAll`, {
      found: { count },
    });
    return {
      items,
      count,
    };
  }
}
