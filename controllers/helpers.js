
const moment = require('moment');;

function toJSON(firebaseDocument) {

    if (!firebaseDocument.id) return {}
    return {
        ...firebaseDocument.data(),
        uid: firebaseDocument.id,
        write: firebaseDocument.createTime ? moment(firebaseDocument.createTime._seconds * 1000) : null
    }
}

function flattenArray(ary) {
    var ret = [];
    for (var i = 0; i < ary.length; i++) {
        if (Array.isArray(ary[i])) {
            ret = ret.concat(flattenArray(ary[i]));
        } else {
            ret.push(ary[i]);
        }
    }
    return ret;
}
module.exports = { toJSON, flattenArray }