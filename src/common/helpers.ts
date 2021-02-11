import { HttpException, HttpStatus } from '@nestjs/common';

export const acceptHeaderValidation = (headers: any): void => {
  const acceptHeader = 'accept';
  const applicationJSON = 'application/json';

  if (!headers || headers[acceptHeader] !== applicationJSON) {
    throw new HttpException('The format of accept header is invalid', HttpStatus.NOT_ACCEPTABLE);
  }
};
