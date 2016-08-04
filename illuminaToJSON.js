//input: illumina Summary data, run name

var data = process.argv[2];
var run = process.argv[3];

if (data!==undefined) {	
	var read = data.split("Read ");
	var mid = parseInt(read.length/2);
	var read1 = read[mid+1].split("\n");
	var read2 = read[read.length-1].split("\n");

	var obj = {};
	obj["run_name"]=run;
	obj["r1_yield"]=parseFloat(read[1].substring(11,18));
	obj["r1_projected_yield"]=parseFloat(read[1].substring(27,34));
	obj["r1_aligned"]=parseFloat(read[1].substring(43,48));
	obj["r1_error_rate"]=parseFloat(read[1].substring(59,64));
	obj["r1_intensity_c1"]=parseFloat(read[1].substring(75,80));
	obj["r1_pct_gte_q30"]=parseFloat(read[1].substring(91,97));

	obj["r2_yield"]=parseFloat(read[mid].substring(11,18));
	obj["r2_projected_yield"]=parseFloat(read[mid].substring(27,34));
	obj["r2_aligned"]=parseFloat(read[mid].substring(43,48));
	obj["r2_error_rate"]=parseFloat(read[mid].substring(59,64));
	obj["r2_intensity_c1"]=parseFloat(read[mid].substring(75,80));
	obj["r2_pct_gte_q30"]=parseFloat(read[mid].substring(91,97));

	var lanes = [];
	var index;
	for (i=2; i<read1.length-1;i++) {
		lanes[i-2]={};
		lanes[i-2]["lane"]= parseFloat(read1[i].substring(0,2));
		lanes[i-2]["r1_tiles"]= parseFloat(read1[i].substring(17,21));
		index = read1[i].indexOf("+",33);
		lanes[i-2]["r1_density"]= parseFloat(read1[i].substring(33,index-1));
		lanes[i-2]["r1_density_sd"]= parseFloat(read1[i].substring(index+4, index+7));
		index = read1[i].indexOf("+",49);
		lanes[i-2]["r1_cluster_pf"]= parseFloat(read1[i].substring(49,index-1));
		lanes[i-2]["r1_cluster_pf_sd"]= parseFloat(read1[i].substring(index+4, index+9));
		lanes[i-2]["r1_phasing"]= parseFloat(read1[i].substring(65,71));
		lanes[i-2]["r1_prephasing"]= parseFloat(read1[i].substring(73,79));
		lanes[i-2]["r1_reads"]= parseFloat(read1[i].substring(81,88));
		lanes[i-2]["r1_reads_pf"]= parseFloat(read1[i].substring(97,104));
		lanes[i-2]["r1_pct_gte_q30"]= parseFloat(read1[i].substring(113,119));
		lanes[i-2]["r1_yield"]= parseFloat(read1[i].substring(129,135));
		lanes[i-2]["r1_cycles_error"]= parseFloat(read1[i].substring(145,149));
		index = read1[i].indexOf("+",161);
		lanes[i-2]["r1_aligned"]= parseFloat(read1[i].substring(161,index-1));
		lanes[i-2]["r1_aligned_sd"]= parseFloat(read1[i].substring(index+4, index+9));
		index = read1[i].indexOf("+",177);
		lanes[i-2]["r1_error"]= parseFloat(read1[i].substring(177,index-1));
		lanes[i-2]["r1_error_sd"]= parseFloat(read1[i].substring(index+4, index+9));
		index = read1[i].indexOf("+",241);
		lanes[i-2]["r1_error"]= parseFloat(read1[i].substring(241,index-1));
		lanes[i-2]["r1_error_sd"]= parseFloat(read1[i].substring(index+4, index+8));

		lanes[i-2]["r2_tiles"]= parseFloat(read2[i].substring(17,21));
		index = read2[i].indexOf("+",33);
		lanes[i-2]["r2_density"]= parseFloat(read2[i].substring(33,index-1));
		lanes[i-2]["r2_density_sd"]= parseFloat(read2[i].substring(index+4, index+7));
		index = read2[i].indexOf("+",49);
		lanes[i-2]["r2_cluster_pf"]= parseFloat(read2[i].substring(49,index-1));
		lanes[i-2]["r2_cluster_pf_sd"]= parseFloat(read2[i].substring(index+4, index+9));
		lanes[i-2]["r2_phasing"]= parseFloat(read2[i].substring(65,71));
		lanes[i-2]["r2_prephasing"]= parseFloat(read2[i].substring(73,79));
		lanes[i-2]["r2_reads"]= parseFloat(read2[i].substring(81,88));
		lanes[i-2]["r2_reads_pf"]= parseFloat(read2[i].substring(97,104));
		lanes[i-2]["r2_pct_gte_q30"]= parseFloat(read2[i].substring(113,119));
		lanes[i-2]["r2_yield"]= parseFloat(read2[i].substring(129,135));
		lanes[i-2]["r2_cycles_error"]= parseFloat(read2[i].substring(145,149));
		index = read2[i].indexOf("+",161);
		lanes[i-2]["r2_aligned"]= parseFloat(read2[i].substring(161,index-1));
		lanes[i-2]["r2_aligned_sd"]= parseFloat(read2[i].substring(index+4, index+9));
		index = read2[i].indexOf("+",177);
		lanes[i-2]["r2_error"]= parseFloat(read2[i].substring(177,index-1));
		lanes[i-2]["r2_error_sd"]= parseFloat(read2[i].substring(index+4, index+9));
		index = read2[i].indexOf("+",241);
		lanes[i-2]["r2_error"]= parseFloat(read2[i].substring(241,index-1));
		lanes[i-2]["r2_error_sd"]= parseFloat(read2[i].substring(index+4, index+8));

	}
	obj["lanes"]=lanes;
	console.log(JSON.stringify(obj));
} else {
	console.error("no file provided");
}