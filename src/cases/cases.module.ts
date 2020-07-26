import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CasesSchema } from './schemas/cases.schema';
import { CountryModule } from 'src/country/country.module';
import { PopulationModule } from 'src/population/population.module';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Cases', schema: CasesSchema}]), CountryModule, PopulationModule],
    providers: [CasesService],
    controllers: [CasesController]
})
export class CasesModule {}
