  var EthIP = null;
  var EthRPCPort = null;
  var latest = 0;
  var prev = 0;
  var total = 0;
function explorerController($scope, $rootScope, $location, $http, $window) {
    console.log("explorerController");

    var Web3 = require('web3');
    var web3 = new Web3();
	
	  $http.get("/getHostIP").success(function(data) {
		  console.log("Host Data = "+data);
		   data = data.replace(/["\\]/g, "");
		   console.log(data);
		  var Host = data.split(",");
		  EthIP = Host[0];
		  EthRPCPort = Host[1];
		  console.log("EthIP = "+EthIP);
		   console.log("EthRPCPort = "+EthRPCPort);
		   
		    console.log("EthIP = "+EthIP);
		   console.log("EthRPCPort = "+EthRPCPort);
		  
    if(EthIP == null || EthIP.length === 0) { EthIP = "localhost"; }
    if(EthRPCPort == null || EthRPCPort.length === 0) { EthRPCPort = "8080"; }
	console.log("URL = "+"http://"+EthIP+":"+EthRPCPort);
    web3.setProvider(new web3.providers.HttpProvider("http://"+EthIP+":"+EthRPCPort));
   
    total = web3.eth.blockNumber;
    
    console.log(total);
    var blockArray = [];
   
	var temp =0;
	 for (var i = total; i > total-10; i--) {
      
        if (i<total+1 && i > -1) {
            var block = web3.eth.getBlock(i);
            block.blockNum = i;
            var tempDiff = "" + block.difficulty;
            block.difficulty = tempDiff.replace(/["\\]/g, "");
            
            var date = new  Date(block.timestamp * 1000);
            block.timestamp = date.toLocaleString('en-GB');
            
            blockArray.push(block);
			temp = i;
            //console.log("block details::::::::::"+block)
        }
    }
	latest = temp;
	prev = total;
	console.log(" Latest = "+latest);
    $scope.blockDetails = blockArray;

    $scope.displayBCVdetails = function(blockDetail) {
        console.log("In displayBCVdetails::" + blockDetail.blockNum)
        var block = web3.eth.getBlock(blockDetail.blockNum);
        console.log("block details::" + block)

        $scope.singleBlockDetails = block;
        $scope.gasUsed = $scope.singleBlockDetails.gasUsed;
        console.log($scope.singleBlockDetails);
        var tempDifficulty = "" + $scope.singleBlockDetails.difficulty;
        $scope.singleBlockDetails.difficulty = tempDifficulty.replace(/["\\]/g, "");
            
        if($scope.singleBlockDetails.timestamp){
            var date = new  Date($scope.singleBlockDetails.timestamp * 1000);
            $scope.singleBlockDetails.timestamp = date.toLocaleString('en-GB');
        }   
        //console.log("timestamp::"+$scope.singleBlockDetails.timestamp)

        $scope.transactionsArray = [];
        for (var i = 0; i < block.transactions.length; i++) {

            var transaction = web3.eth.getTransaction(block.transactions[i]);
            transaction.value = web3.fromWei(transaction.value, "ether") 
            var tempTransVal = "" + transaction.value;
            console.log(tempTransVal);
            transaction.value = tempTransVal.replace(/["\\]/g, "");
            
            $scope.transactionsArray.push(transaction);

        }
    }
	 

	 //next btn
	  $scope.view1=function() {
		  blockArray = [];
		  console.log("Inside view  ");
		 var temp1 = 0; 
		 var last = latest-10;
		  console.log("Latest = "+latest+" && "+last);
		  for (var i = latest; i > last && i!=0; i--) {
      console.log(i);
        if (i<total+1 && i > -1) {
            var block = web3.eth.getBlock(i);
            block.blockNum = i;
            var tempDiff = "" + block.difficulty;
            block.difficulty = tempDiff.replace(/["\\]/g, "");
            
            var date = new  Date(block.timestamp * 1000);
            block.timestamp = date.toLocaleString('en-GB');
            
            blockArray.push(block);
			temp1 = i;
			  console.log("i::::::::::"+i)
            console.log("block details::::::::::"+block)
        }
	
    }
	prev=latest;
	latest = temp1;
	
	console.log("latest = "+latest+"prev = "+prev);
    $scope.blockDetails = blockArray;

    $scope.displayBCVdetails = function(blockDetail) {
        console.log("In displayBCVdetails::" + blockDetail.blockNum)
        var block = web3.eth.getBlock(blockDetail.blockNum);
        console.log("block details::" + block)

        $scope.singleBlockDetails = block;
        $scope.gasUsed = $scope.singleBlockDetails.gasUsed;
        console.log($scope.singleBlockDetails);
        var tempDifficulty = "" + $scope.singleBlockDetails.difficulty;
        $scope.singleBlockDetails.difficulty = tempDifficulty.replace(/["\\]/g, "");
            
        if($scope.singleBlockDetails.timestamp){
            var date = new  Date($scope.singleBlockDetails.timestamp * 1000);
            $scope.singleBlockDetails.timestamp = date.toLocaleString('en-GB');
        }   
        //console.log("timestamp::"+$scope.singleBlockDetails.timestamp)

        $scope.transactionsArray = [];
        for (var i = 0; i < block.transactions.length; i++) {

            var transaction = web3.eth.getTransaction(block.transactions[i]);
            transaction.value = web3.fromWei(transaction.value, "ether") 
            var tempTransVal = "" + transaction.value;
            console.log(tempTransVal);
            transaction.value = tempTransVal.replace(/["\\]/g, "");
            
            $scope.transactionsArray.push(transaction);

        }
      }
	 
 }
 
$scope.previous = function() { 
  blockArray = [];
		  console.log("Inside previous  ");
		 var temp2 = 0; 
		 var last = prev;
		  console.log("prev = "+prev+" && "+last);
		  for (var i = last; i < prev+10 && i!=0; i++) {
          console.log(i);
        if (i < total && i > 0) {
            var block = web3.eth.getBlock(i);
            block.blockNum = i;
            var tempDiff = "" + block.difficulty;
            block.difficulty = tempDiff.replace(/["\\]/g, "");
            
            var date = new  Date(block.timestamp * 1000);
            block.timestamp = date.toLocaleString('en-GB');
            
            blockArray.push(block);
			temp2 = i;
			  console.log("i::::::::::"+i)
            console.log("block details::::::::::"+block)
        }
	
    }
	latest = prev;
	prev = temp2;
	
	
	
	
	
	console.log("latest = "+latest+"prev = "+prev);
    $scope.blockDetails = blockArray;

    $scope.displayBCVdetails = function(blockDetail) {
        console.log("In displayBCVdetails::" + blockDetail.blockNum)
        var block = web3.eth.getBlock(blockDetail.blockNum);
        console.log("block details::" + block)

        $scope.singleBlockDetails = block;
        $scope.gasUsed = $scope.singleBlockDetails.gasUsed;
        console.log($scope.singleBlockDetails);
        var tempDifficulty = "" + $scope.singleBlockDetails.difficulty;
        $scope.singleBlockDetails.difficulty = tempDifficulty.replace(/["\\]/g, "");
            
        if($scope.singleBlockDetails.timestamp){
            var date = new  Date($scope.singleBlockDetails.timestamp * 1000);
            $scope.singleBlockDetails.timestamp = date.toLocaleString('en-GB');
        }   
        //console.log("timestamp::"+$scope.singleBlockDetails.timestamp)

        $scope.transactionsArray = [];
        for (var i = 0; i < block.transactions.length; i++) {

            var transaction = web3.eth.getTransaction(block.transactions[i]);
            transaction.value = web3.fromWei(transaction.value, "ether") 
            var tempTransVal = "" + transaction.value;
            console.log(tempTransVal);
            transaction.value = tempTransVal.replace(/["\\]/g, "");
            
            $scope.transactionsArray.push(transaction);

        }
      }

}
	 
	 
		  
  
    }).error(function(data) {
        console.log("Error in getHostIP");
    });
	
	 
	 
	 
	 
	 
	 
	 
	 

    $scope.viewExplorer = function() {
        console.log($scope.type);
        if ($scope.type == "supplier") {
            $location.url('/supplier');
        }
        if ($scope.type == "manufacturer") {
            $location.url("manufacturer.html");
        }
        if ($scope.type == "logistics") {
            $location.url("/logistics");
        }
        if ($scope.type == "distributor") {
            $location.url("/distributor");
        }
        if ($scope.type == "retailer") {
            $location.url("/retailer");
        }
    }
    $scope.scrollWin = function(){
        window.scrollBy(0, 1000); 
    }
    
}