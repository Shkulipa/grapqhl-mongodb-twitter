import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

export const fileSizeGuard = (
  files: Express.Multer.File[],
  maxSize: number,
) => {
  if (files.some((file) => file.size > maxSize))
    throw new HttpException(
      `Max size of file is ${maxSize / 10e6}MB`,
      HttpStatus.BAD_REQUEST,
    );
};
