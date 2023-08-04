const moment = require('moment')
const { Op } = require("sequelize");

function sortBy(array, key = 'name') {
    return array.sort((left, right) => {
        if (left[key] > right[key])
            return 1;
        if (left[key] < right[key])
            return -1;
        return 0;
    });
}
function escapeRegex(text = "") {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
function toWhere(filters = {}) {
    const wheres =  Object.entries(filters).reduce((hash, [key, value]) => [...hash, { [key]: new RegExp(escapeRegex(value), 'gi') }], [])
    return { [Op.or]: wheres }
}

const mapCreatedAt = p => ({
    type: p.type,
    ...p._doc,
    created_at: p.created_at ? moment(p.created_at).format('DD/MM/YYYY HH:mm:ss') : p.created_at
})
module.exports = { sortBy, toWhere, mapCreatedAt }
