function distributorController($scope, $rootScope, $location, $http, $window) {
    console.log("distributorController");

    var shipmentStatusCreated = "Shipment Created"
    var shipmentStatusInTransit = "In-Transit"
    var shipmentStatusProcessedByDist = "Processed By Distributor"
    var shipmentStatusInStores = "In-Stores"
   var sender ;
    $scope.updateShipment1 = function() {
        console.log("updateShipment");
    }
    var palletString ;
   
   $scope.selectPallet=function(_selectedPallet){
      
		console.log("Inside selectPallet");
		console.log(_selectedPallet); 
        // var temp = _selectedPallete.split(",");
        ///console.log("Temp = "+temp);
        palletString = _selectedPallet[0];
        $scope.productArray = '';
          var productDetails = "";
		  var prodcode = "";
        for(var i=0;i<_selectedPallet.length;i++){
			console.log( _selectedPallet[i]);
        $http.get("/getProductArray/" + _selectedPallet[i]).success(function(data) {
             prodcode = "";
            
            console.log("Successfully got ProductArray  " + data);
            for (var i in data) {
                var temp = JSON.parse(data[i]);
                  
                prodcode = prodcode + temp.productBarCode + ":";
            }
             console.log("ProductArray =" + prodcode)
			var prodcode = prodcode.substring(0, prodcode.length-1);
            productDetails = productDetails + prodcode + " || ";
			$scope.productArray = productDetails.substring(0, productDetails.length-4);
			  console.log("ProductArray UI =" + productDetails);
        }).error(function(data) {
            console.log("Error while calling productArrayList");
        })
		
		
        console.log("productDetails = " + productDetails);
        
        console.log("ProductArray =" + $scope.productArray)

		
    }
       for(var i=1;i<_selectedPallet.length;i++){
        palletString = palletString + " : "+ _selectedPallet[i] ;
       }
   // $scope.selectPalete = palletString;
    console.log("palletString = "+palletString);
}







    $scope.selectrow = function(_x){
       // console.log(_x);
        $scope.selectedData = _x;
        console.log($scope.selectedData);
        var temp = [];
        var Pallet = $scope.selectedData.paletteArray;
        var pCount = Pallet.split(" : ");
        $scope.count = pCount;
        console.log("Pcount = " + $scope.count);
        console.log("selectedData Pallet = " + $scope.selectedData.paletteArray);
      }

    $(document).ready(function() {
        $("#update").click(function() {
            if ($('input:radio[name=yourPORadio]:checked').length == 0) {
                $('#updateShipmentModel').modal('hide');
                bootbox.alert("Please select atleast one row.")
            } else {
                $('#updateShipmentModel').modal('show');
            }
        });
    });
$scope.shipmentProcessed = function(_x){
    $scope.processed = $.map(_x,function(e1){ return e1 });
    document.getElementById("p_traceString").innerHTML = $scope.processed[6].split(" |:| ").join("<br />");
    console.log(document.getElementById("p_traceString"))      
    console.log($scope.processed);
}

 $scope.updateShipment = function() {
        if ($scope.selectedData.last_process_point != null && $scope.selectedPallet != null) {
            console.log("updateShipment")
            var fd = new FormData();
            console.log($scope.productArray);
            console.log(palletString);
            console.log($scope.selectedData.weight);
            console.log($scope.selectedData.status);
            console.log($scope.selectedData.shipmentSequence);
            console.log($scope.selectedData.last_process_point);
            fd.append('shipmentID', $scope.selectedData.shipmentBarCode);
            fd.append('palletArray', palletString);
            fd.append('productArray', $scope.productArray);
            fd.append('palletWeight', $scope.selectedData.weight);
            fd.append('shipmentStatus', "Processed By Distributor");
            fd.append('shipmentsquence', $scope.selectedData.shipmentSequence);
            fd.append('lastProcessingPoint', $scope.selectedData.last_process_point);
            $scope.traceValue = new Date() + " | " + palletString + " | " + $scope.selectedData.weight + " | " + "Processed By Distributor" + " | " + $scope.selectedData.last_process_point+" | " +  $scope.productArray;
            fd.append('traceValue', $scope.traceValue);

            console.log($scope.traceValue);

            var request = {
                method: 'POST',
                url: '/updateShipment',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }
            $http(request).success(function(data) {
                bootbox.alert("Successfully Updated Shipment. \n Transaction Hash::" + data);
                setTimeout(function() {
                    window.location.reload();
                }, 5000);
            }).error(function(data) {
                console.log("Error while calling updateShipment");
            })
        } else {
            bootbox.alert("Please update last processing point.");
        }
    }
  
  
  
  
  





//get getProductArray new
	$scope.productArray1 = " ";
	 $scope.productArrayList = function(_x) {
		    console.log("productArrayList");
			$scope.productList=_x;
			console.log($scope.productList);
			var palletID = $scope.productList.split(" : ");
			console.log(" palletID Size ="+palletID);
			var products =" ";
			for(var i=0;i<palletID.length;i++){
				console.log("PalletID = "+palletID[i]);
        $http.get("/getProductArray/"+palletID[i]).success(function(data) {
			
            //var productArray = data.split(",");
           
					  data = data.replace(/["\\]/g, "");
					   console.log("Successfully got ProductArray  "+data );
			$scope.productArray1 = $scope.productArray1+data+" : ";
					
			console.log("ProductArray ="+products)
        }).error(function(data) {
            console.log("Error while calling productArrayList");
        })
			}
			
    
    }
	
	
	
	 $http.get('/getuser').success(function(data) {
        console.log("In success of getuser with data::");
        sender = data;
        console.log("data = "+sender)
       
         }).error(function(data) {
        console.log("Error while calling getuser");
    })
	
	
	
	
	$http.get('/getShipmentDistributorNEW').success(function(data) {

        console.log("In success of getShipmentDistributorNEW with data::" + data);
       
        $scope.logisticsShipment = [];
        console.log("Data Cout = "+data.length);
        for (var i in data) {
            if(data[i].status == 1){
                data[i].status = "In-Transit";
                $scope.logisticsShipment.push(data[i]);
            }

            }
            console.log($scope.logisticsShipment);
    }).error(function(data) {
        console.log("Error while calling getShipmentNEW");
    })
    
	
	
	
	
	$http.get('/getShipmentDistributorFinalNEW').success(function(data) {

        console.log("In success of getShipmentRetailerNEW with data::" + data);
       
        $scope.retailerShipment = [];
		var creater = sender.replace(/["\\]/g, "");
        console.log("Data Cout = "+data.length);
		if(sender){
        for (var i in data) {
            if(data[i].updatedBy==creater){
				 console.log("SUCCESS");
            if(data[i].status == 2){
                data[i].status = "Processed By Distributor";
                $scope.retailerShipment.push(data[i]);
            }
			 if(data[i].status == 3){
                data[i].status = "In-Stores";
                $scope.retailerShipment.push(data[i]);
            }
			}
            }
            console.log($scope.retailerShipment);
		}else{
			alert("Something went wrong!!! Please refresh");
		}
    }).error(function(data) {
        console.log("Error while calling getShipmentNEW");
    })
    

	
	document.getElementById("shipmentBtn").disabled = false; 
	$scope.selectWeight = function(_selectedWeight) {
		console.log("Inside selectWeight ");
		var palletSize = palletString.split(" : ");
		var weightSize = _selectedWeight.split(":");
		if(palletSize.length != weightSize.length){
			alert("Number of Pallets and Weights does not Match ");
			document.getElementById("shipmentBtn").disabled = true; 
		}else{
			document.getElementById("shipmentBtn").disabled = false; 
		}
	}
	

 

    
}