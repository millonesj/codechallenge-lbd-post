import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/infraestructure/common/base.pagination.dto';

export class OrganizationPaginationDto extends BasePaginationDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
  })
  @IsBoolean()
  isActive?: boolean;
}
