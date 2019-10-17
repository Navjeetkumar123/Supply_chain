function verificationController($scope, $rootScope, $location, $http, $window) {
	console.log("verificationController");

	$scope.verifyLogisticsDistributor=function(){
		console.log("In verifyLogisticsDistributor");
		var shipmentOrPalletID = $scope.shipmentOrPalletID;
		console.log(shipmentOrPalletID)
		var first2LettersOfShipmentOrPalletID = shipmentOrPalletID.substring(0, 1);
		console.log(first2LettersOfShipmentOrPalletID)
		var flag = false;
		if(first2LettersOfShipmentOrPalletID == '4'){
			$http.get('/getShipmentDetails/'+shipmentOrPalletID).success(function(shipmentData){
				console.log("getShipmentDetails");
				console.log(shipmentData.length)
				$scope.shipments = shipmentData;
				if($scope.shipments[0].status == '3'){ 
				$scope.shipments[0].status = 'In-Stores'
				}else if($scope.shipments[0].status == '2'){ 
				$scope.shipments[0].status = 'Processed By Distributor'
				}else if($scope.shipments[0].status == '1'){ 
				$scope.shipments[0].status = 'In-Transit'
				}
				if(shipmentData.length>0){
				flag = ValidateShipment(shipmentData, shipmentOrPalletID);
				if(!flag){
					$scope.shipments = [];
	  				bootbox.alert("Shipment not found.");
	  				
				}
				}else{alert(" ShipmentBarCode NotFound ");
				}
		    }).error(function(data) {
		    	console.log("Error while fetching Shipment details");
		    });
		}else if(first2LettersOfShipmentOrPalletID == '2'){
				
				console.log("fetching Pallet details")
				var flag;
				var shipmentID;
				var found = false;
				$http.get('/getPalletDetails/'+ shipmentOrPalletID).success(function(data){
						console.log("Fetching  Pallet Details");
						console.log(data);
						
				      
						$http.get('/getShipmentLogisticsFinalNEW').success(function(data) {

								console.log("In success of getShipmentLogisticsFinalNEW with data::" + data);
							   
								$scope.logisticsShipment = [];
								console.log("Data Cout = "+data.length);
								
								for (var i in data) {
														
									if (data[i].paletteArray.includes(shipmentOrPalletID)){
										found = true;
										  console.log("Shipment ID = "+data[i].shipmentBarCode+" paletteArray = "+data[i].paletteArray+" shipmentOrPalletID ="+shipmentOrPalletID);
										  shipmentID = data[i].shipmentBarCode;
										  console.log("ShipmentID Found  = "+shipmentID);
											  $http.get('/getShipmentDetails/'+shipmentID).success(function(shipmentData){
											   console.log("getShipmentDetails");
												console.log(shipmentData)
												$scope.shipments = shipmentData;
												console.log("$scope.shipments.status::"+$scope.shipments[0].status);
												console.log("$scope.shipments.status type::"+typeof $scope.shipments[0].status);
												if($scope.shipments[0].status == '3'){ 
													$scope.shipments[0].status = 'In-Stores'
												}else if($scope.shipments[0].status == '2'){ 
													$scope.shipments[0].status = 'Processed By Distributor'
												}else if($scope.shipments[0].status == '1'){ 
													$scope.shipments[0].status = 'In-Transit'
												}
												flag = ValidatePallet(shipmentData, shipmentOrPalletID);
												if(!flag){
													$scope.shipments = [];
													console.log("flag = "+flag);
													bootbox.alert("Pallet not found.");
													
												}
											 }).error(function(data) {
													console.log("Error while fetching Pallet details");
											});	
											
										break;
									}
									
									}
									if(!found){ alert("PalletBarCode NotFound ");
				                   }
									console.log($scope.logisticsShipment);
							}).error(function(data) {
								console.log("Error while calling getShipmentNEW");
							})
					 
			}).error(function(data) {
						console.log("Error while fetching Pallet details");
		   });
				

				function getShipmentCount(callback){
					$http.get('/getShipmentCount').success(function(data){
						console.log("Fetching Shipment count");
						console.log(data);
						callback(data)
					}).error(function(data) {
						console.log("Error while fetching Pallet details");
					});
				}
				
					
						
				
				
		}else if(first2LettersOfShipmentOrPalletID == '3'){
				
				console.log("fetching Product details")
				var flag;
				var found = false;
				var shipmentID;
				$http.get('/getProductDetailsCheck/'+ shipmentOrPalletID).success(function(data){
						console.log("Fetching  Pallet Details");
						console.log(data);
				      
						$http.get('/getShipmentLogisticsFinalNEW').success(function(data) {

								console.log("In success of getShipmentLogisticsFinalNEW with data::" + data);
							   
								$scope.logisticsShipment = [];
								console.log("Data Cout = "+data.length);
								
								for (var i in data) {
														
									if (data[i].productarray.includes(shipmentOrPalletID)){
										 found = true;
										  console.log("Shipment ID = "+data[i].shipmentBarCode+" product = "+data[i].productarray+" shipmentOrPalletID ="+shipmentOrPalletID);
										  shipmentID = data[i].shipmentBarCode;
										  console.log("ShipmentID Found  = "+shipmentID);
											  $http.get('/getShipmentDetails/'+shipmentID).success(function(shipmentData){
											   console.log("getShipmentDetails");
												console.log(shipmentData)
												$scope.shipments = shipmentData;
												if($scope.shipments[0].status == '3'){ 
													$scope.shipments[0].status = 'In-Stores'
												}else if($scope.shipments[0].status == '2'){ 
													$scope.shipments[0].status = 'Processed By Distributor'
												}else if($scope.shipments[0].status == '1'){ 
													$scope.shipments[0].status = 'In-Transit'
												}
												flag = ValidateProduct(shipmentData, shipmentOrPalletID);  
												if(!flag){
													$scope.shipments = [];
													bootbox.alert("product not found.");
													
												}
											 }).error(function(data) {
													console.log("Error while fetching Shipment details");
											});	
											
										break;
									}
									
									}
									if(!found){
									alert("ProductID Not Found ");
									}
									console.log($scope.logisticsShipment);
							}).error(function(data) {
								console.log("Error while calling getShipmentNEW");
							})
					
			}).error(function(data) {
						console.log("Error while fetching Pallet details");
		   });
				

				function getShipmentCount(callback){
					$http.get('/getShipmentCount').success(function(data){
						console.log("Fetching Shipment count");
						console.log(data);
						callback(data)
					}).error(function(data) {
						console.log("Error while fetching Pallet details");
					});
				}
				
					
						
				
				
		}else{
			alert("Invalid Shipment or Pallet ID. Please try again.");
		}
	}

	

	function ValidatePallet(shipmentData, shipmentOrPalletID){
		var pallet_weights = []
		var pallets = shipmentData[0].paletteArray.split(" : ");
		console.log(pallets+" length = "+pallets.length);
		var found = false;
		for (var i=0;i <= pallets.length;i++) {
			console.log(pallets[i])
  			if (pallets[i] == shipmentOrPalletID) {
				found = true;
  				console.log("Pallet Found")
  				$scope.shipments = shipmentData;
  				console.log($scope.shipments);
  				var ship_seq = shipmentData[0].shipmentSequence.split("-");
  				console.log(ship_seq);
  				pallet_weights.push(shipmentData[0].weight.split(" : "));
  				console.log(pallet_weights);
  				var trace_string = shipmentData[0].shipmenttrace.split(" |:| ");
  				console.log(trace_string);
  				var last_access_point = []
  				var trace_weight = []
  				var trace_pallet = []
  				for (var y = 0; y < trace_string.length ; y++) {
  					var trace =trace_string[y].split(" | ");
  					console.log(trace);
  					trace_pallet=trace[1].split(" : ");
  					trace_weight.push(trace[2].split(" : ")); 
  					last_access_point.push(trace[4]);
  				}
  				console.log(last_access_point);
  				console.log(trace_pallet);
  				console.log(trace_weight);
  				var match = true;
  				for(var j=0;j< last_access_point.length;j++) {
					//console.log(last_access_point[j])
					//console.log(trace_weight[j])
					console.log(last_access_point[j]+" , "+ship_seq[j]);
					if (last_access_point[j] != ship_seq[j]){
						console.log(last_access_point[j]+" , "+ship_seq[j]);
						document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Pallet tempered because Shipping sequence does not match with the Shipment sequence.</div>';
						match = false;
						break;
					}
					for (var x = 0; x < trace_weight.length ; x++) {
						for (var k=1;k< trace_weight.length-1;k++){
							console.log(trace_weight[x].toString());
							if (trace_weight[x].toString() != trace_weight[k].toString()){ 
								console.log(typeof trace_weight[x]);
								console.log("PALLET WEIGHT TAMPARED ");
								document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Shipment tempered because Pallet weight mismatch.</div>';
								match = false;
								break;
							}
						}
					}
				 	if(trace_pallet[j] != pallets[j]){
						console.log("PALLET COUNT TAMPARED ");
						document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Pallet tempered because number of pallets do not match with shipped pallets.</div>';
						match = false;
						break;
					}
					if (match == true) {
						
						console.log("authentic");
						document.getElementById("auth").innerHTML = '<div class="alert alert-success" role="alert">You are looking at an authentic, non-tampered Pallet.</div>';
					}
  				}
  				return true;
  			}else{
				
  			//	return false;
  			}
		}
		return false;
	}
	
	
	
	
	
	function ValidateShipment(shipmentData, shipmentOrPalletID){
		var pallet_weights = []
		 console.log(shipmentData);
         //console.log(shipmentData[0].paletteArray);
		
		if (shipmentData[0].shipmentBarCode == shipmentOrPalletID) {
			var pallets = shipmentData[0].paletteArray.split(" : ");
		
			console.log(pallets)
			console.log("Shipment Found")
			$scope.shipments = shipmentData;
			console.log($scope.shipments);
			var ship_seq = shipmentData[0].shipmentSequence.split("-");
			console.log(ship_seq);
			pallet_weights.push(shipmentData[0].weight);
			console.log(pallet_weights);
			var trace_string = shipmentData[0].shipmenttrace.split(" |:| ");
			console.log(trace_string);
			var last_access_point = []
			var trace_weight = []
			var trace_pallet = []
			for (var y = 0; y < trace_string.length ; y++) {
				var trace =trace_string[y].split(" | ");
			//	console.log(trace);
				trace_pallet=trace[1].split(" : ");
				last_access_point.push(trace[4]);
				trace_weight.push(trace[2].split(" : "));
							
			}
			console.log(last_access_point);
			console.log(trace_pallet);
			console.log(trace_weight);
			
			for(var j=0;j< last_access_point.length;j++) {
			console.log( last_access_point[j])
			console.log( ship_seq[j])
				if (last_access_point[j] != ship_seq[j]){
					console.log(last_access_point[j]+" && "+ship_seq[j]);
					document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Shipment tempered because Shipment did not follow the shipment sequence.</div>';
					break;
				}
				for (var x = 0; x < trace_weight.length ; x++) {
					for (var k=0;k< trace_weight.length;k++){
						
						if (trace_weight[x].toString() != trace_weight[k].toString()){
							console.log(typeof trace_weight[x].toString()+" && "+typeof trace_weight[k].toString());
							document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Shipment tempered because Pallet weight mismatch.</div>';
							break;
						}
					}
				}
				if(trace_pallet[j] != pallets[j]){
					document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Shipment tempered because number of pallets do not match with shipped pallets.</div>';
					break;
				}else if (last_access_point[j] == ship_seq[j] && trace_weight[j] == pallet_weights[j] && trace_pallet[j] == pallets[j] ) {
					
					document.getElementById("auth").innerHTML = '<div class="alert alert-success" role="alert">You are looking at an authentic, non-tampered Shipment.</div>';
				}
				
			}
			return true;
		}else{
			return false;
		}
		
	}
	
	
	
	
	function ValidateProduct(shipmentData, shipmentOrPalletID){
		console.log("Inside PRODUCT Verification ");
		var pallet_weights = []
		var pallets = shipmentData[0].paletteArray.split(" : ");
		console.log(pallets);
		for (var i=0;i < pallets.length;i++) {
			console.log(pallets[i])
  			
  				console.log("Pallet Found")
  				$scope.shipments = shipmentData;
  				console.log($scope.shipments);
  				var ship_seq = shipmentData[0].shipmentSequence.split("-");
  				console.log(ship_seq);
  				pallet_weights.push(shipmentData[0].weight.split(" : "));
  				console.log(pallet_weights);
  				var trace_string = shipmentData[0].shipmenttrace.split(" |:| ");
  				console.log(trace_string);
  				var last_access_point = []
  				var trace_weight = []
  				var trace_pallet = []
				var trace_product = []
  				for (var y = 0; y < trace_string.length ; y++) {
  					var trace =trace_string[y].split(" | ");
  					console.log(trace);
  					trace_pallet=trace[1].split(" : ");
  					trace_weight.push(trace[2].split(" : "));
  					last_access_point.push(trace[4]);
					trace_product = trace[5].split(" ||  ");
  				}
  				console.log(last_access_point);
  				console.log(trace_pallet);
  				console.log(trace_weight);
  				var match = true;
  				for(var j=0;j< last_access_point.length;j++) {
					//console.log(last_access_point[j])
					//console.log(trace_weight[j])
					if (last_access_point[j] != ship_seq[j]){
						document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Pallet tempered because Shipping sequence does not match with the Shipment sequence.</div>';
						match = false;
						break;
					}
					for (var x = 0; x < trace_weight.length ; x++) {
						for (var k=0;k< trace_weight.length;k++){
							if (trace_weight[x].toString() != trace_weight[k].toString()){
								console.log("PRODUCT PALLET WEIGHT TAMPARED ");
								document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Shipment tempered because Pallet weight mismatch.</div>';
								match = false;
								break;
							}
						}
					}
					for (var x = 0; x < trace_product.length ; x++) {
						
							console.log("Verification of Product "+trace_product[x].toString());
							if (!trace_product[x].toString().includes(shipmentOrPalletID)){
								console.log("PRODUCT TAMPARED ");
								document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Shipment tempered because Product Tampered.</div>';
								match = false;
								break;
							}
						
					}
				 	if(trace_pallet[j] != pallets[j]){
						document.getElementById("auth").innerHTML = '<div class="alert alert-danger" role="alert">Oops!! Pallet tempered because number of pallets do not match with shipped pallets.</div>';
						match = false;
						break;
					}else if (match ) {
					
						document.getElementById("auth").innerHTML = '<div class="alert alert-success" role="alert">You are looking at an authentic, non-tampered Product.</div>';
					}
  				}
  				return true;
  			
		}
	}
	
	
	
	
	
	
	
}