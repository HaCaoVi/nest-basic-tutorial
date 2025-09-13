import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Max, Min, MinLength } from 'class-validator';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

export class CreateUserDto {
    @IsNotEmpty({ message: 'Name must not be empty!' })
    name: string;

    @IsNotEmpty({ message: 'Email must not be empty!' })
    @IsEmail({}, { message: 'Email invalid!' })
    email: string;

    @IsNotEmpty({ message: 'Password must not be empty!' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @IsNotEmpty({ message: 'Age must not be empty!' })
    @Min(10)
    @Max(100)
    age: number;

    @IsNotEmpty({ message: 'Gender must not be empty!' })
    @IsEnum(Gender, { message: 'Gender must be Male, Female, or Other' })
    gender: string;

    @IsNotEmpty({ message: 'Address must not be empty!' })
    address: string;

    @IsOptional()
    company: string;
}


export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name must not be empty!' })
    name: string;

    @IsNotEmpty({ message: 'Email must not be empty!' })
    @IsEmail({}, { message: 'Email invalid!' })
    email: string;

    @IsNotEmpty({ message: 'Password must not be empty!' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @IsNotEmpty({ message: 'Age must not be empty!' })
    age: number;

    @IsNotEmpty({ message: 'Gender must not be empty!' })
    @IsEnum(Gender, { message: 'Gender must be Male, Female, or Other' })
    gender: string;

    @IsNotEmpty({ message: 'Address must not be empty!' })
    address: string;
}