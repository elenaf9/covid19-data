import  {Schema} from 'mongoose';

export const CountrySchema: Schema = new Schema({
    geoId: {type: String, required: true},
    name: {type: String, required: true},
    continentExp: String,
    countryterritoryCode: String,
}, {timestamps: true});