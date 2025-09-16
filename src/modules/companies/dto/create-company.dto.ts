import { IsObjectId } from "@common/decorators/validate.decorator";
import { IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Name must not be empty!' })
    name: string;

    @IsNotEmpty({ message: 'Address must not be empty!' })
    address: string;

    @IsNotEmpty({ message: 'Description must not be empty!' })
    description: string;

    @IsNotEmpty({ message: 'Company must not be empty!' })
    @IsObjectId({ message: 'Company must be a ObjectId!' })
    company: string;
}
