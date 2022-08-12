import * as cors from 'cors';
import * as express from 'express';
import { join } from 'path';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/apps/remote1');

  server.use(cors());

  // serve static files
  server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

  server.get('*', (req, res) => {
    console.log(req.url, req.headers);
    res.status(404).send('404 Not Found');
  });

  return server;
}

function run() {
  const port = process.env['PORT'] || 4201;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}
