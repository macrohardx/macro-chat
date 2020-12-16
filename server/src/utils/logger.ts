import config from '../config';
export function log(msg: string, error: Error = null) {
  if (error) {
    console.error(error)
  }  
  if (!error && config.logLevel.toUpperCase() === 'DEBUG') {
    console.log(msg);
  }
}