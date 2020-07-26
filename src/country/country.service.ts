import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Country } from './interfaces/country.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCountryDTO } from './dto/create-country.dto';

@Injectable()
export class CountryService {
    constructor(@InjectModel('Country') private readonly countryModel: Model<Country>) { }

    async createOrFindCountry(country: CreateCountryDTO): Promise<Country> {
        const existingCountries = await this.countryModel.find({geoId: country.geoId, countryterritoryCode: country.countryterritoryCode}).exec();
        if (existingCountries.length > 0) {
            return existingCountries[0];
        } else {
            const newCountry = await this.countryModel({name: country.countriesAndTerritories, ...country});
            return newCountry.save();
        }
    }

    async getCountriesForContinent(continent: string): Promise<Country[]> {
        return await this.countryModel.find({continentExp: continent}).exec();
    }

    async getAllCountries(): Promise<Country[]> {
        return await this.countryModel.find({});
    }
}
