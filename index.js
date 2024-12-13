// Required libraries
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import { randomInt } from "crypto";

const filePath = "./data.json"; // Path to JSON file

// Validate if a date is within the desired range
const isValidDate = (date) => {
  const startDate = moment("2019-01-01");
  const endDate = moment("2024-12-13");
  return date.isBetween(startDate, endDate, null, "[]");
};

// Write a commit with the given date
const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(filePath, data);

  const git = simpleGit();
  await git.add(filePath);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

// Generate random commits
const makeCommits = async (numCommits) => {
  const git = simpleGit();

  for (let i = 0; i < numCommits; i++) {
    const randomWeeks = randomInt(0, 54); // Random weeks within a year
    const randomDays = randomInt(0, 7); // Random days within a week

    const randomDate = moment("2019-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days");

    if (isValidDate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  console.log("Pushing all commits...");
  await git.push();
};

// Execute the script with a specified number of commits
makeCommits(50000);
