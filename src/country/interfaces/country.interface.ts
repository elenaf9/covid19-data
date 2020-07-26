import  {Document} from 'mongoose';

export interface Country extends Document {
    geoId: string,
    name: string,
    countryterritoryCode: string,
    continentExp: string,
}
