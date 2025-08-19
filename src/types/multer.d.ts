// import { File as MulterFile } from 'multer';

// declare global {
//   namespace Express {
//     export interface Multer {
//       File: MulterFile;
//     }
//   }
// }

import { Express } from 'express';

declare global {
  type File = Express.Multer.File;
}

// export interface MulterFile {
//   /** Original filename on user's computer */
//   originalname: string;
//   /** Name of the field in the form */
//   fieldname: string;
//   /** Encoding type */
//   encoding: string;
//   /** Mime type */
//   mimetype: string;
//   /** Size in bytes */
//   size: number;
//   /** Destination folder */
//   destination: string;
//   /** File name within destination */
//   filename: string;
//   /** Full path to file */
//   path: string;
//   /** Optional buffer (if memory storage) */
//   buffer?: Buffer;
// }
