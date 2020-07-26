import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CountrySchema } from './schemas/country.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Country', schema: CountrySchema}])],
    providers: [CountryService],
    controllers: [CountryController],
    exports: [CountryService]
})
export class CountryModule {}
