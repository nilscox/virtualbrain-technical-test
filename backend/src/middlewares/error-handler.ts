import type { ErrorRequestHandler } from 'express';
import { z } from 'zod';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  // The response can fail while it is streamed: let express close the connection
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof z.ZodError) {
    return res.status(400).send({ message: z.prettifyError(error) });
  }

  if (hasStatus(error) && error.status < 500) {
    return res.status(error.status).send({ message: error.message });
  }

  console.error(error);

  return res.status(500).send({ message: 'Internal server error' });
};

/** Errors raised by express itself, like a malformed JSON body, carry their status code */
function hasStatus(error: unknown): error is Error & { status: number } {
  return error instanceof Error && 'status' in error && typeof error.status === 'number';
}
