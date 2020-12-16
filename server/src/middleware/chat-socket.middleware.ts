export async function tokenValidationMiddleware(socket: any, next: Function) {

  let token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Invalid token'));
  }

  let isTokenValid = await validateToken(token);
  if (!isTokenValid) {
    return next(new Error('Invalid token'));
  }

  socket.username = 'MeuPauMeuOvo'
  next();
}

const validateToken = (token: string) => {
  // get Token once in x seconds and save on cache, maybe cache stays on tokenService
  //let user =  await someService.getUserFromToken(token);
  //socket['username'] = user.username;
  return waitForIt(token === 'FooBarBazQux', 2000);
};

const waitForIt = (result, millis) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, millis);
  });  
}