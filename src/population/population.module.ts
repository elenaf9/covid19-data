import { Module } from '@nestjs/common';
import { PopulationService } from './population.service';
import { PopulationController } from './population.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PopulationSchema } from './schemas/population.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Population', schema: PopulationSchema}])],
    providers: [PopulationService],
    controllers: [PopulationController],
    exports: [PopulationService]
})
export class PopulationModule {}
