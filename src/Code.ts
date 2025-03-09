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
    let totalThreads = 0;
    let deletedThreads = 0;
    for (const thread of gmailLabel.getThreads()) {
      if (thread.getLastMessageDate() < deletionDate) {
        thread.moveToTrash();
        deletedThreads++;
      }
      totalThreads++;
    }
    Logger.log(
      `Label ${gmailLabel.getName()} - ${deletedThreads} deleted, ${totalThreads} total`
    );
  }
}

export function parseLabel(labelName: string): AutoDeleteLabel | null {
  const match = LABEL_REGEX.exec(labelName);
  if (!match) {
    return null;
  }
  const duration = parseInt(match[1], 10);
  if (duration <= 0) {
    return null;
  }
  return {
    duration,
    durationType: match[2],
  };
}

export function getDeletionDate({
  duration,
  durationType,
}: AutoDeleteLabel): Date {
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
