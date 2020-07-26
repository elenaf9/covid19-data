import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CasesModule } from './cases/cases.module';
import { CountryModule } from './country/country.module';
import { PopulationModule } from './population/population.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/covid19-data-backend', { useNewUrlParser: true }),
    CasesModule,
    CountryModule,
    PopulationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
