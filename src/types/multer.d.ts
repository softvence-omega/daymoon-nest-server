import { File as MulterFile } from 'multer';

declare global {
  namespace Express {
    export interface Multer {
      File: MulterFile;
    }
  }
}
