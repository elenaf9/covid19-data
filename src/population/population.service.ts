import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Population } from './interfaces/population.interface';

@Injectable()
export class PopulationService {

    constructor(@InjectModel('Population') private readonly populationModel: Model<Population>) { }

    async createOrFindPopulationData(population: Population): Promise<Population> {
        const existingPopulationData: Population[] = await this.populationModel.find({countryGeoId: population.countryGeoId, year: population.year}).exec();
        if (existingPopulationData.length > 0) {
            let updatePopulation = existingPopulationData[0];
            if (updatePopulation.population !== population.population) {
                console.log("Populations Data for same year and country differs, updating existing Data.");
                updatePopulation = await this.populationModel.findOneAndUpdate(
                    {countryGeoId: updatePopulation.countryGeoId}, 
                    {population: updatePopulation.population}
                );
                }
            return updatePopulation;
        }
        const newPopulation = await this.populationModel(population);
        return newPopulation.save();
    }
}
