import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Response,
} from '@nestjs/common';
import { CreateOrganizationDto } from 'src/application/organization/dto/create.organization.dto';
import { OrganizationPaginationDto } from 'src/application/organization/dto/find-all-organization/organization.pagination.dto';
import { FindOneOrganizationDto } from 'src/application/organization/dto/find-one.organization.dto';
import { UpdateOrganizationDto } from 'src/application/organization/dto/update.organization.dto';
import { OrganizationService } from 'src/application/organization/organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(
    @Body()
    createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Get(':id')
  async findOne(
    @Param()
    findOneOrganizationDto: FindOneOrganizationDto,
    @Response() res,
  ) {
    const organization = await this.organizationService.findOne(
      findOneOrganizationDto,
    );

    if (!organization) {
      return res.status(204).send();
    }

    return res.status(200).send(organization);
  }

  @Get()
  async findAll(
    @Query()
    organizationPaginationDto: OrganizationPaginationDto,
    @Response() res,
  ) {
    const organizations = await this.organizationService.findAll(
      organizationPaginationDto,
    );

    return res.status(200).send(organizations);
  }
}
