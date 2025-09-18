import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateRoleDto {
    @IsString({ message: 'Role name must be a string' })
    @IsNotEmpty({ message: 'Role name should not be empty' })
    name: string;

    @IsString({ message: 'Description must be a string' })
    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string;

    @IsBoolean({ message: 'isActive must be a boolean value' })
    @IsOptional()
    isActive?: boolean;

    @IsArray({ message: 'Permissions must be an array of strings' })
    @ArrayNotEmpty({ message: 'Permissions array should not be empty' })
    @IsString({ each: true, message: 'Each permission must be a string' })
    permissions: string[];
}