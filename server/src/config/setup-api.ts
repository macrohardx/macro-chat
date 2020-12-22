import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { log } from '../utils/logger';
import { Application } from 'express';

/**
 * Setup API server
 */
export function setupApi(iocContainer: Container): Application {  
  const inversifyExpressServer = new InversifyExpressServer(iocContainer)
  inversifyExpressServer.setConfig((app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '2mb' }));
    app.use(cookieParser());
  });
  inversifyExpressServer.setErrorConfig((app) => {
    app.use(onException);
  });
  return inversifyExpressServer.build();
}

function onException(err: Error, _req, res, _nextFunc) {
  res.status(500).send(err);
  log(err.message, err);
}