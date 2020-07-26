export class CreateCasesDTO {
    readonly dateRep: string;
    readonly day: number;
    readonly month: number;
    readonly year: number;
    readonly cases: number;
    readonly deaths: number;
    readonly countriesAndTerritories: string;
    readonly geoId: string;
    readonly countryterritoryCode: string;
    readonly popData2018: number;
    readonly continentExp: string;
}