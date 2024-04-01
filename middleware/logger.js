const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const date = new Date();
const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

//? This was done to get myself familiar with fs module, you can remove it.
const logEvents = async (message, logFileName) => {
  const dateTime = new Intl.DateTimeFormat("en-GB", options).format(date);
  const logItem = dateTime + "\t" + uuid() + "\t" + message + "\n";

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method}\t${req.path}`);
  next();
};

module.exports = { logEvents, logger };
