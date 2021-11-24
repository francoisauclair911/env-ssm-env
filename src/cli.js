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
  let options = parseArgumentsIntoOptions(args);
  process.env.AWS_REGION = options.REGION;

  checkFileExistsSync(options.inputPath);
  const { parsed: parsedEnv } = dotenv.config({ path: options.inputPath });
  writeStream = fs.createWriteStream(options.outputPath);

  for (const key in parsedEnv) {
      let decryptedValue = []
       const suffixPath =  parsedEnv[key]

       const splitted =  suffixPath.split(',');
      console.log("\x1b[32;1m%s\x1b[0m", `Decoding key : ${key}`);
    if (splitted.length === 1) {
      console.log(`SSM  path : ${suffixPath}`);

      const path = options.pathPrefix + suffixPath;
      decryptedValue = [...decryptedValue,  await getSSM(path)]
    } else {
      console.log("\x1b[32;1m%s\x1b[0m", `Detected Multiple SSM for key : ${key}`);
      for (const newPath of splitted) {
        const path = options.pathPrefix + newPath;
        console.log(`SSM path : ${path}`);
         decryptedValue = [...decryptedValue,  await getSSM(path)]
      }
    }
    appendToFile(writeStream, `${key}="${decryptedValue.join(',')}"`);
  }
  console.log("\x1b[32;1m%s\x1b[0m", `Creating new .env file`);
  writeStream.close();
}
