import {
  isURL,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IMedia } from 'src/models/files/interfaces/media.interfaces';
import { validURL } from '../helpers/validURL';

/**
 * @info
 * https://github.com/typestack/class-validator
 */
@ValidatorConstraint()
export class IsURLValidation implements ValidatorConstraintInterface {
  validate(urls: IMedia[]) {
    const mapArr = urls.map((media) => media.urlFile);

    let isValid = true;
    for (const url of mapArr) {
      if (!isValid) break;
      if (!validURL(url)) isValid = false;
    }

    if (isValid) return true;

    return false;
  }

  defaultMessage() {
    return 'Provide valid urls';
  }
}
