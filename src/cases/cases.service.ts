import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cases } from './interfaces/cases.interface';
import { CreateCasesDTO } from './dto/create-cases.dto';
import { CountryService } from 'src/country/country.service';
import { PopulationService } from 'src/population/population.service';
import { Country } from 'src/country/interfaces/country.interface';
import { Population } from 'src/population/interfaces/population.interface';

@Injectable()
export class CasesService {
    constructor(
        @InjectModel('Cases') private readonly covid19DataModel: Model<Cases>,
        private countryService: CountryService,
        private populationService: PopulationService
        ) { }

    async initCases(data: CreateCasesDTO[]): Promise<Cases[]> {
        const newData: Cases[] = [];
        for (const entry of data) {
            const country: Country = await this.countryService.createOrFindCountry(entry);
            const populationData: Population = {
                countryGeoId: country.geoId,
                population: entry.popData2018,
                year: "2018"
            };
            await this.populationService.createOrFindPopulationData(populationData);
            const date = new Date();
            date.setFullYear(entry.year, entry.month, entry.day);
            let newCases = await this.covid19DataModel({ countryGeoId: country.geoId, date, ...entry });
            newCases = await newCases.save();
            newData.push(newCases);
        }
        return newData;
    }

}
