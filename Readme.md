## @adra-network/env-ssm-env

#

### What is it

This little CLI parses an `env` file containing keys and SSM paths and constructs another `env` file with the fetched SSM Parameters

**Decryption is taken care of if the path is encrypted**

If a key in the `ENV` has a comma separated list of SSM paths, they will be decoded and join with a comma as the value for that key.

```
SOME_KEY=/ssm/path/1,/ssm/path/2
```

Will become

```
SOME_KEY=decoded-value-1,decoded-value-2
```

#

### Installation

```
yarn add @adra-network/env-ssm-env
npm install @adra-network/env-ssm-env
```

Run it via npx

```
npx @adra-network/env-ssm-env [options]
```

### Options

#

`--ssm-path-prefix <string>`

Prefixes the paths of your input env with the given string

**_Example_** `--ssm-path-prefix "/dev"`

_Default_ : `""`

#

`--input-env <string>`

Specifies the path of the env to parse

_Example_ `--input-env "./.env.example"`

_Default_ : `./.env.example`

#

`--docker-compatible <boolean>`

Doesn't prefix the generate value with double quotes (`"`)

See this for more information [link](https://dev.to/tvanantwerp/don-t-quote-environment-variables-in-docker-268h)

_Example_ `--docker-compatible`

_Default_ : `false`

#

`--output-env <string>`

Specifies the output path of the env to generate

_Example_ `--output-env "./.env"`

_Default_ : `./.env`

#

`--region <string>`

Specifies the AWS Region to use

_Example_ `--region "eu-west-1"`

_Default_ :

`process.env.AWS_REGION`

then

`process.env.AWS_DEFAULT_REGION`

then

`us-east-2`

#

### Examples

Considering a `.env.example` file looking like this:

```
KEY=/ssm/path/to/first-parameter
KEY2=/ssm/path/to/second-parameter
```

Running

`npx @adra-network/env-ssm-env --ssm-path-prefix "/dev" --region "eu-west-1" --input-env ".env.example" --output-env ".env.production"`

Would generate `.env.production` file with the following:

```
KEY=decypted-value-first-parameter
KEY2=decypted-value-second-parameter
```

### Changelog

#

**1.0.8**

- Implement the `--docker-compatible` flag
- Add this changelog
