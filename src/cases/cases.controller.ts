import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCasesDTO } from './dto/create-cases.dto';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post('/init')
  async initCovid19Data(@Res() res, @Body() createCasesDTOs: CreateCasesDTO[]) {
    const cases = await this.casesService.initCases(createCasesDTOs);
    return res.status(HttpStatus.OK).json(cases);
  }

  @Get('/byCountry/:geoId')
  async getCasesByCountry(@Res() res, @Param('geoId') geoId: string) {
    const data = await this.casesService.getCasesForCountry(geoId);
    return res.status(HttpStatus.OK).json(data);
  }

  @Get('/byContinent/:continent')
  async getCasesByContinent(@Res() res, @Param('continent') continent: string) {
    const data = await this.casesService.getCasesByContinent(continent);
    return res.status(HttpStatus.OK).json(data);
  }

  @Get('/world/:date')
  async getViewTableByDate(@Res() res, @Param('date') date: Date) {
    const data = await this.casesService.viewTableByDate(date);
    return res.status(HttpStatus.OK).json(data);
  }
}
