
  var EthIP = null;
  var EthRPCPort = null;
  	var URL;

function transactionController($scope, $rootScope, $location, $http, $window) {
    console.log("transactionController");

        var Web3 = require('web3');  
        var web3 = new Web3();
	
	 
	  $http.get("/getHostIP").success(function(data) {
		  console.log("Host Data = "+data);
		   data = data.replace(/["\\]/g, "");
		   console.log(data);
		  var Host = data.split(",");
		  EthIP = Host[0];
		  EthRPCPort = Host[1];
		  URL = "http://" + EthIP + ":" + EthRPCPort;
		  console.log("URL = "+URL);
		  console.log("EthIP = "+EthIP);
		   console.log("EthRPCPort = "+EthRPCPort);
		   
		   console.log("EthIP  = "+EthIP);
		console.log("EthRPCPort = "+EthRPCPort);
		 console.log("URL  out = "+URL);
   
        if (EthIP == null || EthIP.length === 0) {
            EthIP = "localhost";
        }
        if (EthRPCPort == null || EthRPCPort.length === 0) {
            EthRPCPort = "8545";
        }
		console.log("http://" + EthIP + ":" + EthRPCPort);
        web3.setProvider(new web3.providers.HttpProvider("http://" + EthIP + ":" + EthRPCPort));
        var receipt;

        $scope.view=function() {
            console.log("view");
            var transHash = document.getElementById('trans_hash').value;
            console.log(transHash);
            web3.eth.getTransactionReceipt(transHash, function(err, result) {
                if (err) {  
                    console.error(err);
                    alert("Invalid Transaction Hash. Please Retry.")
                    return;
                } else if (result) {
                    receipt = result;
                    console.log(receipt);
                    document.getElementById('display_receipt').innerText = JSON.stringify(receipt, null, 4);
                }
            });
        }
		   
		  
  
    }).error(function(data) {
        console.log("Error in getHostIP");
    });
	
	
	
		
		
  


}

