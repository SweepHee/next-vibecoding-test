export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 사용자에게 에러 메시지를 노출해도 안전한 에러
 */
export class PublicError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}

/**
 * 서버 내부 오류로, 사용자에게 상세 내용을 숨겨야 하는 에러
 */
export class ServerError extends AppError {
  constructor(message: string = "서버 내부 오류가 발생했습니다.", statusCode: number = 500) {
    super(message, statusCode);
  }
}

export class BadRequestError extends PublicError {
  constructor(message: string = "잘못된 요청입니다.") {
    super(message, 400);
  }
}

export class UnauthorizedError extends PublicError {
  constructor(message: string = "인증이 필요합니다.") {
    super(message, 401);
  }
}

export class ForbiddenError extends PublicError {
  constructor(message: string = "권한이 없습니다.") {
    super(message, 403);
  }
}

export class NotFoundError extends PublicError {
  constructor(message: string = "요청한 리소스를 찾을 수 없습니다.") {
    super(message, 404);
  }
}
