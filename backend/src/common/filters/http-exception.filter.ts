import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorMessage: string;
    if (typeof exceptionResponse === "string") {
      errorMessage = exceptionResponse;
    } else {
      errorMessage = (exceptionResponse as { message?: string }).message || "Unexpected error occurred";
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
