import fs from "fs";
import dotenv from "dotenv";
import {
  appendToFile,
  getSSM,
  parseArgumentsIntoOptions,
  checkFileExistsSync,
} from "./utils";

let writeStream;

export async function cli(args) {
  process.env.BOB = "woow";

  let options = parseArgumentsIntoOptions(args);
  process.env.AWS_REGION = options.REGION;

  checkFileExistsSync(options.inputPath);
  const { parsed: parsedEnv } = dotenv.config({ path: options.inputPath });
  writeStream = fs.createWriteStream(options.outputPath);

  for (const key in parsedEnv) {
    const path = options.pathPrefix + parsedEnv[key];

    console.log("\x1b[32;1m%s\x1b[0m", `Fetching SSM Parameter`);
    console.log(path);

    const decryptedValue = await getSSM(path);

    appendToFile(writeStream, `${key}="${decryptedValue}"`);
  }
  console.log("\x1b[32;1m%s\x1b[0m", `Creating new .env file`);
  writeStream.close();
}
