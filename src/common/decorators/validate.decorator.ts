import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsBefore(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isBefore",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    if (!(value instanceof Date) || !(relatedValue instanceof Date)) return false;
                    return value <= relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be before or equal to ${relatedPropertyName}`;
                }
            }
        });
    };
}
