import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';

export const notFound = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404);
  const error = new Error('Not found - ' + req.originalUrl);
  next(error);
};

export const genericError: ErrorRequestHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.log.error(err);
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    error: {
      status: res.statusCode,
    },
  });
};
