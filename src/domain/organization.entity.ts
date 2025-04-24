import { BaseEntity } from 'src/infraestructure/common/base.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity({
  name: 'organization',
})
@Unique(['id'])
export class Organization extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  rut: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
