import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsMongoIdConstraint implements ValidatorConstraintInterface {
  validate(id: string) {
    return Types.ObjectId.isValid(id);
  }

  defaultMessage() {
    return 'Invalid MongoDB ID format';
  }
}

export function IsMongoId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMongoIdConstraint,
    });
  };
}
