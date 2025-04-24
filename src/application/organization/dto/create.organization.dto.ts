import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { RutValidator } from 'src/infraestructure/custom-validators/rut-validator';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede tener más de 150 caracteres' })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  @Validate(RutValidator)
  rut: string;
}
