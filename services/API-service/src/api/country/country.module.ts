import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { CountryController } from './country.controller';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';

@Module({
  imports: [HttpModule, UserModule, TypeOrmModule.forFeature([CountryEntity])],
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
})
export class CountryModule {}
