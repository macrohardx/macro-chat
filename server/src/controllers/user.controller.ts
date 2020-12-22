import { controller, httpGet, httpPut, requestBody, requestParam } from 'inversify-express-utils';
import { IUserRepository } from '../domain/interfaces/repository';
import { TYPES } from '../config/ioc-types';
import { inject } from 'inversify';
import { JsonResult } from 'inversify-express-utils/dts/results';
import { map } from "lodash";
import { User } from '../domain/model/user';
import { BaseApiController } from './base-api.controller';
import config from '../config';
import { safeWriteFile, verifyIfFileExists } from '../utils/fs-safe';
import * as fs from 'fs';
import * as path from 'path';

@controller('/macro-chat/api/v1/user')
export class UserController extends BaseApiController {

  @inject(TYPES.UserRepository) private _usersRepository: IUserRepository;

  @httpGet('/me')
  public async GetCurrentUser() {
    const user = await this._usersRepository.findById(this.userId);
    if (!user) {
      return this.json({ error: 'user not found' }, this.statusCodes.NOT_FOUND);
    }
    return user;
  }

  @httpGet('/all')
  public async GetAllUser(): Promise<JsonResult> {
    const users = await this._usersRepository.queryAll()
    return this.json({ data: users });
  }

  @httpGet('/profile-pic/:userId')
  public async GetUserProfilePic(@requestParam('userId') userId: string): Promise<any> {
    let filePath = `${config.file_server_url}\\${userId}_profilePic.jpg`;
    const userHasPicture = await verifyIfFileExists(fs, filePath);
    if (!userHasPicture) {
      filePath = `${config.file_server_url}\\default_profilePic.jpg`;
    }
    this.cacheResponse('10m');
    return this.file(filePath, { maxAge: '10m' });
  }

  @httpPut('/profile-pic/:userId')
  public async SetUserPic(@requestParam('userId') userId, @requestBody() body) {
    // Get user from database
    const user = await this._usersRepository.findById(userId);
    if (!user) {
      return this.json({ error: 'user not found' }, this.statusCodes.NOT_FOUND);
    }

    if (user.profilePicPath) {
      await fs.promises.unlink(user.profilePicPath);
    }

    // Write file to disk
    const base64 = body.base64.replace('data:image/jpeg;base64,', '')
    user.profilePicPath = path.join(config.file_server_url, `${this.userId}_profilePic.jpg`)
    await safeWriteFile(fs, user.profilePicPath, base64, { encoding: 'base64' });

    // Update user
    await this._usersRepository.save(user);
    return this.json({ data: true });
  }
}