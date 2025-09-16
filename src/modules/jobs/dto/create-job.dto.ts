import {
    IsNotEmpty,
    IsString,
    IsArray,
    ArrayNotEmpty,
    IsNumber,
    IsPositive,
    IsDate,
    IsOptional
} from "class-validator";
import { Type } from "class-transformer";
import { IsBefore } from "@common/decorators/validate.decorator";

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name must not be empty!' })
    @IsString({ message: 'Name must be a string!' })
    name: string;

    @IsArray({ message: 'Skills must be an array!' })
    @ArrayNotEmpty({ message: 'Skills must not be empty!' })
    @IsString({ each: true, message: 'Each skill must be a string!' })
    skills: string[];

    @IsNotEmpty({ message: 'Company must not be empty!' })
    @IsString({ message: 'Company must be a string!' })
    company: string;

    @IsNotEmpty({ message: 'Location must not be empty!' })
    @IsString({ message: 'Location must be a string!' })
    location: string;

    @IsNotEmpty({ message: 'Salary must not be empty!' })
    @IsNumber({}, { message: 'Salary must be a number!' })
    @IsPositive({ message: 'Salary must be positive!' })
    salary: number;

    @IsNotEmpty({ message: 'Quantity must not be empty!' })
    @IsNumber({}, { message: 'Quantity must be a number!' })
    @IsPositive({ message: 'Quantity must be positive!' })
    quantity: number;

    @IsNotEmpty({ message: 'Level must not be empty!' })
    @IsString({ message: 'Level must be a string!' })
    level: string;

    @IsNotEmpty({ message: 'Description must not be empty!' })
    @IsString({ message: 'Description must be a string!' })
    description: string;

    @IsNotEmpty({ message: 'StartDate must not be empty!' })
    @Type(() => Date)  // class-transformer để parse string -> Date
    @IsDate({ message: 'StartDate must be a valid date!' })
    startDate: Date;

    @IsNotEmpty({ message: 'EndDate must not be empty!' })
    @Type(() => Date)
    @IsDate({ message: 'EndDate must be a valid date!' })
    @IsBefore("endDate", { message: "StartDate must not be after EndDate!" })
    endDate: Date;
}
