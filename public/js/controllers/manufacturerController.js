function manufacturerController($scope, $rootScope, $location, $http, $window) {
     var sender ;

    $http.get("/getUserName").success(function(data) {
        
        $scope.username = data.username;
        $scope.name = data.name;
        $scope.uniquePartInUserName = data.uniquePartInUserName;
        $scope.type = data.type;
    }).error(function(data) {
        
    });
	
	$(document).ready(function() {
        $("#update").click(function() {
            if ($('input:radio[name=yourPORadio]:checked').length == 0) {
                $('#myModal').modal('hide');
                bootbox.alert("Please select atleast one row.")
            } else {
                $('#myModal').modal('show');
            }
        });
    });
	

    $(document).ready(function() {
        $("#createProduct").click(function() {
            $("#createProductModal").modal();
        });
    });

    function adClass() {
        $('body').addClass('no-pad');
    }

    $(document).ready(function() {
        $("#createShipment").click(function() {
            $("#createShipmentModal").modal();
        });
    });

    $scope.selectRow = function(_x) {
        console.log("In selectRow with for manufacturer _x::" + _x);
        $scope.Bill = _x;
    }

    $scope.selectProduct = function(_x) {
        console.log(_x);
        console.log("selectProduct");
        $scope.product = _x;
        console.log($scope.product.materialIDs);
    }

    $scope.selectShipment = function(_x) {
        console.log("In selectShipment with _x::" + _x);
        $scope.selectdata = _x;
        console.log($scope.selectdata);
    }

    $scope.getShipmentDetails = function() {
        $http.get("/getShipmentDetails" + shipmentID).success(function(data) {
            $scope.shipmentDetails = data;
            console.log($scope.shipmentDetails);
        }).error(function(data) {
           // console.log("Error while calling getShipmentDetails");
        })
       // console.log("getShipmentDetails");
    }
	
	document.getElementById("shipmentBtn").disabled = false;

    $scope.createShipment = function() {
        if ($scope.palletArray != null && $scope.palletWeight != null && $scope.shipmentSequence != null && $scope.lastProcessingPoint != null) {
            console.log("createShipment")

        
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


      
            var request = {
                method: 'POST',
                url: '/createShipment',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }
            $http(request).success(function(data) {
                    bootbox.alert("Successfully created shipment. \n Transaction Hash is:" + data)
                    setTimeout(function() {
                        window.location.reload();
                    }, 5000);
                })
                .error(function() {
                    alert('Error in submitting the data. Please try again.');
                });
        } else {
            bootbox.alert("Please fill all the fields.");
        }
    }

    $scope.createProduct = function() {
        if ( $scope.productID!= null && $scope.productName != null && $scope.sellerName != null && $scope.sellerID != null && $scope.price != null && $scope.manufacturingLocation != null && $scope.manufacturingDate != null && $scope.manufacturingZipCode != null) 
        {
        console.log("In createProduct::")
        var fd = new FormData();
        fd.append('productID', productID);
        //fd.append('ProductBarcode', $scope.productBarcode);
        fd.append('ProductName', $scope.productName);
        //console.log("materialIdsString::" + materialIdsString);
        fd.append('sellerName', $scope.sellerName);
        fd.append('sellerID', $scope.sellerID);
        fd.append('price', $scope.price);
        fd.append('ManufacturingLocation', $scope.manufacturingLocation);
        fd.append('ManufacturingDate', $scope.manufacturingDate);
        fd.append('status', $scope.status);

        var request = {
            method: 'POST',
            url: '/createProduct',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }
        $http(request).success(function(data) {
                bootbox.alert("Successfully created product. \n Transaction Hash:: " + data)
                setTimeout(function() {
                    window.location.reload();
                }, 5000);
            })
            .error(function() {
                alert('Error in submitting the data. Please try again.');
            });
        }
        else{
            bootbox.alert("Please fill all the fields.");
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
    

    $http.get('/getShipmentNEW').success(function(data) {
           
     
        $scope.shipments = [];
		 var creater = sender.replace(/["\\]/g, "");
        for (var i in data) {
			
			
            if(data[i].createdBy == creater){
				console.log("SUCCESS");
			   if(data[i].status == 3){
				data[i].status = "In-store";
				$scope.shipments.push(data[i]);
				continue;
			  }else if(data[i].status == 2){
				data[i].status = "Processed By Distributor";
				$scope.shipments.push(data[i]);
				continue;
			}else if(data[i].status == 1){
				data[i].status = "In-Transit ";
				$scope.shipments.push(data[i]);
				continue;
			}
			else if(data[i].status == 0){
				data[i].status = "Shipment Created ";
				$scope.shipments.push(data[i]);
				continue;
			}
        }
		}
    }).error(function(data) {
        console.log("Error while calling getShipmentNEW");
    })

}
