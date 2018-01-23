[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/oicr-gsi/illumina-report.svg)](https://travis-ci.org/oicr-gsi/illumina-report)

# Illumina Summary Report to JSON

This tool uses Illumina's InterOp `summary` application to produce a CSV summary of the InterOp binary data in a run directory, and ultimately processes that CSV into JSON.

The `illumina_summary_tool` in this folder is identical to the `interop/bin/summary` tool from [version 1.1.2 of the Illumina tools](https://github.com/Illumina/interop/releases/tag/v1.1.2). Please note that as Illumina frequently changes their formatting, there is no guarantee that this script will work with other versions of the Illumina tools. If you wish to download a different version of the summary tool, please see `Installing the Illumina applications` below.

### Install the dependencies

Clone this repository then install the dependencies:

```
$ npm install
```

### How to get JSON summary metrics from a run directory

The `illumina_summary_tool` outputs its report in CSV format to STDOUT.
The `illuminaCsvToJson.js` script takes one parameter, which can be either a file path for the saved output of using the `illumina_summary_tool`, or it can be the output of the summary tool itself.

First method (file path parameter):

```
$ ./illumina_summary_tool /path/to/run/folder > /new/location/runSummary.csv
$ node illuminaCsvToJson.js /new/location/runSummary.csv
```

Second method (summary tool output parameter):

```
$ node illuminaCsvToJson.js "$(./illumina_summary_tool /path/to/run/folder)"
```

In both cases, the `illuminaCsvToJson.js` script outputs its results to STDOUT.

### Installing the Illumina applications

The Illumina applications are c++ code, found in the interop/src/apps directory in their [GitHub repository](https://github.com/Illumina/interop).

To install the version that this tool was developed for, go to [the v1.1.2 release](https://github.com/Illumina/interop/releases/tag/v1.1.2) and download the relevant package for your machine.

To install a different version of the Illumina InterOp tools, go to http://illumina.github.io/interop/install.html and click "Latest Release" under the **Download Binary** heading, then download the relevant package for your machine.

Unarchive the downloaded package as per your system. The `summary` file is located at `interop/bin/summary`.

### Testing

Unit.js was used for testing the `csvToJson` methods to make sure the correct numbers are still retrieved when the version of the Illumina applications change. If you have downloaded a different version of the Illumina InterOp applications, you'll want to confirm that the `csvToJson` methods still work.

Firstly, there is a `test/miseqSummaryData.csv` file that used version 1.1.2 of the Illumina InterOp `summary` application to generate it. If you want to run the test on the new version, generate the summary file for the [130417_M00146_0021_000000000-A2WDF](https://github.com/TGAC/miso-lims/tree/develop/runscanner/src/test/resources/illumina/130417_M00146_0021_000000000-A2WDF) run and store it in place of this file.

Run the tests:

```
npm test
```

#### Dev notes

This project uses [ESLint](https://github.com/eslint/eslint) for syntax error checking, [Prettier](https://github.com/prettier/prettier) for automatic formatting, and [Husky](https://github.com/typicode/husky) to run these before Git commits. Husky will also run tests before pushing to a Git remote.