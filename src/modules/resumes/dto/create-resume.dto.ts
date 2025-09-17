import { IsObjectId } from '@common/decorators/validate.decorator';
import { IsNotEmpty, IsString, } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
    @IsNotEmpty({ message: 'URL must not be empty!' })
    @IsString({ message: 'URL must be a string!' })
    url: string;

    @IsNotEmpty({ message: 'Company must not be empty!' })
    @IsObjectId({ message: 'Company must be a ObjectId!' })
    company: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Job must not be empty!' })
    @IsObjectId({ message: 'Job must be a ObjectId!' })
    job: mongoose.Schema.Types.ObjectId;
}
