import arg from "arg";
import fs from "fs";

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
const client = new SSMClient();
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--ssm-path-prefix": String,
      "--input-env": String,
      "--output-env": String,
      "--region": String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    pathPrefix: args["--ssm-path-prefix"] || "",
    REGION:
      args["--region"] ||
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      "us-east-2",
    inputPath: args["--input-env"] || "./.env.example",
    outputPath: args["--output-env"] || "./.env",
  };
}
const getSSM = async (Name, WithDecryption = true) => {
  const command = new GetParameterCommand({
    Name,
    WithDecryption,
  });
  const response = await client.send(command);
  return response.Parameter.Value;
};
function checkFileExistsSync(filepath) {
  console.log("\x1b[32;1m%s\x1b[0m  ", "=> filepath", filepath);
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e) {
    console.error("Input env path is invalid");
  }
  return console.log("Input-env :", filepath);
}

const appendToFile = (stream, string) => {
  stream.write(string + "\r\n");
};
export { appendToFile, parseArgumentsIntoOptions, checkFileExistsSync, getSSM };
