// import { File as MulterFile } from 'multer';

// declare global {
//   namespace Express {
//     export interface Multer {
//       File: MulterFile;
//     }
//   }
// }

// types/express/index.d.ts
import 'express';
import { Buffer } from 'buffer';

declare global {
  namespace Express {
    interface Multer {
      File: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination?: string;
        filename?: string;
        path?: string;
        buffer?: Buffer;
      };
    }
  }
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
