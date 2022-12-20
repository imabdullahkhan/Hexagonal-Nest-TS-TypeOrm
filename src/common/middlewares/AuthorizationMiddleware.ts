import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { RESPONSE_STATUS_CODE } from '../constants';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const receivedToken = (req.headers.authorization || 'undefined')
      .toString()
      .split(' ')
      .pop();
    const path = req.originalUrl.replace(/\?.*$/, '');
    const config = {
      headers: {
        Authorization: `Bearer ${receivedToken}`,
      },
    };
    const payload = {
      request_endpoint: path,
      request_method: req.method,
    };
    try {
      const response = await axios.post(
        this.configService.get('AUTHORIZATION_URL'),
        payload,
        config
      );
      if (
        response.data.status &&
        response.data.code == RESPONSE_STATUS_CODE.SUCCESS
      ) {
        const base64Payload = receivedToken.split('.')[1];
        const payloadBuffer = Buffer.from(base64Payload, 'base64');
        const updatedJwtPayload = JSON.parse(payloadBuffer.toString());

        const { city_id, id } = updatedJwtPayload.user;
        if (city_id === undefined) {
          if (req.query.cityId === undefined) {
            return res.status(400).json({
              status: false,
              message: 'The Bearer Token does not contain city id,',
              data: updatedJwtPayload,
            });
          }
        } else {
          req.query.cityId = city_id;
        }

        if (id === undefined) {
          return res.status(400).json({
            status: false,
            message: 'The Bearer Token does not contain user id,',
            data: updatedJwtPayload,
          });
        }

        req.query.userId = id;
        next();
      } else {
        return res
          .status(401)
          .json({ status: false, message: 'Un-Authorized user !', data: null });
      }
    } catch (error) {
      return res
        .status(401)
        .json({ status: false, message: 'Un-Authorized user !', data: null });
    }
  }
}
