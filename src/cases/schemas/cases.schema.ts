import  {Schema} from 'mongoose';

export const CasesSchema: Schema = new Schema({
    cases: Number,
    deaths: Number,
    date: Date,
    countryGeoId: {type: String, ref: 'Country', required: true}
}, {timestamps: true});