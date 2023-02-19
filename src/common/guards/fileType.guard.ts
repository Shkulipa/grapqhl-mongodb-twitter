import { HttpException, HttpStatus } from '@nestjs/common';

export const fileTypeGuard = (
  files: Express.Multer.File[],
  availableTypes: string[],
) => {
  if (files.some((file) => !availableTypes.includes(file.mimetype))) {
    const types = availableTypes.map((t) => '.' + t.split('/')[1]).join(', ');
    throw new HttpException(
      `Available types of file are ${types}`,
      HttpStatus.BAD_REQUEST,
    );
  }
};
