import  {Document} from 'mongoose';

export interface Cases extends Document {
    cases: number,
    deaths: number,
    date: Date,
    countryGeoId: string
}
