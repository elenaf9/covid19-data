import  {Document} from 'mongoose';

export interface Population extends Document {
    population: number,
    year: string,
    countryGeoId: string
}
