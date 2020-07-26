import  {Schema} from 'mongoose';

export const PopulationSchema: Schema = new Schema({
    population: {type: Number, required: true},
    year: {type: String, required: true},
    countryGeoId: {type: String, ref: 'Country', required: true}
}, {timestamps: true});