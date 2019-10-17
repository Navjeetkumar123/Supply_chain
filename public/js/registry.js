var Web3 = require('web3');

var web3 = new Web3();

if(EthIP == null || EthIP.length === 0) { EthIP = "localhost"; }
if(EthRPCPort == null || EthRPCPort.length === 0) { EthRPCPort = "8080"; }

web3.setProvider(new web3.providers.HttpProvider("http://"+EthIP+":"+EthRPCPort));

// Create the contract source code

//var registrySource='contract Sequence { uint sequenceNo; function Sequence() { sequenceNo = 0; } function nextVal() returns (uint number) { return sequenceNo++; } } contract Registry is Sequence{ address public owner; uint _index; struct productDetails { string UID; address product_address; string QR_code; } mapping (uint => productDetails) public product_list; event add_product(address _address,string _uid,string _QR_code); function Registry(){ owner=msg.sender; } function getList(uint _index) returns (string _uid,address _address,string _QR_code){ return (product_list[_index].UID,product_list[_index].product_address,product_list[_index].QR_code); } function addProduct(string _uid,address _address,string _QR_code) returns(uint _length){ _index = nextVal(); product_list[_index].UID=_uid; product_list[_index].QR_code=_QR_code; product_list[_index].product_address=_address; add_product(_address,_uid,_QR_code); return _index; } function getLength() returns(uint){ return sequenceNo; } }';
//var registrySource='contract Registry{ address public owner; uint _index=0; struct productDetails { string UID; address product_address; string QR_code; } mapping (uint => productDetails) public product_list; event add_product(address _address,string _uid,string _QR_code); function Registry(){ owner=msg.sender; } function getList(uint _index) returns (string _uid,address _address,string _QR_code){ return (product_list[_index].UID,product_list[_index].product_address,product_list[_index].QR_code); } function addProduct(string _uid,address _address,string _QR_code) returns(uint){ _index++; product_list[_index].UID=_uid; product_list[_index].QR_code=_QR_code; product_list[_index].product_address=_address; add_product(_address,_uid,_QR_code); return _index; } function getLength() returns(uint){ return _index; } }';
//var registrySource='contract Registry{ address public owner; struct productDetails { string UID; address product_address; string QR_code; } uint numProducts; mapping (uint => productDetails) public product_list; event add_product(address _address,string _uid,string _QR_code); function Registry(){ owner=msg.sender; } function getList(uint _index) returns (string _uid,address _address,string _QR_code){ return (product_list[_index].UID,product_list[_index].product_address,product_list[_index].QR_code); } function addProduct(string _uid,address _address,string _QR_code) returns(uint _index){ _index=numProducts++; product_list[_index] = productDetails(_uid, _address, _QR_code); add_product(_address,_uid,_QR_code); return _index; } function getLength() returns(uint ){ return numProducts; } }';
//var registrySource='contract Registry{ address public owner; uint _index; struct productDetails { string UID; address product_address; string QR_code; } uint numProducts; mapping (uint => productDetails) public product_list; event add_product(address _address,string _uid,string _QR_code); function Registry(){ owner=msg.sender; } function getList(uint _index) returns (string _uid,address _address,string _QR_code){ return (product_list[_index].UID,product_list[_index].product_address,product_list[_index].QR_code); } function addProduct(string _uid,address _address,string _QR_code){ _index=numProducts++; product_list[_index] = productDetails(_uid, _address, _QR_code); add_product(_address,_uid,_QR_code); } function getLength() constant returns(uint ){ return numProducts; } }';
//var registrySource='contract Registry{ address public owner; uint _index; struct productDetails { string UID; address product_address; string QR_code; } productDetails[] public product_list; function Registry(){ owner=msg.sender; } function getProductList(uint index) public returns(string, address, string){ return (product_list[index].UID, product_list[index].product_address, product_list[index].QR_code); } function addProduct(string _uid,address _address,string _QR_code) public returns(uint) { product_list.length++; product_list[product_list.length-1].UID = _uid; product_list[product_list.length-1].product_address = _address; product_list[product_list.length-1].QR_code = _QR_code; return product_list.length; } function getProductCount() public constant returns(uint ){ return product_list.length; } }';


//var registrySource='contract Registry{ address public owner; uint _index; struct productDetails { string UID; address product_address; string QR_code; } productDetails[] public product_list; event add_product(string _uid,address _address,string _QR_code); function Registry(){ owner=msg.sender; } function getProductList(uint index) public constant returns(string, address, string){ return (product_list[index].UID, product_list[index].product_address, product_list[index].QR_code); } function addProduct(string _uid,address _address,string _QR_code) public returns(uint) { product_list.length++; product_list[product_list.length-1].UID = _uid; product_list[product_list.length-1].product_address = _address; product_list[product_list.length-1].QR_code = _QR_code; add_product(product_list[product_list.length-1].UID, product_list[product_list.length-1].product_address, product_list[product_list.length-1].QR_code); } function getProductCount() public constant returns(uint ){ return product_list.length; } }';
var registrySource='contract Registry{ address public owner; uint _index; struct productDetails { string UID; address product_address; string QR_code; } productDetails[] public product_list; function Registry(){ owner=msg.sender; } function getProductList(uint index) public constant returns(string, address, string){ return (product_list[index].UID, product_list[index].product_address, product_list[index].QR_code); } function getProductByQRcode(string _QR_code) public constant returns(address) { for(uint i=0;i<product_list.length;i++){ if(stringsEqual(product_list[i].QR_code,_QR_code)==true){ return (product_list[i].product_address); } } } function getProductByUID(string _uid) public constant returns(address) { for(uint i=0;i<product_list.length;i++){ if(stringsEqual(product_list[i].UID,_uid)==true){ return (product_list[i].product_address); } } } function stringsEqual(string storage _a, string memory _b) internal returns (bool) { bytes storage a = bytes(_a); bytes memory b = bytes(_b); if (a.length != b.length) return false; for (uint i = 0; i < a.length; i ++) if (a[i] != b[i]) return false; return true; } function addProduct(string _uid,address _address,string _QR_code){ product_list.length++; product_list[product_list.length-1].UID = _uid; product_list[product_list.length-1].product_address = _address; product_list[product_list.length-1].QR_code = _QR_code;} function getProductCount() public constant returns(uint ){ return product_list.length; } }';
var registryCompiled = web3.eth.compile.solidity(registrySource);

//get contract code

var registrycode=registryCompiled.Registry.code;

//get abi

var registryABI=registryCompiled.Registry.info.abiDefinition;

var registryContract = web3.eth.contract(registryABI);