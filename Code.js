const exports = {};
exports.__esModule = true;
exports.getDeletionDate = exports.parseLabel = void 0;
var LABEL_PREFIX = "prune";
var DAY = "d";
var MONTH = "m";
var YEAR = "y";
var LABEL_REGEX = new RegExp("^".concat(LABEL_PREFIX, "-(\\d+)(").concat([DAY, MONTH, YEAR].join("|"), ")$"));
function main() {
    for (var _i = 0, _a = GmailApp.getUserLabels(); _i < _a.length; _i++) {
        var gmailLabel = _a[_i];
        var autoDeleteLabel = parseLabel(gmailLabel.getName());
        // Ignore labels that are irrelevant to this script.
        if (!autoDeleteLabel) {
            continue;
        }
        var deletionDate = getDeletionDate(autoDeleteLabel);
        for (var _b = 0, _c = gmailLabel.getThreads(); _b < _c.length; _b++) {
            var thread = _c[_b];
            if (thread.getLastMessageDate() < deletionDate) {
                thread.moveToTrash();
            }
        }
    }
}
function parseLabel(labelName) {
    var match = LABEL_REGEX.exec(labelName);
    if (!match) {
        return null;
    }
    return {
        duration: parseInt(match[1], 10),
        durationType: match[2]
    };
}
exports.parseLabel = parseLabel;
function getDeletionDate(_a) {
    var duration = _a.duration, durationType = _a.durationType;
    var now = new Date();
    switch (durationType) {
        case DAY:
            now.setDate(now.getDate() - duration);
            break;
        case MONTH:
            now.setMonth(now.getMonth() - duration);
            break;
        case YEAR:
            now.setFullYear(now.getFullYear() - duration);
            break;
    }
    return now;
}
exports.getDeletionDate = getDeletionDate;
