// Requires
var express = require("express");
var Web3 = require('web3');
var web3 = new Web3();
var app = express();
var async = require('async');
var path = require('path');
// Configurations
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8080'));
var registryAddress = "0x1a9fc9c6826b419ccbb538d3b0c7d083e41ab389";
//app.set('json spaces', 4); //for pretty printing JSON

// Testing
//console.log(web3);

// Product contract and variables
var source = 'contract PnGProduct { address public owner; string public creator; string UID; string name; string stat; string desc; string mfg_date; string mfg_loc; string ship_seq = "Shipping sequence has not been initialized."; string last_process_point; string QR_code; string traceString; event updateShipment(string _stat, string _last_process_point, string _ship_seq, string _traceString); event updatePoint(string _stat, string _last_process_point, string _traceString); function PnGProduct(string uid, string _name, string _stat, string _desc, string _mfg_date, string _mfg_loc, string _last_process_point, string _QR_code, string _traceString) { owner = msg.sender; UID = uid; name = _name; stat = _stat; desc = _desc; mfg_date = _mfg_date; last_process_point = _last_process_point; mfg_loc = _mfg_loc; QR_code = _QR_code; creator=toAsciiString(owner); traceString = strConcat(_traceString," | ",creator); } function update_shipment(string _stat, string _last_process_point, string _ship_seq, string _traceString) { stat = _stat; last_process_point = _last_process_point; ship_seq = _ship_seq; creator=toAsciiString(msg.sender); _traceString = strConcat(_traceString," | ",creator); traceString = strConcat(traceString, "|:|", _traceString); updateShipment(stat, last_process_point, ship_seq, traceString); } function update_point(string _stat, string _last_process_point, string _traceString) { stat = _stat; last_process_point = _last_process_point; creator=toAsciiString(msg.sender); _traceString = strConcat(_traceString," | ",creator); traceString = strConcat(traceString, "|:|", _traceString); updatePoint(stat, last_process_point, traceString); } function displayTrace() constant returns(string) { return traceString; } function display1() constant returns(address, string, string, string, string) { return (owner, UID, name, stat, desc); } function display2() constant returns(string, string, string, string, string) { return (mfg_date, mfg_loc, ship_seq, last_process_point, QR_code); } function strConcat(string _a, string _c, string _b) internal returns(string) { bytes memory _ba = bytes(_a); bytes memory _bb = bytes(_b); bytes memory _bc = bytes(_c); string memory abc = new string(_ba.length + _bb.length + _bc.length); bytes memory babc = bytes(abc); uint k = 0; for (uint i = 0; i < _ba.length; i++) babc[k++] = _ba[i]; for (i = 0; i < _bc.length; i++) babc[k++] = _bc[i]; for (i = 0; i < _bb.length; i++) babc[k++] = _bb[i]; return string(babc); } function toAsciiString(address x) returns (string) { bytes memory s = new bytes(40); for (uint i = 0; i < 20; i++) { byte b = byte(uint8(uint(x) / (2**(8*(19 - i))))); byte hi = byte(uint8(b) / 16); byte lo = byte(uint8(b) - 16 * uint8(hi)); s[2*i] = char(hi); s[2*i+1] = char(lo); } string memory temp = string(s); temp = strConcat(" 0x",temp,""); return temp; } function char(byte b) returns (byte c) { if (b < 10) return byte(uint8(b) + 0x30); else return byte(uint8(b) + 0x57); } }';
var contractCompiled = web3.eth.compile.solidity(source);
var productCode = contractCompiled.PnGProduct.code;
var productABI = contractCompiled.PnGProduct.info.abiDefinition;
var productContract = web3.eth.contract(productABI);

// Registry contract and variables
var registrySource='contract Registry{ address public owner; uint _index; struct productDetails { string UID; address product_address; string QR_code; } productDetails[] public product_list; function Registry(){ owner=msg.sender; } function getProductList(uint index) public constant returns(string, address, string){ return (product_list[index].UID, product_list[index].product_address, product_list[index].QR_code); } function getProductByQRcode(string _QR_code) public constant returns(address) { for(uint i=0;i<product_list.length;i++){ if(stringsEqual(product_list[i].QR_code,_QR_code)==true){ return (product_list[i].product_address); } } } function getProductByUID(string _uid) public constant returns(address) { for(uint i=0;i<product_list.length;i++){ if(stringsEqual(product_list[i].UID,_uid)==true){ return (product_list[i].product_address); } } } function stringsEqual(string storage _a, string memory _b) internal returns (bool) { bytes storage a = bytes(_a); bytes memory b = bytes(_b); if (a.length != b.length) return false; for (uint i = 0; i < a.length; i ++) if (a[i] != b[i]) return false; return true; } function addProduct(string _uid,address _address,string _QR_code){ product_list.length++; product_list[product_list.length-1].UID = _uid; product_list[product_list.length-1].product_address = _address; product_list[product_list.length-1].QR_code = _QR_code;} function getProductCount() public constant returns(uint ){ return product_list.length; } }';
var registryCompiled = web3.eth.compile.solidity(registrySource);
var registrycode=registryCompiled.Registry.code;
var registryABI=registryCompiled.Registry.info.abiDefinition;
var registryContract = web3.eth.contract(registryABI);


