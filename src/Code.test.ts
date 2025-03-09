import { getDeletionDate, parseLabel } from "./Code";

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2025-07-01"));
});

describe("Label regex matching", () => {
  const cases = [
    {
      labelName: "prune-1d",
      expectedResult: {
        duration: 1,
        durationType: "d",
      },
    },
    {
      labelName: "prune-10m",
      expectedResult: {
        duration: 10,
        durationType: "m",
      },
    },
    {
      labelName: "prune-3y",
      expectedResult: {
        duration: 3,
        durationType: "y",
      },
    },
    { labelName: "prune-d", expectedResult: null },
    { labelName: "prune-123z", expectedResult: null },
    { labelName: "prune-1a", expectedResult: null },
    { labelName: "prune-1", expectedResult: null },
    { labelName: "prune-", expectedResult: null },
    { labelName: "prune-0d", expectedResult: null },
  ];

  for (const { labelName, expectedResult } of cases) {
    test(`parse ${labelName}`, () => {
      expect(parseLabel(labelName)).toEqual(expectedResult);
    });
  }
});

describe("Deletion date", () => {
  const cases = [
    {
      label: {
        duration: 1,
        durationType: "d",
      },
      expectedResult: new Date("2025-06-30"),
    },
    {
      label: {
        duration: 10,
        durationType: "m",
      },
      expectedResult: new Date("2024-09-01"),
    },
    {
      label: {
        duration: 3,
        durationType: "y",
      },
      expectedResult: new Date("2022-07-01"),
    },
  ];
  for (const { label, expectedResult } of cases) {
    test(`deletion date for ${label.duration}${label.durationType}`, () => {
      expect(getDeletionDate(label)).toEqual(expectedResult);
    });
  }
});
