import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cases } from './interfaces/cases.interface';
import { CreateCasesDTO } from './dto/create-cases.dto';
import { CountryService } from 'src/country/country.service';
import { PopulationService } from 'src/population/population.service';
import { Country } from 'src/country/interfaces/country.interface';
import { Population } from 'src/population/interfaces/population.interface';
import { ViewCasesDTO } from './dto/view-cases.dto';

@Injectable()
export class CasesService {
    constructor(
        @InjectModel('Cases') private readonly casesModel: Model<Cases>,
        private countryService: CountryService,
        private populationService: PopulationService
        ) { }

    async initCases(data: CreateCasesDTO[]): Promise<Cases[]> {
        const newData: Cases[] = [];
        for (const entry of data) {
            const country: Country = await this.countryService.createOrFindCountry(entry);
            if (entry.popData2018) {
                const populationData: Population = {
                    countryGeoId: country.geoId,
                    population: entry.popData2018,
                    year: "2018"
                };
                await this.populationService.createOrFindPopulationData(populationData);
            }
            const date = new Date();
            date.setFullYear(entry.year, entry.month - 1, entry.day);
            date.setHours(0, 0, 0, 0);
            let newCases = await this.casesModel({
                countryGeoId:
                country.geoId,
                date,
                cases: entry.cases? entry.cases : 0,
                deaths: entry.deaths? entry.deaths : 0
            });
            newCases = await newCases.save();
            newData.push(newCases);
        }
        return newData;
    }

    async getCasesForCountry(geoId: string): Promise<ViewCasesDTO> {
        const cases: Cases[] = await this.casesModel.find({countryGeoId: geoId}).exec();
        const viewCases: ViewCasesDTO = {countryGeoId: geoId, cases: [], deaths: []};
        cases.forEach(c => {
            if (c.cases !== null) {
                viewCases.cases.push({x: c.date, y: c.cases});
            }
            if (c.deaths !== null) {
                viewCases.deaths.push({x: c.date, y: c.deaths})
            }
        });
        return viewCases;
    }

    async getCasesByContinent(continent: string): Promise<ViewCasesDTO[]> {
        const countries: Country[] = await this.countryService.getCountriesForContinent(continent);
        const casesForContinent = [];
        for (const country of countries) {
            const cases: Cases[] = await this.casesModel.find({countryGeoId: country.geoId}).exec();
            const viewCases: ViewCasesDTO = {countryGeoId: country.geoId, cases: [], deaths: []};
            cases.forEach(c => {
                if (c.cases) {
                    viewCases.cases.push({x: c.date, y: c.cases});
                }
                if (c.deaths) {
                    viewCases.deaths.push({x: c.date, y: c.deaths})
                }
            });
            casesForContinent.push(viewCases);
        }
        return casesForContinent;
    }
}
