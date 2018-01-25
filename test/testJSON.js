//first make a csv summary file of 130417_M00146_0021_000000000-A2WDF test run and save it under: illumina-report/test/summaryData.csv
//this run is a NextSeq test run

'use strict';

process.env.NODE_ENV = 'test';

const fs = require('fs');
const JSON = require('JSON');

const chai = require('chai');
const expect = chai.expect;
const makeJson = require('../getMetrics');
const miseqPath = './test/miseqSummaryData.csv';
const nextseqPath = './test/nextseqSummaryData.csv';

describe('convert illumina output to json', () => {
  // checks that the test is properly set up: the illumina summary file is present withing the test directory
  before('illumina file present', done => {
    const summary = fs.readFileSync('./test/miseqSummaryData.csv', 'utf8');
    expect(summary).to.not.be.empty;
    expect(fs.existsSync(nextseqPath)).to.be.true;
    done();
  });
  // using parseInt on a blank field, or one that contains letters will result in a null value
  it('no null fields', async () => {
    const summary = fs.readFileSync(miseqPath, 'utf8');
    const csvAsCells = await makeJson.readCsv(summary);
    const summaryObject = await makeJson.makeObject(csvAsCells);
    const jsonString = JSON.stringify(summaryObject);
    expect(jsonString.indexOf('null')).to.equal(-1);
  });
  // MiSeq information is correct
  it('MiSeq summary information matches', async function() {
    const summary = fs.readFileSync(miseqPath, 'utf8');
    const csvAsCells = await makeJson.readCsv(summary);
    const summaryObject = await makeJson.makeObject(csvAsCells);
    expect(summaryObject).to.have.property(
      'run_name',
      '130417_M00146_0021_000000000-A2WDF'
    );
    expect(summaryObject).to.have.property('r1_yield', 1.2);
    expect(summaryObject).to.have.property('r1_projected_yield', 1.2);
    expect(summaryObject).to.have.property('r1_aligned', 0);
    expect(summaryObject).to.have.property('r1_error_rate', 'n/a');
    expect(summaryObject).to.have.property('r1_intensity_c1', 201);
    expect(summaryObject).to.have.property('r1_pct_gte_q30', 95.59);
    expect(summaryObject).to.have.property('r2_yield', 1.2);
    expect(summaryObject['lanes']).to.have.all.keys('1'); // only one lane
    expect(summaryObject['lanes']['1']).to.have.property('r1_phasing', 0.145);
    expect(summaryObject['lanes']['1']).to.have.property('r2_phasing', 0.191);
    expect(summaryObject['lanes']['1']).to.have.property('r1_prephasing', 0.17);
    expect(summaryObject['lanes']['1']).to.have.property(
      'r2_prephasing',
      0.453
    );
    expect(summaryObject['lanes']['1']).to.have.property('r2_reads', 10.76);
    expect(summaryObject['lanes']['1']).to.have.property('r2_yield', 1.2);
    expect(summaryObject['lanes']['1']).to.have.property(
      'r2_intensity_c1_sd',
      33
    );
  });
  // NextSeq information is correct
  it('NextSeq summary information matches', async function() {
    const summary = fs.readFileSync(nextseqPath, 'utf8');
    const csvAsCells = await makeJson.readCsv(summary);
    const summaryObject = await makeJson.makeObject(csvAsCells);
    expect(summaryObject).to.have.property(
      'run_name',
      '150312_NS500507_0027_AH2KJ5AFXX'
    );
    expect(summaryObject).to.have.property('r1_yield', 31.29);
    expect(summaryObject).to.have.property('r2_projected_yield', 1.46);
    expect(summaryObject).to.have.property('r3_aligned', 0);
    expect(summaryObject).to.have.property('r4_intensity_c1', 4289);
    expect(summaryObject).to.have.property('total_pct_gte_q30', 81.46);
    expect(summaryObject['lanes']).to.have.all.keys(['1', '2', '3', '4']);
    expect(summaryObject['lanes']['1']).to.have.property('r1_density', 306);
    expect(summaryObject['lanes']['1']).to.have.property('r2_density_sd', 10);
    expect(summaryObject['lanes']['1']).to.have.property(
      'r3_cluster_pf',
      78.39
    );
    expect(summaryObject['lanes']['1']).to.have.property(
      'r4_cluster_pf_sd',
      5.62
    );
    expect(summaryObject['lanes']['1']).to.have.property(
      'r1_pct_gte_q30',
      82.78
    );
    expect(summaryObject['lanes']['1']).to.have.property('r2_yield', 0.36);
    expect(summaryObject['lanes']['1']).to.have.property(
      'r3_intensity_c1',
      2953
    );
    expect(summaryObject['lanes']['1']).to.have.property(
      'r4_intensity_c1_sd',
      579
    );
  });
});
