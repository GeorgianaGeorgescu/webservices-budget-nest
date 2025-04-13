import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseUserIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === 'me') {
      return 'me';
    }
    
    const parsedId = Number(value);
    if (isNaN(parsedId)) {
      throw new BadRequestException('User ID must be a number or "me"');
    }
    
    return parsedId;
  }
}