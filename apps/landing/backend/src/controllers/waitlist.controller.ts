import { FastifyRequest, FastifyReply } from 'fastify';
import { waitlistSchema } from '../schemas/waitlist.schema';
import { WaitlistService } from '../services/waitlist.service';
import { ZodError } from 'zod';

export class WaitlistController {
  static async join(request: FastifyRequest, reply: FastifyReply) {
    try {
      const dto = waitlistSchema.parse(request.body);
      
      await WaitlistService.join(dto);
      
      return reply.status(201).send({
        status: 'success',
        message: 'Joined waitlist successfully'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.issues
        });
      }
      
      if (error instanceof Error && error.message === 'Email already in waitlist') {
        return reply.status(409).send({
          status: 'error',
          code: 'CONFLICT',
          message: error.message
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      });
    }
  }
}
