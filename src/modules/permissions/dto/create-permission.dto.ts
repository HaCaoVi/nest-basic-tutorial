import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
    @IsString({ message: 'Permission name must be a string' })
    @IsNotEmpty({ message: 'Permission name should not be empty' })
    name: string;

    @IsString({ message: 'apiPath must be a string' })
    @IsNotEmpty({ message: 'apiPath should not be empty' })
    apiPath: string;

    @IsString({ message: 'Method must be a string' })
    @IsNotEmpty({ message: 'Method should not be empty' })
    method: string;

    @IsString({ message: 'Module must be a string' })
    @IsNotEmpty({ message: 'Module should not be empty' })
    module: string;
}