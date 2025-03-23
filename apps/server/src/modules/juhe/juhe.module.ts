import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SolarTerm } from './entities/solar-term.entity'
import { JuheApiService } from './services/juhe-api.service'
import { SolarTermsService } from './services/solar-terms.service'
import { SolarTermsController } from './controllers/solar-terms.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SolarTerm])],
  controllers: [SolarTermsController],
  providers: [JuheApiService, SolarTermsService],
  exports: [SolarTermsService],
})
export class JuheModule {}
