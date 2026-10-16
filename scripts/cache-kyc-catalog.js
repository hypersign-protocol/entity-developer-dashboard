const fs = require('fs');
const https = require('https');
const path = require('path');

const catalogUrl = 'https://raw.githubusercontent.com/hypersign-protocol/hypersign-credits-middleware/refs/heads/ADR000/src/catalogs/catalog.kyc.json';
const catalogPath = path.resolve(__dirname, '../src/catalogs/catalog.kyc.json');
const shouldRefresh = process.argv.includes('--refresh');

function hasValidCache() {
  if (!fs.existsSync(catalogPath)) return false;

  try {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    return Array.isArray(catalog.routes) && catalog.routes.length > 0;
  } catch (_) {
    return false;
  }
}

if (!shouldRefresh && hasValidCache()) {
  console.log(`Using cached KYC credit catalog at ${catalogPath}`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(catalogPath), { recursive: true });

https.get(catalogUrl, response => {
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    console.error('The KYC catalog URL redirected. Update the pinned catalog URL before building.');
    process.exit(1);
  }

  if (response.statusCode !== 200) {
    console.error(`Unable to download KYC catalog: HTTP ${response.statusCode}`);
    process.exit(1);
  }

  let body = '';
  response.setEncoding('utf8');
  response.on('data', chunk => { body += chunk; });
  response.on('end', () => {
    try {
      const catalog = JSON.parse(body);
      if (!Array.isArray(catalog.routes) || catalog.routes.length === 0) {
        throw new Error('catalog does not contain routes');
      }
      fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
      console.log(`Cached KYC credit catalog at ${catalogPath}`);
    } catch (error) {
      console.error(`Unable to cache KYC catalog: ${error.message}`);
      process.exit(1);
    }
  });
}).on('error', error => {
  console.error(`Unable to download KYC catalog: ${error.message}`);
  process.exit(1);
});
