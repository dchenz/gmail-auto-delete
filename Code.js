function main() {
  for (const label of GmailApp.getUserLabels()) {
    const duration = parseDurationFromLabel(label.getName());
    // Ignore labels that are irrelevant to this script.
    if (!duration) {
      continue;
    }
    const deletionDate = getDeletionDateFromDuration(duration);
    for (const thread of label.getThreads()) {
      if (thread.getLastMessageDate() < deletionDate) {
        thread.moveToTrash();
      }
    }
  }
}

function parseDurationFromLabel(labelName) {
  const match = /^prune-(\d+)(d|w|m)$/.exec(labelName);
  if (!match) {
    return null;
  }
  return {
    durationQuantity: parseInt(match[1], 10),
    durationType: match[2],
  };
}

function getDeletionDateFromDuration({ durationQuantity, durationType }) {
  const now = new Date();
  switch (durationType) {
    case "d":
      now.setDate(now.getDate() - durationQuantity);
      break;
    case "w":
      now.setMonth(now.getMonth() - durationQuantity);
      break;
    case "m":
      now.setFullYear(now.getFullYear() - durationQuantity);
      break;
  }
  return now;
}
