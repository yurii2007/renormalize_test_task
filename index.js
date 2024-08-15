const fs = require("fs");
const sample_data = require("./sample_data.json");
const users = require("./users.json");

const main = () => {
  const output = {
    recognized: [],
    not_recognized: [],
  };
  let tmp_mails = [];

  users.forEach((user) => {
    const [username] = user.email.split("@");
    const [name, surname] = username.split(".");
    const user_related_emails = [];

    const regex = new RegExp(
      `^.*${removeNumbersFromString(name)}.*\\..*${removeNumbersFromString(
        surname
      )}.*$`,
      "gi"
    );

    sample_data.forEach((data, idx) => {
      if (data.account_email?.match(regex)) {
        user_related_emails.push(data.account_email);
      } else if (data.account_email) {
        output.not_recognized.push(data.account_email);
      }
      if (data.email?.match(regex)) {
        user_related_emails.push(data.email);
      } else if (data.email) {
        output.not_recognized.push(data.email);
      }
    });
    output.recognized.push({
      user_email: user.email,
      recognized: user_related_emails,
    });
    tmp_mails = tmp_mails.concat(user_related_emails);
    output.not_recognized = output.not_recognized.filter(
      (email) => !tmp_mails.includes(email)
    );
  });

  writeOutputToFile({
    ...output,
    not_recognized: [...new Set(output.not_recognized)],
  });
};

function removeNumbersFromString(string) {
  return string.replace(/\d+/, "");
}

async function writeOutputToFile(output) {
  fs.writeFile(
    "./output.json",
    JSON.stringify(output),
    { encoding: "utf-8" },
    (err) => {
      if (!err) process.exit(0);
      reportError(err);
    }
  );
}

function reportError(error) {
  console.error(error);
  process.exit(1);
}

main();
