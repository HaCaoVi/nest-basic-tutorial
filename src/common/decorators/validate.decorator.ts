import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { Types } from 'mongoose';

export function IsBefore(property: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isBefore',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];

                    const start = new Date(value);
                    const end = new Date(relatedValue);

                    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                        return true; // bỏ qua nếu 1 trong 2 không phải ngày hợp lệ
                    }

                    return start.getTime() < end.getTime();
                },
            },
        });
    };
}

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isObjectId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return Types.ObjectId.isValid(value);
                },
                defaultMessage() {
                    return 'Invalid ObjectId';
                },
            },
        });
    };
}
