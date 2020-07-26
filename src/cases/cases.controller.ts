import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
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

}