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
import { ViewTableDTO } from './dto/view-table.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectModel('Cases') private readonly casesModel: Model<Cases>,
    private countryService: CountryService,
    private populationService: PopulationService,
  ) {}

  async initCases(data: CreateCasesDTO[]): Promise<Cases[]> {
    const newData: Cases[] = [];
    for (const entry of data) {
      const country: Country = await this.countryService.createOrFindCountry(
        entry,
      );
      if (entry.popData2019) {
        const populationData: Population = {
          countryGeoId: country.geoId,
          population: entry.popData2019,
          year: '2019',
        };
        await this.populationService.createOrFindPopulationData(populationData);
      }
      const date = new Date();
      date.setUTCFullYear(entry.year, entry.month - 1, entry.day);
      date.setUTCHours(0, 0, 0, 0);
      let newCases = await this.casesModel({
        countryGeoId: country.geoId,
        date,
        ...entry,
      });
      newCases = await newCases.save();
      newData.push(newCases);
    }
    return newData;
  }

  async getCasesForCountry(geoId: string): Promise<ViewCasesDTO> {
    const cases: Cases[] = await this.casesModel
      .find({ countryGeoId: geoId })
      .exec();
    const viewCases: ViewCasesDTO = {
      countryGeoId: geoId,
      cases: [],
      deaths: [],
    };
    cases.forEach(c => {
      if (c.cases) {
        viewCases.cases.push({ x: c.date, y: c.cases });
      }
      if (c.deaths) {
        viewCases.deaths.push({ x: c.date, y: c.deaths });
      }
    });
    return viewCases;
  }

  async viewTableByDate(date: Date): Promise<ViewTableDTO[]> {
    const countries: Country[] = await this.countryService.getAllCountries();
    const casesForDate = [];
    for (const country of countries) {
      const cases: Cases[] = await this.casesModel
        .find({ countryGeoId: country.geoId, date: date })
        .exec();
      if (cases.length) {
        const population: number = await this.populationService.getPopulationDataValue(
          country.geoId,
        );
        const viewTable: ViewTableDTO = {
          cases: cases[0].cases,
          casesPerPop: (cases[0].cases * 1000000) / population,
          deaths: cases[0].deaths,
          deathsPerPop: (cases[0].deaths * 1000000) / population,
          countryName: country.name,
        };
        casesForDate.push(viewTable);
      }
    }
    return casesForDate;
  }

  async getCasesByContinent(continent: string): Promise<ViewCasesDTO[]> {
    const countries: Country[] = await this.countryService.getCountriesForContinent(
      continent,
    );
    const casesForContinent = [];
    for (const country of countries) {
      const cases: Cases[] = await this.casesModel
        .find({ countryGeoId: country.geoId })
        .exec();
      const viewCases: ViewCasesDTO = {
        countryGeoId: country.geoId,
        cases: [],
        deaths: [],
      };
      cases.forEach(c => {
        if (c.cases) {
          viewCases.cases.push({ x: c.date, y: c.cases });
        }
        if (c.deaths) {
          viewCases.deaths.push({ x: c.date, y: c.deaths });
        }
      });
      casesForContinent.push(viewCases);
    }
    return casesForContinent;
  }
}
