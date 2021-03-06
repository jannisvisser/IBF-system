import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { UserRole } from '../user-role.enum';
import { CountryEntity } from '../../country/country.entity';
import { ManyToMany } from 'typeorm';
import { UserStatus } from '../user-status.enum';
import { UserEntity } from '../user.entity';

export class UpdateUserDto {
  @ApiModelProperty({ example: 'Henry' })
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public middleName: string;

  @ApiModelProperty({ example: 'Dunant' })
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @ApiModelProperty({
    example: UserRole.DisasterManager,
    default: UserRole.Guest,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  public role: UserRole;

  @ApiModelProperty({
    example: UserRole.DisasterManager,
    default: UserRole.Guest,
    type: [CountryEntity],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ManyToMany(
    (): typeof CountryEntity => CountryEntity,
    (country): UserEntity[] => country.users,
  )
  public countries: CountryEntity[];

  @ApiModelProperty({
    example: UserStatus.Active,
    default: UserStatus.Inactive,
  })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  public status: UserStatus;

  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(4)
  public password: string;
}
