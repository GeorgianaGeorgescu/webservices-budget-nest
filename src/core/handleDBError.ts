import {
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  PreconditionFailedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const handleDBError = (error: Prisma.PrismaClientKnownRequestError) => {
  const { code, message } = error;

  switch (code) {
    case 'P2002':
      if (message.includes('idx_place_name_unique')) {
        throw new ConflictException('A place with this name already exists');
      } else if (message.includes('idx_user_email_unique')) {
        throw new ConflictException(
          'There is already a user with this email address',
        );
      } else {
        throw new ConflictException('This item already exists');
      }

    case 'P2025':
      if (message.includes('fk_transaction_user')) {
        throw new NotFoundException('This user does not exist');
      } else if (message.includes('fk_transaction_place')) {
        throw new NotFoundException('This place does not exist');
      } else if (message.includes('transaction')) {
        throw new NotFoundException('No transaction with this id exists');
      } else if (message.includes('place')) {
        throw new NotFoundException('No place with this id exists');
      } else if (message.includes('user')) {
        throw new NotFoundException('No user with this id exists');
      }
      break;

    case 'P2003':
      if (message.includes('place_id')) {
        throw new PreconditionFailedException(
          'This place is still linked to transactions',
        );
      } else if (message.includes('user_id')) {
        throw new PreconditionFailedException(
          'This user is still linked to transactions',
        );
      }
      break;

    default:
      throw new InternalServerErrorException(
        'An unexpected error occurred while interacting with the database',
      );
  }
};
