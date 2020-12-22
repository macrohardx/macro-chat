import * as path from 'path';
import { log } from './logger';
/**
 * Safely creates a directory. 'Promisified' version of mkdir that doesn't throw
 * @param {Object} fsModule 
 * @param {String} pathToCreate 
 * @returns {Promise<void>}
 */
export const safeCreateDirectory = (fsModule, pathToCreate) =>
  new Promise((success, fail) =>
    fsModule.mkdir(pathToCreate, { recursive: true }, (err) =>
      err ? fail(new Error(err))
        : success(true)))

/**
 * Verify if a user has access to a file
 * @param {fs} fsModule 
 * @param {String} pathToFile 
 * @returns {Promise<Boolean>}
 */
export const verifyIfFileExists = (fsModule, pathToFile: string) =>
  new Promise((success) =>
    fsModule.access(pathToFile, (err) =>
      success(!err)))

export async function safeWriteFile(fsModule: any, outputPath: string, data: any, options?: any) {
  return new Promise(async (success) => {
    let exists = await verifyIfFileExists(fsModule, path.dirname(outputPath))
    if (!exists) {
      await safeCreateDirectory(fsModule, path.dirname(outputPath))
    }
    await fsModule.promises.writeFile(outputPath, data, options);
    success(true);
  });
}