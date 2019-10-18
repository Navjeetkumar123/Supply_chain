function retailerController($scope,$rootScope,$location,$http,$window){
            console.log("retailerController");
         	 var shipmentStatusCreated = "Shipment Created"
             var shipmentStatusInTransit = "In-Transit"
             var shipmentStatusInStores = "In-Stores"
			 var shipmentStatusProcessed = "Processed By Distributor"

    
         var sender ;
 var palletString ;
	  
	  
	  
      $(document).ready(function() {
      $("#update").click(function() {
          if ($('input:radio[name=yourPORadio]:checked').length == 0) {
              $('#updateShipment').modal('hide');
              bootbox.alert("Please select atleast one row.");
          } else {
              $('#updateShipment').modal('show');
          }
      });
  });
      $scope.shipmentProcessed = function(_x){
        console.log("shipmentProcessed");
        $scope.processed = _x
        console.log($scope.processed);
      } 
	  
   $scope.createPO = function() {
        if ($scope.selectedData.last_process_point != null && $scope.selectedData.weight != null && $scope.selectedPallete != null) {
            console.log("createPO")
            var fd = new FormData();
            fd.append('poID', poID);
            fd.append('productID', productID);
            fd.append('productName', $scope.productName);
            //console.log("materialIdsString::" + materialIdsString);
            fd.append('sellerName', $scope.sellerName);
            fd.append('sellerID', $scope.sellerID);
            fd.append('buyerName', $scope.sellerName);
            fd.append('buyerID', $scope.sellerID);
            fd.append('logisticsID', $scope.logisticsID);
            fd.append('logisticsName', $scope.logisticsName);
            fd.append('noOfItem', $scope.noOfItem);
            fd.append('price', $scope.price);
            fd.append('totalPrice', $scope.totalPrice);
            fd.append('orderDate', $scope.orderDate);
            fd.append('manufacturingLocation', $scope.manufacturingLocation);
            fd.append('manufacturingDate', $scope.manufacturingDate);
            fd.append('deliveryAddress', $scope.deliveryAddress);
            fd.append('deliverDate', $scope.deliverDate);
            fd.append('status', $scope.status);


            //   console.log($scope.shipmentSequence);
            //   console.log($scope.lastProcessingPoint);
            console.log($scope.traceValue);

            var request = {
                method: 'POST',
                url: '/createPO',
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
                console.log("Error while calling createPO");
            })
        } else {
            bootbox.alert("Wanrning: Fields are empty.");
        }
    }


	
	 $http.get('/getuser').success(function(data) {
        console.log("In success of getuser with data::");
        sender = data;
        console.log("data = "+sender)
       
         }).error(function(data) {
        console.log("Error while calling getuser");
    })
	
	$http.get('/getShipmentRetailerNEW').success(function(data) {

        console.log("In success of getShipmentRetailerNEW with data::" + data);
       
        $scope.retailerShipment = [];
        console.log("Data Cout = "+data.length);
        for (var i in data) {
            
            if(data[i].status == 2){
                data[i].status = "Processed By Distributor";
                $scope.retailerShipment.push(data[i]);
            }

            }
            console.log($scope.retailerShipment);
    }).error(function(data) {
        console.log("Error while calling getShipmentNEW");
    })
	
	
	
	
	$http.get('/getShipmentRetailerFinal').success(function(data) {

        console.log("In success of getShipmentRetailerFinal with data::" + data);
       
        $scope.retailerStore = [];
		var creater = sender.replace(/["\\]/g, "");
        console.log("Data Cout = "+data.length);
		 console.log("Before = "+creater); 
		 if(sender){
        for (var i in data) {  
            if(data[i].updatedBy==creater){
				 console.log("SUCCESS");   
            if(data[i].status == 3){
                data[i].status = "In-Store";
                $scope.retailerStore.push(data[i]);
            }
			}
            }
            console.log($scope.retailerStore);
		 }else{
			alert("Something went wrong!!! Please refresh");
		}
    }).error(function(data) {
        console.log("Error while calling getShipmentNEW");
    })
	
	
	
	
	$scope.selectWeight = function(_selectedWeight) {
		console.log("Inside selectWeight ");
		var palletSize = palletString.split(" : ");
		var weightSize = _selectedWeight.split(":");
		if(palletSize.length != weightSize.length){
			alert("Number of Pallets and Weights does not Match ");
			document.getElementById("shipmentBtn").disabled = true; 
		}else{
			document.getElementById("shipmentBtn").enable = true; 
		}
	}
	
	

    
  }    
