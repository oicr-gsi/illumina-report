//input: illumina Summary data, run name
var JSON = require('JSON');

var dataVar = process.argv[2];
var runVar = process.argv[3];

if (typeof data!=='undefined') {
	makeObject(dataVar, runVar, function(obj) {
		var jsonString = JSON.stringify(obj);
		console.log(jsonString);
		if (jsonString.indexOf("null")!= -1) {
			console.error("Error: json contains null field");
		}
	});
} else {
	console.error("no file provided");
}

function makeObject(data, run, callback) {
	var read = []
	read[0]=data.split("Read ");
	var mid = parseInt(read[0].length/2);
	read[1] = read[0][mid+1].split("\n");
	read[2] = read[0][read[0].length-1].split("\n");
	var obj = {};
	obj["run_name"]=run;

	obj["r1_yield"]=parseFloat(read[0][1].substring(11,18));
	obj["r1_projected_yield"]=parseFloat(read[0][1].substring(27,34));
	obj["r1_aligned"]=parseFloat(read[0][1].substring(43,48));
	obj["r1_error_rate"]=parseFloat(read[0][1].substring(59,64));
	obj["r1_intensity_c1"]=parseFloat(read[0][1].substring(75,80));
	obj["r1_pct_gte_q30"]=parseFloat(read[0][1].substring(91,97));

	obj["r2_yield"]=parseFloat(read[0][mid].substring(11,18));
	obj["r2_projected_yield"]=parseFloat(read[0][mid].substring(27,34));
	obj["r2_aligned"]=parseFloat(read[0][mid].substring(43,48));
	obj["r2_error_rate"]=parseFloat(read[0][mid].substring(59,64));
	obj["r2_intensity_c1"]=parseFloat(read[0][mid].substring(75,80));
	obj["r2_pct_gte_q30"]=parseFloat(read[0][mid].substring(91,97));

	var lanes = [];
	var index;
	for (i=2; i<read[1].length-1;i++) {
		lanes[i-2]={};
		lanes[i-2]["lane"]= parseFloat(read[1][i].substring(0,2));

		for (j=1; j<=2;j++) {
			lanes[i-2]["r"+j+"_tiles"]= parseFloat(read[j][i].substring(17,21));
			index = read[j][i].indexOf("+",33);
			lanes[i-2]["r"+j+"_density"]= parseFloat(read[j][i].substring(33,index-1));
			lanes[i-2]["r"+j+"_density_sd"]= parseFloat(read[j][i].substring(index+4, index+7));
			index = read[j][i].indexOf("+",49);
			lanes[i-2]["r"+j+"_cluster_pf"]= parseFloat(read[j][i].substring(49,index-1));
			lanes[i-2]["r"+j+"_cluster_pf_sd"]= parseFloat(read[j][i].substring(index+4, index+9));
			lanes[i-2]["r"+j+"_phasing"]= parseFloat(read[j][i].substring(65,71));
			lanes[i-2]["r"+j+"_prephasing"]= parseFloat(read[j][i].substring(73,79));
			lanes[i-2]["r"+j+"_reads"]= parseFloat(read[j][i].substring(81,88));
			lanes[i-2]["r"+j+"_reads_pf"]= parseFloat(read[j][i].substring(97,104));
			lanes[i-2]["r"+j+"_pct_gte_q30"]= parseFloat(read[j][i].substring(113,119));
			lanes[i-2]["r"+j+"_yield"]= parseFloat(read[j][i].substring(129,135));
			lanes[i-2]["r"+j+"_cycles_error"]= parseFloat(read[j][i].substring(145,149));
			index = read[j][i].indexOf("+",161);
			lanes[i-2]["r"+j+"_aligned"]= parseFloat(read[j][i].substring(161,index-1));
			lanes[i-2]["r"+j+"_aligned_sd"]= parseFloat(read[j][i].substring(index+4, index+9));
			index = read[j][i].indexOf("+",177);
			lanes[i-2]["r"+j+"_error"]= parseFloat(read[j][i].substring(177,index-1));
			lanes[i-2]["r"+j+"_error_sd"]= parseFloat(read[j][i].substring(index+4, index+9));
			index = read[j][i].indexOf("+",193);
			lanes[i-2]["r"+j+"_error_35"]= parseFloat(read[j][i].substring(193,index-1));
			lanes[i-2]["r"+j+"_error_35sd"]= parseFloat(read[j][i].substring(index+4, index+9));
			index = read[j][i].indexOf("+",209);
			lanes[i-2]["r"+j+"_error_75"]= parseFloat(read[j][i].substring(209,index-1));
			lanes[i-2]["r"+j+"_error_75_sd"]= parseFloat(read[j][i].substring(index+4, index+9));
			index = read[j][i].indexOf("+",225);
			lanes[i-2]["r"+j+"_error_100"]= parseFloat(read[j][i].substring(225,index-1));
			lanes[i-2]["r"+j+"_error_100_sd"]= parseFloat(read[j][i].substring(index+4, index+9));
			index = read[j][i].indexOf("+",241);
			lanes[i-2]["r"+j+"_intensity_c1"]= parseFloat(read[j][i].substring(241,index-1));
			lanes[i-2]["r"+j+"_intensity_c1_sd"]= parseFloat(read[j][i].substring(index+4, index+8));
		}
	}
	obj["lanes"]=lanes;
	return callback(obj);
}
exports.makeObject=makeObject;