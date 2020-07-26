import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get('')
  async getCasesByCountry(@Res() res) {
    const countries = await this.countryService.getAllCountries();
    return res.status(HttpStatus.OK).json(countries);
  }
}
