const LABEL_PREFIX = "prune";

const DAY = "d";
const MONTH = "m";
const YEAR = "y";

const LABEL_REGEX = new RegExp(
  `^${LABEL_PREFIX}-(\\d+)(${[DAY, MONTH, YEAR].join("|")})$`
);

type AutoDeleteLabel = {
  duration: number;
  durationType: string;
};

function main() {
  for (const gmailLabel of GmailApp.getUserLabels()) {
    const autoDeleteLabel = parseLabel(gmailLabel.getName());
    // Ignore labels that are irrelevant to this script.
    if (!autoDeleteLabel) {
      continue;
    }
    const deletionDate = getDeletionDate(autoDeleteLabel);
    for (const thread of gmailLabel.getThreads()) {
      if (thread.getLastMessageDate() < deletionDate) {
        thread.moveToTrash();
      }
    }
  }
}

function parseLabel(labelName: string): AutoDeleteLabel | null {
  const match = LABEL_REGEX.exec(labelName);
  if (!match) {
    return null;
  }
  return {
    duration: parseInt(match[1], 10),
    durationType: match[2],
  };
}

function getDeletionDate({ duration, durationType }: AutoDeleteLabel): Date {
  const now = new Date();
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
