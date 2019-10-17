function logisticsController($scope, $rootScope, $location, $http, $window) {
    console.log("logisticsController");

    var shipmentStatusCreated = "Shipment Created"
    var shipmentStatusInTransit = "In-Transit"
    var shipmentStatusInStores = "In-Stores"
    var shipmentStatusProcessed = "Processed By Distributor"

    var palletString;
   var sender ;
    $scope.selectPallet = function(_selectedPallet) {
		
		
		console.log("Inside selectPallet");
		console.log(_selectedPallet); 
      
      
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
			$scope.productArray = productDetails.substring(0, productDetails.length-4);;
			  console.log("ProductArray UI =" + productDetails);
        }).error(function(data) {
            console.log("Error while calling productArrayList");
        })
		
		
        console.log("productDetails = " + productDetails);
        
        console.log("ProductArray =" + $scope.productArray)

		
    }
		
		
        console.log("In selectPallet with _selectedPallet::"+_selectedPallet);
       
        for (var i = 1; i < _selectedPallet.length; i++) {
            palletString = palletString + " : " + _selectedPallet[i];
        }
       
    }

    $scope.selectRow = function(_x) {
        console.log("In selectRow with _x::"+_x);
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
        console.log("In document.ready function");
        $("#update").click(function() {
            if ($('input:radio[name=logisticsShipmentRadio]:checked').length == 0) {
                $('#updateShipment').modal('hide');
                bootbox.alert("Please select atleast one row.")
            } else {
                $('#updateShipment').modal('show');
            }
        });
    });
    $scope.shipmentInTransit=function(_x){
        $scope.shipmentInTransit=_x;

    }

    $scope.updateShipment = function() {
        if ($scope.selectedData.last_process_point != null && palletString!= null) {
            console.log("updateShipment")
            var fd = new FormData();
            console.log($scope.selectedData.shipmentBarCode);
            console.log(palletString);
            console.log($scope.selectedData.weight);
            console.log($scope.selectedData.status);
            console.log($scope.selectedData.shipmentSequence);
            console.log($scope.selectedData.last_process_point);
			console.log($scope.productArray); 
            fd.append('shipmentID', $scope.selectedData.shipmentBarCode); 
            fd.append('palletArray', palletString);
            fd.append('productArray', $scope.productArray);
            fd.append('palletWeight', $scope.selectedData.weight);
            fd.append('shipmentStatus', shipmentStatusInTransit);
            fd.append('shipmentsquence', $scope.selectedData.shipmentSequence);
            fd.append('lastProcessingPoint', $scope.selectedData.last_process_point);
            $scope.traceValue = new Date() + " | " + palletString + " | " + $scope.selectedData.weight + " | " + shipmentStatusInTransit +  " | " + $scope.selectedData.last_process_point+" | " + $scope.productArray;
            fd.append('traceValue', $scope.traceValue);

            //   console.log($scope.shipmentSequence); 
            //   console.log($scope.lastProcessingPoint);
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
            bootbox.alert("Warning: Either pallet Array or last processing point fields is empty.");
        }
    }
  









	
	 // event filter for shipment
    $http.get('/getuser').success(function(data) {
        console.log("In success of getuser with data::");
        sender = data;
        console.log("data = "+sender)
       
         }).error(function(data) {
        console.log("Error while calling getuser");
    })

	 $http.get('/getShipmentLogisticsNEW').success(function(data) {

        $scope.shipments = [];
         for (var i in data) {
			if(data[i].status == 0){
				data[i].status = "Shipment Created";
				$scope.shipments.push(data[i]);
			}
            

			}
          //  console.log($scope.shipments);
    }).error(function(data) {
        console.log("Error while calling getShipmentNEW");
    })
	  



     $http.get('/getShipmentLogisticsFinalNEW').success(function(data) {

        console.log("In success of getShipmentDistributorNEW with data::" + data);
       
        $scope.logisticsShipment = [];
      //  console.log("Data Cout = "+data.length);
		console.log("sender = "+sender );
        if(sender){
    		var creater = sender.replace(/["\\]/g, "");
            for (var i in data) {
    			//console.log(data[i].updatedBy);
    			//console.log(creater);
                if(data[i].updatedBy==creater){
    				console.log("SUCCESS "+data[i].status);
                if(data[i].status == 3){
    				//console.log("-------3-------------")
                    data[i].status = "In-stores";
                    $scope.logisticsShipment.push(data[i]);
    				//continue;
                }else if(data[i].status == 2){
    				//console.log("-------2-------------")
                    data[i].status = "Processed By Distributor";
                    $scope.logisticsShipment.push(data[i]);
    				//continue;
                }else if(data[i].status == 1){
    				//console.log("-------1-------------")
                    data[i].status = "In-Transit";
                    $scope.logisticsShipment.push(data[i]);
    				//continue;
                }
    			}
            }
        }else{
			alert("Something went wrong!!! Please refresh");
		}
            console.log($scope.logisticsShipment);
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