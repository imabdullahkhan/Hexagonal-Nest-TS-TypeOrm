import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TokenDecoderMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const receivedToken = (req.headers.authorization || 'undefined')
        .toString()
        .split(' ')
        .pop();

      const base64Payload = receivedToken.split('.')[1];
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
      const { city_id, id } = updatedJwtPayload.user;
      if (city_id !== undefined && id !== undefined) {
        req.query.cityId = city_id;
        req.query.userId = id;
        next();
      } else {
        req.query.userId = id;
        next();
        // return res.status(400).json({ status: false, message: 'No city Id is assign to this user', data: null });
      }
    } catch (error) {
      next();
      // return res
      //   .status(401)
      //   .json({ status: false, message: 'Un-Authorized user !', data: null });
    }
  }
}
