function manufacturerController($scope, $rootScope, $location, $http, $window) {
    var rmStatusReady = "Ready"
    var rmStatusProcessed = "Processed"
    var rmStatusConsumed = "Consumed"

    var shipmentStatusCreated = "Shipment Created"
    var shipmentStatusInTransit = "In-Transit"
    var shipmentStatusInStores = "In-Stores"
    var shipmentStatusProcessed = "Processed By Distributor"

    var materialIdsString;
    var materialIdsStringForUpdate;
    var manufacturerShipmentIdentifier = "40000";
    var numOfShipments ;
    var manufacturerPalletIdentifier = "20000";
    var numOfPallets = 0;
    var manufacturerProductIdentifier = "30000";
    var numOfProducts = 0;
    var shipmentValToBeIncremented = 2;
    var palletCount = 0;
    var currentPalletBarCode = 0;
    var palletID = 0;
     var sender ;

    $scope.selectedProductMaterialIDs = function(_productMaterialIDs) {
       
        materialIdsString = _productMaterialIDs[0];
        for (var i = 1; i < _productMaterialIDs.length; i++) {
            materialIdsString = materialIdsString + "|" + _productMaterialIDs[i];
        }
        
    }

    $http.get("/getUserName").success(function(data) {
        
        $scope.username = data.username;
        $scope.name = data.name;
        $scope.uniquePartInUserName = data.uniquePartInUserName;
        $scope.type = data.type;
    }).error(function(data) {
        
    });

    $scope.selectedMaterialIDs = function(_productMaterialIDs) {
        console.log("In selectedMaterialIDs with _productMaterialIDs::"+_productMaterialIDs);
        materialIdsStringForUpdate = _productMaterialIDs[0];
        for (var i = 1; i < _productMaterialIDs.length; i++) {
            materialIdsStringForUpdate = materialIdsStringForUpdate + "|" + _productMaterialIDs[i];
        }
        console.log("materialIdsStringForUpdate="+materialIdsStringForUpdate);
    }
	
	 $scope.materialIDStatus = function() {
        var temp = materialIdsString.split('|');

        for (var i = 0; i < temp.length; i++) {
            
            var materialID = parseInt(temp[i]);
            $http.post('/updateBillsOfProduct/' + materialID).success(function(data) {
                    //console.log("In getProducts with typeof data:: "+ typeof data);
                    console.log("In SUCCESS updateMaterialIDStatus with data:: ");

                })
                .error(function() {
                    alert('Error in submitting the data for getProducts. Please try again.');
                });

        }


    }
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

    $scope.populateProductIDAndRMIds = function() {
        
        $scope.processedMaterialIDs = [];
        $http.get('/getBillsOfSupplyForManufacturer').success(function(data) {
            for (var i in data) {
                if (data[i].status == rmStatusProcessed) {
                    $scope.processedMaterialIDs.push(data[i]);
                }
            }
        }).error(function(data) {
           
        })
    }

    $scope.populateRmIdsForUpdate = function() {
       
        $scope.materialIDsToDisplay = [];
        $http.get('/getBillsOfSupplyForManufacturer').success(function(data) {
            for (var i in data) {
                if (data[i].status == rmStatusProcessed) {
                    $scope.materialIDsToDisplay.push(data[i]);
                    
                }
            }
        }).error(function(data) {
           // console.log("Error while calling getBillsOfSupplyForManufacturer in populateRmIdsForUpdate");
        })
    }
	
	
	 
	
	

$scope.palletArrayStatus = [];

$http.get('/getPalletCreated').success(function(data) {
			
           
                for (var i in data) {
                      if(data[i].pallet_status == 0){
                
                $scope.palletArrayStatus.push(data[i]);
                 
                      }
                            }
							
           
        }).error(function(data) {
           // console.log("Error while calling getPalletNEW");
        })
	    
        
		   
		$scope.palletStatusCheck = function(_x) { 
            document.getElementById("updateProduct").disabled = false;
            $scope.checkPalletStatus = _x;
            console.log($scope.checkPalletStatus);
            $http.get('/getShipmentNEW').success(function(data) {
                // console.log(data[i].paletteArray);
                console.log($scope.checkPalletStatus);
                for(var i in data){
                    console.log(parseInt(data[i].status));
                    // console.log($scope.checkPalletStatus);
                    if (data[i].paletteArray.includes($scope.checkPalletStatus) ){
                        document.getElementById("updateProduct").disabled = true;
                        alert("Already Shipped.")
						break;
                    }
                }

            })
        
 
    }


    $scope.populateShipmentID = function() {

        console.log("In function populateShipmentID::::")
        
		$http.get("/getShipmentCount").success(function(data) { // start
        
       $scope.numOfShipments = data.replace(/["\\]/g, "");
	   
	   
	  
		var numOfShipmentsVar = $scope.numOfShipments;
		//console.log(" ShipmentCount = "+ typeof numOfShipments);
		numOfShipmentsVarPlusOne = parseInt(numOfShipmentsVar) +1;
		
   
   
        $scope.palletArray = [];
       
        str = $scope.uniquePartInUserName;
        var num = parseInt(str.match(/\d+/), 10)
        manufacturerShipmentIdentifier = manufacturerShipmentIdentifier + num;
    
	    shipmentValToBeIncremented++;
		
        $scope.shipmentID = manufacturerShipmentIdentifier + numOfShipmentsVarPlusOne;
       

        //event filter to get palletID with status created
        $http.get('/getPalletCreated').success(function(data) {

           
           
			    for (var i in data) {
			          if(data[i].pallet_status == 0){
				
				$scope.palletArray.push(data[i]);
					  }
			                }
			  
           
        }).error(function(data) {
           
        })
		 }).error(function(data) {
       
    });

    }

    $http.get("/getPalletCount").success(function(data) { // start
       
        palletCount = data;
    }).error(function(data) {
        
    }); // end 

    $http.get("/getCurrentPalletBarcode").success(function(data) { // start
       
        currentPalletBarCode = data;
    }).error(function(data) {
       
    }); // end 

	$http.get("/getPalletSize").success(function(data) { // start
       
        $scope.currentPalletSize = parseInt(data);
		
    }).error(function(data) {
        //console.log("Error while calling getPalletSize");
    });
	
	
	
 
	
	 $scope.populateProductPallet = function() {

        console.log("In function populateProductPallet")
        str = $scope.uniquePartInUserName;
        var num = parseInt(str.match(/\d+/), 10)
        manufacturerPalletIdentifierVal = manufacturerPalletIdentifier + num;
        valToBeIncremented = parseInt(palletCount) + 1;
        palletID = manufacturerPalletIdentifierVal + valToBeIncremented;
        console.log(" New palletID = " + palletID);
		var latestnum ;
        if (palletCount > 0) {
            $http.get("/getPalletDetails/" + currentPalletBarCode).success(function(data) { // start
               // console.log("inside getProductSize = " + data);
				console.log("Fetching  Pallet Details");
				console.log(data);
				for (var i in data) {
					latestnum = data[i].productBarCode;
				}
				var currentProductsize = latestnum.substring(6, latestnum.length);
                console.log(currentProductsize);
                str = $scope.uniquePartInUserName;
                var num = parseInt(str.match(/\d+/), 10)
                manufacturerProductIdentifierVal = manufacturerProductIdentifier + num;
                if (currentProductsize == '') {
                    valToBeIncremented = 1;
                } else {
                    valToBeIncremented = parseInt(currentProductsize) + 1;
                }
                $scope.productBarcode = manufacturerProductIdentifierVal + valToBeIncremented;
                console.log(" New ProductID = " + $scope.productBarcode);
            }).error(function(data) {
                console.log("Error while calling getProductSize");
            }); // end 
        } else {
            manufacturerProductIdentifierVal = manufacturerProductIdentifier + num;
            $scope.productBarcode = manufacturerProductIdentifierVal + 1;
            console.log(" New ProductID = " + $scope.productBarcode);
        }
    }

  

    $scope.updatePallet = function() {
        console.log("updatePallet")
        var fd = new FormData();

        fd.append('palletsize', $scope.pallet);
        var request = {
            method: 'POST',
            url: '/updatePalletSize',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }
        $http(request).success(function(data) {
            bootbox.alert("Successfully updated products per pallet. Transaction hash is::" + data);
            setTimeout(function() {
                window.location.reload();
            }, 5000);
        }).error(function(data) {
            console.log("Error while calling updatePalletSize");
        })
    }

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


$scope.updateBill=function(){
      console.log("updateBill");     
      if ($scope.Bill.status != null) 
        {     
                var fd = new FormData();
                fd.append('billOfSupplyID', $scope.Bill.materialId);
                fd.append('name', $scope.Bill.name);
                fd.append('quantity', $scope.Bill.quantity);
                fd.append('origin', $scope.Bill.origin);
                fd.append('shippedTo', $scope.Bill.shippedTo)
                fd.append('status', $scope.Bill.status)
                fd.append('comments', $scope.Bill.comments)
              //  console.log($scope.Bill.status);

                var request = {
                    method: 'POST',
                    url: '/updateBill',
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }
                $http(request).success(function(data) {
                    bootbox.alert("Successfully updated bill of supply. Transaction hash is:" + data);
                    setTimeout(function() {
                        window.location.reload();
                    }, 5000);
                }).error(function() {
                    alert('Error in submitting the data. Please try again.');
                });
            }else{
                bootbox.alert("Please update status.")
            }
        }
    //     });
    // });

    $(document).ready(function() {
        $("#updateProduct").click(function() {
            if ($('input:radio[name=yourPORadio1]:checked').length == 0) {
                $('#updateProductModal').modal('hide');
                bootbox.alert("Please select atleast one row.")
            } else {
                $('#updateProductModal').modal('show');
            }
        });
    });

    $(document).ready(function() {
        $("#updateShipment").click(function() {
            if ($('input:radio[name=yourPORadio]:checked').length == 0) {
                $('#updateShipmentModal').modal('hide');
                bootbox.alert("Please select atleast one row.")
            } else {
                $('#updateShipmentModal').modal('show');
            }
        });
    });

    $http.get('/getBillsOfSupplyForManufacturer').success(function(data) {
       
        $scope.bills = [];
        for (var i in data) {
            data[i].comments = decodeURI(data[i].comments)

            $scope.bills.push(data[i]);
            $scope.bills[i].materialId = parseInt($scope.bills[i].materialId);
            
        }
    }).error(function(data) {
       // console.log("Error while calling getBillsOfSupplyForManufacturer");
    });

    $scope.getShipmentDetails = function() {
        $http.get("/getShipmentDetails" + shipmentID).success(function(data) {
            $scope.shipmentDetails = data;
            console.log($scope.shipmentDetails);
        }).error(function(data) {
           // console.log("Error while calling getShipmentDetails");
        })
       // console.log("getShipmentDetails");
    }

    var palletString;
  
    $scope.selectPalete = function(_selectedPallete) {
      
        palletString = _selectedPallete[0];
        $scope.productArray = '';
          var productDetails = "";
		  var prodcode = "";
        for(var i=0;i<_selectedPallete.length;i++){
			//console.log( _selectedPallete[i]);
        $http.get("/getProductArray/" + _selectedPallete[i]).success(function(data) {
             prodcode = "";
            
            //console.log("Successfully got ProductArray  " + data);
            for (var i in data) {
                var temp = JSON.parse(data[i]);
                    console.log(temp.productBarCode); 
                   
                    // console.log($scope.productArray)

                prodcode = prodcode + temp.productBarCode + ":";
            } 
             console.log("ProductArray =" + prodcode)
			var prodcode = prodcode.substring(0, prodcode.length-1);
            productDetails = productDetails + prodcode + " || "; 
			$scope.productArray = productDetails.substring(0, productDetails.length-4);;
			//  console.log("ProductArray UI =" + productDetails);
        }).error(function(data) {
            //console.log("Error while calling productArrayList");
        })
		
		
       
		
    }
        
        for (var i = 1; i < _selectedPallete.length; i++) {
            palletString = palletString + " : " + _selectedPallete[i];
        }
       
        console.log("palletString = " + palletString);
    }
	
	
	document.getElementById("shipmentBtn").disabled = false;
	$scope.selectWeight = function(_selectedWeight) {
		console.log("Inside selectWeight ");
		
		var palletSize = palletString.split(" : ");
		var weightSize = _selectedWeight.split(":");
		if(palletSize.length != weightSize.length){
			alert("Number of Pallets and Weights does not Match ");
			document.getElementById("shipmentBtn").disabled = true; 
		}else{ 	document.getElementById("shipmentBtn").disabled = false; 
		}
	}
	


    // for updating the Pallet Status
    $scope.updatePalletStatus = function() {
       console.log("palletString for update  = "+palletString);
        var temp = palletString.split(' : ');

        for (var i = 0; i < temp.length; i++) {
          console.log("palletString for update GOT = "+temp[i]);
            var palletBarCode = parseInt(temp[i]);
            $http.post('/updatePallet/' + palletBarCode).success(function(data) {
                   

                })
                .error(function() {
                    alert('Error in submitting the data for getProducts. Please try again.');
                });

        }


    }

    $scope.updateProduct = function() {
    console.log("update");
	console.log($scope.product.productName+" "+$scope.product.manufacturingLoc+" "+$scope.product.manufacturingDate+" "+$scope.product.manufacturingZipCode+" "+$scope.product.materialIDs);
        if ($scope.product.productName != null && $scope.product.manufacturingLoc != null && $scope.product.manufacturingDate != null && $scope.product.manufacturingZipCode != null && $scope.product.materialIDs != null) 
        {  
        var fd = new FormData();
        fd.append('ProductBarcode', $scope.product.productBarCode);
        fd.append('ProductName', $scope.product.productName);
        //console.log("In updateProduct with materialIdsStringForUpdate::"+materialIdsStringForUpdate);
        fd.append('MaterialIDs', $scope.product.materialIDs);
        
        console.log($scope.product.materialIDs);
        fd.append('ManufacturingLocation', $scope.product.manufacturingLoc);
        fd.append('ManufacturingDate', $scope.product.manufacturingDate);
        fd.append('ManufacturingZipCode', $scope.product.manufacturingZipCode);
        fd.append('PalatteBarcode', $scope.product.palletBarCode);
        var request = {
            method: 'POST',
            url: '/updateProduct',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }
        $http(request).success(function(data) {
            bootbox.alert("Successfully updated product. \n Transaction hash::" + data);
            setTimeout(function() {
                window.location.reload();
            }, 5000);
        }).error(function() {
            alert('Error in updating product. Please try again.');
        });
        } else {
            bootbox.alert("please fill all the fields.")
        }
    }


    $scope.createShipment = function() {
        if ($scope.palletArray != null && $scope.palletWeight != null && $scope.shipmentSequence != null && $scope.lastProcessingPoint != null) {
            console.log("createShipment")

            
            console.log("PALLET ARRAYY = " + palletString)
            var fd = new FormData();
            fd.append('shipmentID', $scope.shipmentID);
            fd.append('palletArray', palletString);
            fd.append('productArray', $scope.productArray);
            fd.append('palletWeight', $scope.palletWeight);
            fd.append('shipmentStatus', 0);
            fd.append('shipmentSequence', $scope.shipmentSequence);
            fd.append('lastProcessingPoint', $scope.lastProcessingPoint);
            $scope.traceValue = new Date() + " | " + palletString + " | " + $scope.palletWeight + " | " + shipmentStatusCreated +" | " + $scope.lastProcessingPoint+" | " + $scope.productArray;
            fd.append('traceValue', $scope.traceValue);

      
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

    $scope.updateShipment = function() {
        if ($scope.selectdata.last_process_point != null) {
            console.log("updateShipment")
            var fd = new FormData();
         
            fd.append('shipmentID', $scope.selectdata.shipmentBarCode);
            fd.append('palletArray', $scope.selectdata.paletteArray);
            fd.append('productArray', $scope.selectdata.productarray);
            fd.append('palletWeight', $scope.selectdata.weight);
            fd.append('shipmentStatus', "Shipment Created");
			fd.append('shipmentsquence', $scope.selectdata.shipmentSequence);
            fd.append('lastProcessingPoint', $scope.selectdata.last_process_point);
            $scope.traceValue = new Date() + " | " + $scope.selectdata.paletteArray + " | " + $scope.selectdata.weight + " | " + "Shipment Created" + " | " + $scope.selectdata.shipmentSequence + " | " + $scope.selectdata.last_process_point;
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

    $scope.createProduct = function() {
        if ( $scope.productMaterialIDs!= null && $scope.productName != null && $scope.manufacturingLocation != null && $scope.manufacturingDate != null && $scope.manufacturingZipCode != null) 
        {
        console.log("In createProduct::")
        var fd = new FormData();
        fd.append('PalletBarcode', palletID);
        fd.append('ProductBarcode', $scope.productBarcode);
        fd.append('ProductName', $scope.productName);
        console.log("materialIdsString::" + materialIdsString);
        fd.append('MaterialIDs', materialIdsString);

      
        fd.append('ManufacturingLocation', $scope.manufacturingLocation);
        fd.append('ManufacturingDate', $scope.manufacturingDate);
        fd.append('ManufacturingZipCode', $scope.manufacturingZipCode);

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
    $http.get('/getPalletNEW').success(function(data) {
		console.log(data);
        console.log("In success of getPalletNEW with data::"+ data);
        $scope.products = [];
        for (var i in data) {
            $scope.products.push(data[i]);
        }
        console.log($scope.products);
    }).error(function(data) {
        console.log("Error while calling getPalletNEW");
    })

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