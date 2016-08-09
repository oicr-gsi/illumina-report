Using Illumina applications to retrieve data
================

Illumina has produced code that converts interOp binary data into a cvs file. Here are the applications: http://illumina.github.io/interop/apps.html.

### installing
these applications are c++ code, found in the interop/src/apps directory in their git: https://github.com/Illumina.
To install this, go to http://illumina.github.io/interop/install.html and click "latest releases" under the Download Binary heading, then download the linux file. Type xdg-open INSTALL into the command line. The files that are to be run will be inside the bin directory.

### How to run the file
the summary tool sums up and averages the information. It is the one that is used for this script. The tool requires the path to the run report as an imput, and outputs results to the console. The output can be saved to a cvs file. illuminaToJSON.js takes a run name and this output to returns a json string. Here is a possible way to make the bash script for running the code:

```

#!/bin/bash
set -euf -o pipefail

PATH=$1
RUN=$2

CSV=`~/interop/bin/summary "${PATH}"`
PATH=/u/silioukhina/bin/node-v6.2.0-linux-x64/bin:$PATH node ~/illumina-report/illuminaToJSON.js "${CSV}" "${RUN}" > this_should_work.json

```
---
### Testing
Unit.js was used for testing the illuminaToJSON file to make sure the correct numbers are still retrieved when the illumina pp versions change

Firstly, npm inistall unit.js and mocha. May need to create a node_modules directory for this

Next, generate the summary file for the 150312_NS500507_0027_AH2KJ5AFXX test run and store it in a test/summaryData.csv file. This run is found in the basespace directory

To run the tests, type npm test into the command line


---
### Example
Here is a sample part of the original illumina output:

```
# Version: v1.0.8
 Level           Yield           Projected Yield Aligned         Error Rate      Intensity C1    %>=Q30         
 Read 1          31.29           31.29           0.00            0.00            5161            83.40          
 Read 2 (I)      1.46            1.46            0.00            0.00            3206            92.19          
 Read 3 (I)      1.46            1.46            0.00            0.00            2845            93.00          
 Read 4          31.26           31.26           0.00            0.00            4289            78.47          
 Non-indexed     62.55           62.55           0.00            0.00            4725            80.94          
 Total           65.47           65.47           0.00            0.00            3875            81.46          


Read 1
 Lane            Tiles           Density         Cluster PF      Phas/Prephas    Reads           Reads PF        %>=Q30          Yield           Cycles Error    Aligned         Error           Error (35)      Error (75)      Error (100)     Intensity C1   
 1               72              306 +/- 10      78.39 +/- 5.62  0.185 / 0.120   66.23           51.97           82.78           7.79            0               0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   5363 +/- 525   
 2               72              303 +/- 6       79.34 +/- 6.00  0.174 / 0.126   65.50           52.01           83.15           7.79            0               0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   5540 +/- 533   
 3               72              306 +/- 5       79.82 +/- 3.91  0.179 / 0.112   66.11           52.79           84.20           7.91            0               0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   5079 +/- 360   
 4               72              301 +/- 9       79.82 +/- 3.43  0.167 / 0.116   65.10           52.02           83.46           7.80            0               0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   0.00 +/- 0.00   4662 +/- 230  

 ...

```
The JSON would then look like this:

```
{
   "run_name": "150312_NS500507_0027_AH2KJ5AFXX",
   "r1_yield":31.29,
   "r1_projected_yield":31.29,
   "r1_aligned":0,
   "r1_error_rate":0,
   "r1_intensity_c1":5161,
   "r1_pct_gte_q30":83.4,
   "r2_yield":31.26,
   "r2_projected_yield":31.26,
   "r2_aligned":0,
   "r2_error_rate":0,
   "r2_intensity_c1":4289,
   "r2_pct_gte_q30":78.47,
   "lanes":[
      {
         "lane":1,
         "r1_tiles":72,
         "r1_density":306,
         "r1_density_sd":10,
         "r1_cluster_pf":78.39,
         "r1_cluster_pf_sd":5.62,
         "r1_phasing":0.185,
         "r1_prephasing":0.12,
         "r1_reads":66.23,
         "r1_reads_pf":51.97,
         "r1_pct_gte_q30":82.78,
         "r1_yield":7.79,
         "r1_cycles_error":0,
         "r1_aligned":0,
         "r1_aligned_sd":0,
         "r1_error":5363,
         "r1_error_sd":525,
         "r2_tiles":72,
         "r2_density":306,
         "r2_density_sd":10,
         "r2_cluster_pf":78.39,
         "r2_cluster_pf_sd":5.62,
         "r2_phasing":0.223,
         "r2_prephasing":0.147,
         "r2_reads":66.23,
         "r2_reads_pf":51.97,
         "r2_pct_gte_q30":78.23,
         "r2_yield":7.78,
         "r2_cycles_error":0,
         "r2_aligned":0,
         "r2_aligned_sd":0,
         "r2_error":4479,
         "r2_error_sd":579
      },

 ...

```