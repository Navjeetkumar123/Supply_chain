module.exports= function(app) {

	// Create the contract source code RawMaterial
    abiDefinitionRM = JSON.parse(variables.ShipmentContractJSON);
    abiDefinitionPallet = JSON.parse(variables.PalletContractJSON);

	ShipmentContract = web3.eth.contract(abiDefinitionRM);
    PalletContract = web3.eth.contract(abiDefinitionPallet);
	// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
	contractInstanceShipment = ShipmentContract.at(variables.ShipmentContractAddress);

    productAndPalletInstance = PalletContract.at(variables.PalletContractAddress);

    var sender = variables.sender_logistics;
    var pass = variables.pass_logistics;

	
	app.get("/getShipmentLogisticsNEW", multipartMiddleware, function(req, res, next) {
        console.log('In method /getShipmentNEW');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
		
       
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var shipments = [];
         contractInstanceShipmentManagement.ManageShipmentEvent({
            
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
            data = result;
			 for(var i in data) {
              
				
				outerRec = data[i].args; 
                var ShipmentID = outerRec.shipmentBarCode;
				
                var latestBlockNum = outerRec.blockNum;
				
                var found = false;
                for(var i = 0; i < shipments.length; i++) {
					 if (shipments[i].shipmentBarCode.toString() == ShipmentID.toString()) {
						found = true;
                        break;
                    }
                }
			
                if(!found){
                    latestObj = outerRec;
					
                    for (var j in data) {
                       eachRec = data[j].args;
						
                        if(eachRec.shipmentBarCode.toString() == ShipmentID.toString()){
						 
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                            	
                          	}
                        }
                    }     
                    shipments.push(latestObj);
                }
            }
           return res.json(shipments);
        }); 
    });
	
	
	
	  
	
	
	app.get("/getShipmentLogisticsFinalNEW", multipartMiddleware, function(req, res, next) {
        console.log('In method /getShipmentLogisticsFinalNEW');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
		//console.log(" sender  = "+ variables['sender_'+req.session.unique_part]);
       
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var shipments = [];
         contractInstanceShipmentManagement.ManageShipmentEvent({
              
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
         
            data = result;
			
            for(var i in data) {
               
				
				outerRec = data[i].args; 
                var ShipmentID = outerRec.shipmentBarCode;
				
                var latestBlockNum = outerRec.blockNum;
			
                var found = false;
                for(var i = 0; i < shipments.length; i++) {
					
                    if (shipments[i].shipmentBarCode.toString() == ShipmentID.toString()) {
						
                        found = true;
                        break;
                    }
                }
				
                if(!found){
                    latestObj = outerRec;
				
                    for (var j in data) {
                        
					    eachRec = data[j].args;
					
                        if(eachRec.shipmentBarCode.toString() == ShipmentID.toString()){
						 
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                            
                          	}
                        }
                    }     
                   
                    shipments.push(latestObj);
                }
            }
           
            return res.json(shipments);
        }); 
    });
	
	
	
	
	
	
	
	/// Varification
	
	
	app.get("/getShipmentDetails/:_shipmentID", multipartMiddleware, function(req, res, next) {
        console.log('In method /getShipmentDetails');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
		
       var shipmentID = parseInt(req.params._shipmentID);
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var shipments = [];
         contractInstanceShipmentManagement.ManageShipmentEvent({
               shipmentBarCode: shipmentID
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
         
            data = result;
			
            for(var i in data) {
               
				
				outerRec = data[i].args; 
                var ShipmentID = outerRec.shipmentBarCode;
			
                var latestBlockNum = outerRec.blockNum;
				
                var found = false;
                for(var i = 0; i < shipments.length; i++) {
					
                    if (shipments[i].shipmentBarCode.toString() == ShipmentID.toString()) {
					
                        found = true;
                        break;
                    }
                }
			
                if(!found){
                    latestObj = outerRec;
					
                    for (var j in data) {
                      
					    eachRec = data[j].args;
						
                        if(eachRec.shipmentBarCode.toString() == ShipmentID.toString()){
						 
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                            	
                          	}
                        }
                    }     
                  
                    shipments.push(latestObj);
                }
            }
          
            return res.json(shipments);
        }); 
    });
	
	app.get("/getPalletDetails/:_palletID", multipartMiddleware, function(req, res, next) {
        console.log('In method /getPalletDetails');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
        var palletBarCodeID = parseInt(req.params._palletID);
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var palletList = [];
        contractInstancePalletManagement.ManageProductAndPalletEvent({
                 palletBarCode: palletBarCodeID
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
            console.log("result is::"+result);
           data = result;
		    for(var i in data) {
               
				outerRec = data[i].args; 
                var PalletID = outerRec.palletBarCode;
				
                var latestBlockNum = outerRec.blockNum;
				 var found = false;
                for(var i = 0; i < palletList.length; i++) {
				     if (palletList[i].palletBarCode.toString() == PalletID.toString()) {
				
                        found = true;
                        break;
                    }
                }
			    if(!found){
                    latestObj = outerRec;
				     for (var j in data) {
                       eachRec = data[j].args;
					      if(eachRec.palletBarCode.toString() == PalletID.toString()){
						 	
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                          	}
                        }
                    }     
                    palletList.push(latestObj);
                }
            }
           return res.json(palletList);
        }); 
    });
	
	
	
	
	app.get("/getProductDetailsCheck/:_palletID", multipartMiddleware, function(req, res, next) {
        console.log('In method /getProductDetailsCheck');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
        var productBarCodeID = parseInt(req.params._palletID);
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var palletList = [];
        contractInstancePalletManagement.ManageProductAndPalletEvent({
                 productBarCode: productBarCodeID
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
            console.log("result is::"+result);
            data = result;
		     for(var i in data) {
               outerRec = data[i].args; 
                var ProductID = outerRec.productBarCode;
			   var latestBlockNum = outerRec.blockNum;
				 var found = false;
                for(var i = 0; i < palletList.length; i++) {
			      if (palletList[i].productBarCode.toString() == ProductID.toString()) {
				        found = true;
                        break;
                    }
                }
			     if(!found){
                    latestObj = outerRec;
				      for (var j in data) {
                  	    eachRec = data[j].args;
					     if(eachRec.productBarCode.toString() == ProductID.toString()){
						 	
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                          	}
                        }
                    }     
                    palletList.push(latestObj);
                }
            }
           return res.json(palletList);
        }); 
    });
	

}