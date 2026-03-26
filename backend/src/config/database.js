const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

const resolveHostForPg = (hostname, options, callback) => {
    const cb = typeof options === 'function' ? options : callback;

    dns.resolve4(hostname, (ipv4Err, ipv4Addresses) => {
        if (!ipv4Err && Array.isArray(ipv4Addresses) && ipv4Addresses.length > 0) {
            return cb(null, ipv4Addresses[0], 4);
        }

        dns.resolve6(hostname, (ipv6Err, ipv6Addresses) => {
            if (!ipv6Err && Array.isArray(ipv6Addresses) && ipv6Addresses.length > 0) {
                return cb(null, ipv6Addresses[0], 6);
            }

            // Fall back to the default resolver for localhost/custom host mappings.
            return dns.lookup(hostname, cb);
        });
    });
};

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/farmers_nation_db',
    lookup: resolveHostForPg,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;
