// src/services/collectionService.js
const moment = require('moment-timezone');

function createCollectionService(db, TIMEZONE) {
    const getNextCollection = () => {
        const today = moment().tz(TIMEZONE).format('YYYY-MM-DD');
        const query = db.prepare(`
            SELECT date, collection 
            FROM collections 
            WHERE date >= ? 
              AND collection IS NOT '' 
            ORDER BY date ASC 
            LIMIT 1
        `);
        return query.get(today);
    };

    const getTomorrowCollection = () => {
        const tomorrow = moment().tz(TIMEZONE).add(1, 'days').format('YYYY-MM-DD');
        const query = db.prepare(`
            SELECT date, collection 
            FROM collections 
            WHERE date = ?
              AND collection IS NOT ''
        `);
        return query.get(tomorrow);
    };

    return {
        getNextCollection,
        getTomorrowCollection,
    };
}

module.exports = createCollectionService;
