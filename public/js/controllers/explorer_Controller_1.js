function explorerController1($scope, $rootScope, $location, $http, $window) {
    console.log("explorerController");

    var Web3 = require('web3');
    var web3 = new Web3();
    if(EthIP == null || EthIP.length === 0) { EthIP = "13.126.92.200"; }
    if(EthRPCPort == null || EthRPCPort.length === 0) { EthRPCPort = "8080"; }
    web3.setProvider(new web3.providers.HttpProvider("http://"+EthIP+":"+EthRPCPort));
   

 

var block = web3.eth.blockNumber;
 var trancount = 0;
 for(i=0;i<block;i++){
    temp =  web3.eth.getBlockTransactionCount(i);
   trancount = trancount+temp;
 }
 $scope.totalTransaction = trancount;
console.log($scope.totalTransaction);

var date = new Date();
$scope.timestamp = date.toLocaleString('en-GB');
console.log($scope.timestamp);

var blockpending = web3.eth.getBlock('pending').number
$scope.pendingBlock = blockpending
console.log($scope.pendingBlock);

$scope.submit=function()
                {
                    console.log("submit");
                   var fd = new FormData(); 
                   fd.append('totalTransaction',$scope.totalTransaction);
                   fd.append('pendingBlock',$scope.pendingBlock);
                   fd.append('timestamp',$scope.timestamp);
                   console.log($scope.totalTransaction);
                   console.log($scope.pendingBlock);
                   console.log($scope.timestamp);
                   var request = 
                {
                    method: 'POST',
                    url: '/explorerApi',
                    data: fd,
                     //transfrom request is very necesssary if using express
                     transformRequest: angular.identity,
                     headers: {
                        'Content-Type': undefined
                                }
                };
                console.log(request);

                $http(request)
                    .success(function(data)
                    {
                        alert('You information was successfully submitted.');
                        //console.log('data updated successfully');
                        //$location.url("/");

                    })
                    .error(function()
                    {
                        alert('Error in submitting the data. Please try again.');
                        //console.log('data was not updated successfully');
                        //$location.url("/profile");
                    }); 
                    
                    
               }
for(i=0;i<block;i++){

web3.eth.filter("pending").watch(

    function(error,result){
      //console.log("abcddd");
        if (!error) {
            console.log(result);
        }
    }
)
}
    
}