app.use(express.static(path.join(__dirname, 'public')));

app.get("/api", function(req, res) {
    res.setHeader('Content-Type', 'application/json');
        res.json({
            status:"error",
			message:"Please re-evaluate the API expression."
        });
 });
 app.get("/api/qrcode", function(req, res) {
    res.setHeader('Content-Type', 'application/json');
        res.json({
            status:"error",
			message:"Please re-evaluate the API expression."
        });
 });
 app.get("/api/uid", function(req, res) {
    res.setHeader('Content-Type', 'application/json');
        res.json({
            status:"error",
			message:"Please re-evaluate the API expression."
        });
 });
 
 app.get("/api/qrcode/:qr_code", function(req, res) {
	var productAddressByQRcode = registryContract.at(registryAddress).getProductByQRcode(req.params.qr_code);
	if(productAddressByQRcode != '0x0000000000000000000000000000000000000000'){
		console.log(productAddressByQRcode)
		var result1 = productContract.at(productAddressByQRcode).display1();
		var result2 = productContract.at(productAddressByQRcode).display2();
		var traceFetch = productContract.at(productAddressByQRcode).displayTrace();
		console.log(traceFetch)
		var brokenTrace = traceFetch.split('|:|');
		console.log(traceFetch)
		var shipSeqBorken = result2[2].split('-');
		for (var i = 0; i < brokenTrace.length; i++) {
                brokenTrace[i] = brokenTrace[i].split(' | ');
        }
		var flag = null;
		if(result1[3] == "In Stores"){
			flag = true;
            for(var i=0; i<shipSeqBorken.length ;i++ ){
				console.log(brokenTrace[i][2] +" "+ shipSeqBorken[i]);
                if(brokenTrace[i+1][2] != shipSeqBorken[i]){
                    flag= false;
                }
            }
            if(flag){
                messageVal = "You are looking at an authentic, non-tampered P&G Product";
            }else{
                messageVal = "Oops!! Your product might be tampered. Please contact Store Manager";
                
            }
		}else{
			messageVal = "Product has not reached the shipping destination";
		}
		res.setHeader('Content-Type', 'application/json');
			res.json({
				status:"success",
				authenticity: flag,
				message: messageVal,
				data: {
					address : productAddressByQRcode,
					owner : result1[0],
					uid : result1[1],
					name : result1[2],
					status : result1[3],
					description : result1[4],
					mfg_date : new Date(parseInt(result2[0])),
					mfg_loc : result2[1],
					ship_seq : result2[2],
					last_process_point : result2[3],
					QR_code_at : result2[4],
					trace: brokenTrace
				}
			});
	}else{
		res.setHeader('Content-Type', 'application/json');
			res.json({
				status:"error",
				message:"QR code not found."
			});
	}
 });
 app.get("/api/uid/:uid", function(req, res) {
    var productAddressByUID = registryContract.at(registryAddress).getProductByUID(req.params.uid);
	if(productAddressByUID != '0x0000000000000000000000000000000000000000'){
		console.log(productAddressByUID)
		var result1 = productContract.at(productAddressByUID).display1();
		var result2 = productContract.at(productAddressByUID).display2();
		var traceFetch = productContract.at(productAddressByUID).displayTrace();
		var brokenTrace = traceFetch.split('|:|');
		var shipSeqBorken = result2[2].split('-');
		for (var i = 0; i < brokenTrace.length; i++) {
                brokenTrace[i] = brokenTrace[i].split(' | ');
		}
        var flag = null;
		if(result1[3] == "In Stores"){
			flag = true;
            for(var i=0; i<shipSeqBorken.length ;i++ ){
				//console.log(brokenTrace[i][2] +" "+ shipSeqBorken[i]);
                if(brokenTrace[i+1][2] != shipSeqBorken[i]){
                    flag= false;
                }
            }
            if(flag){
                messageVal = "You are looking at an authentic, non-tampered P&G Product";
            }else{
                messageVal = "Oops!! Your product might be tampered. Please contact Store Manager";
                
            }
		}else{
			messageVal = "Product has not reached the shipping destination";
		}
		res.setHeader('Content-Type', 'application/json');
			res.json({
				status:"success",
				authenticity: flag,
				message: messageVal,
				data: {
					address : productAddressByUID,
					owner : result1[0],
					uid : result1[1],
					name : result1[2],
					status : result1[3],
					description : result1[4],
					mfg_date : new Date(parseInt(result2[0])),
					mfg_loc : result2[1],
					ship_seq : result2[2],
					last_process_point : result2[3],
					QR_code_at : result2[4],
					trace: brokenTrace
				}
			});
	}else{
		res.setHeader('Content-Type', 'application/json');
			res.json({
				status:"error",
				message:"UID not found."
			});
	}
 });
 
 // Server
 var port = process.env.PORT || 80;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });