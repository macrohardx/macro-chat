import * as jwt from 'jsonwebtoken';
import config from '../../config';
import * as cookie from 'cookie'


/**
 * Since sockets don't allow custom headers we need to obtain user information from the JWT cookie
 * @param socket 
 * @param next 
 */
export async function tokenValidationMiddleware(socket: any, next: Function) {
  if (!socket.user) {
    let cookies = cookie.parse(socket.handshake.headers.cookie);
    socket.user = await getUserDataFromTokenAsync(cookies['x-access-token']);
  }
  next();
}

const getUserDataFromTokenAsync = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, async (err: Error, decoded: Object) => {
      return err ? reject(err) : resolve(decoded)
    });
  });
};