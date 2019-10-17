module.exports = function(app) {

    // Create the contract source code pallet
    abiDefinitionPallet = JSON.parse(variables.PalletContractJSON);

    PalletContract = web3.eth.contract(abiDefinitionPallet);
    // In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
    contractInstancePalletManagement = PalletContract.at(variables.PalletContractAddress);

    // Create the contract source code shipment
    abiDefinitionSH = JSON.parse(variables.ShipmentContractJSON);

    SHContract = web3.eth.contract(abiDefinitionSH);
    // In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
    contractInstanceShipmentManagement = SHContract.at(variables.ShipmentContractAddress);

    // function to create Product
    app.post("/createProduct", multipartMiddleware, function(req, res, next) {
        console.log('In crud::createProduct::::::'); 
        var timeStamp = Date.now();
        var palletID = parseInt(req.body.PalletBarcode);
		var ProductBarcode = parseInt(req.body.ProductBarcode);
        var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
      
        var traceValue = new Date() + " | " + req.body.shipmentStatus + " | " + req.body.lastProcessingPoint;
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender,pass , 6000);
        }
        contractInstancePalletManagement.ManageProductAndPalletEvent({
            some: 'args'
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch(function(error, result) {
            console.log("create_product() event listener output ->  " + JSON.stringify(result.args));
        });
        console.log("Before contractInstancePalletManagement.createProduct");
        console.log(palletID, ProductBarcode, ProductBarcode, req.body.MaterialIDs, req.body.ManufacturingLocation, req.body.ManufacturingDate, req.body.ManufacturingZipCode);
        contractInstancePalletManagement.createProduct(palletID, ProductBarcode, req.body.ProductName, req.body.MaterialIDs, req.body.ManufacturingLocation, req.body.ManufacturingDate, req.body.ManufacturingZipCode, {
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call createProduct:::::::::");
                console.error(e);
                return;
                // callback fires twice, we only want the second call when the contract is deployed
            } else if (result) {
                console.log('Successfully created Product.');
                console.log('Transaction hash : ' + result);
                res.json(result)
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });
    });

    app.post("/updatePalletSize", multipartMiddleware, function(req, res, next) {
        console.log('In crud::updatePalletSize::::::');
        var timeStamp = Date.now();
	    
        var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
        var pass = variables['pass_'+req.session.unique_part];
      
        console.log("unique part = "+req.session.unique_part);
       
		var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        console.log("Before contractInstancePalletManagement.updatePalletSize");
        contractInstancePalletManagement.updatePalletSize(req.body.palletsize, {
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call updatePalletSize:::::::::");
                console.error(e);
                return;
                // callback fires twice, we only want the second call when the contract is deployed
            } else if (result) {
                console.log('Successfully updated pallet size.');
                console.log('Transaction hash : ' + result);
                res.json(result)
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });
    });

    // function to Update Product
    app.post("/updateProduct", multipartMiddleware, function(req, res, next) {
        console.log('In crud::updateProduct::::::');
        var timeStamp = Date.now();
        var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        contractInstancePalletManagement.ManageProductAndPalletEvent({
            some: 'args'
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch(function(error, result) {
            console.log("update_product() event listener output ->  " + JSON.stringify(result.args));
        });
        console.log("Before contractInstancePalletManagement.updateProduct");
		palletBarcode = parseInt(req.body.PalatteBarcode);
		productBarCode =  parseInt(req.body.ProductBarcode);
        //console.log(req.body.ProductBarcode, req.body.ProductName, req.body.MaterialIDs, req.body.ManufacturingLocation, req.body.ManufacturingDate, req.body.ManufacturingZipCode);
        contractInstancePalletManagement.updateProduct(palletBarcode,productBarCode, req.body.ProductName, req.body.MaterialIDs, req.body.ManufacturingLocation, req.body.ManufacturingDate, req.body.ManufacturingZipCode, {
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call updateproduct:::::::::");
                console.error(e);
                return;
                // callback fires twice, we only want the second call when the contract is deployed
            } else if (result) {
                console.log('Successfully UPDATED Product.');
                console.log('Transaction hash : ' + result);
                res.json(result)

            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });
    });

	//newly added
	//function to Updating the Pallet
	 
    app.post("/updatePallet/:_palletID", multipartMiddleware, function(req, res, next) {
        console.log('In crud::updatePallet::::::');
        var timeStamp = Date.now();
		 var palletId = req.params._palletID;
		  console.log(" sender = "+ variables['sender_'+req.session.unique_part]);
          console.log(" pass = "+ variables['pass_'+req.session.unique_part]);
		var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
      
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        contractInstancePalletManagement.update_pallet({
            some: 'args'
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch(function(error, result) {
            console.log("update_pallet() event listener output ->  " + JSON.stringify(result.args));
        });
        console.log("Before contractInstancePalletManagement.updatePallet");
		
		console.log(" _palletID = "+palletId);
        //console.log(req.body.ProductBarcode, req.body.ProductName, req.body.MaterialIDs, req.body.ManufacturingLocation, req.body.ManufacturingDate, req.body.ManufacturingZipCode);
        contractInstancePalletManagement.updatePallet(palletId, {
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call updateproduct:::::::::");
                console.error(e);
                return;
                // callback fires twice, we only want the second call when the contract is deployed
            } else if (result) {
                console.log('Successfully UPDATED Pallet.');
                console.log('Transaction hash : ' + result);
                res.json(result)

            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });
    });

    
  
		
	// function to get	 productArray                     
    app.get("/getProductArray/:palletID", multipartMiddleware, function(req, res, next) {
        console.log('In crud::getProductArray::::::');
        var palletId = req.params.palletID;
		console.log(" palletID = "+palletId);
        var timeStamp = Date.now();
		 var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        console.log(palletId);

         var productList = [];
            contractInstancePalletManagement.ManageProductAndPalletEvent({
                palletBarCode: palletId
            }, {
                fromBlock: 0,
                toBlock: 'latest'
            }).get(function(error, result) {
                console.log("result is::"+JSON.stringify(result));
                for (var i in result) {
                    productList.push(JSON.stringify(result[i].args))
                }
                //console.log("billsOfSupply.length::"+billsOfSupply.length)
                return res.json(productList);
            });
    
	});
	
    //function to create shipment 
    app.post("/createShipment", multipartMiddleware, function(req, res, next) {
        console.log('In crud::createShipment22/8/2017::::::');
		
        var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
         var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        contractInstanceShipmentManagement.ManageShipmentEvent({
            some: 'args'
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch(function(error, result) {
            console.log("create_Shipment() event listener output ->  " + JSON.stringify(result.args));
        });
		var shipmentID = parseInt(req.body.shipmentID);   
		var shipmentstatus  =  parseInt(req.body.shipmentStatus);   
        console.log("Before contractInstanceShipmentManagement.createShipment"); 
		console.log("SHIPMENTBARCODE = "+shipmentID);
        console.log(shipmentID, req.body.palletArray,req.body.productArray, req.body.palletWeight, shipmentstatus, req.body.shipmentSequence, req.body.lastProcessingPoint, req.body.lastProcessingPoint);
        contractInstanceShipmentManagement.createShipment(shipmentID, req.body.palletArray, req.body.productArray,req.body.palletWeight, shipmentstatus, req.body.shipmentSequence, req.body.lastProcessingPoint, req.body.traceValue, {
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call createShipment:::::::::");
                console.error(e);
                return;
            } else if (result) {
                console.log('Successfully created Shipment.');
                console.log('Transaction hash : ' + result);
                res.json(result)
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });
    });

    // function to Update Shipment
    app.post("/updateShipment", multipartMiddleware, function(req, res, next) {
        console.log('In crud::updateShipment::::::');
		 var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
        var timeStamp = Date.now();
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        contractInstanceShipmentManagement.ManageShipmentEvent({
            some: 'args'
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch(function(error, result) {
            console.log("update_shipment() event listener output ->  " + JSON.stringify(result.args));
        });
        console.log("Before contractInstanceShipmentManagement.updateShipment productArray");
        
		if(req.body.shipmentStatus == "Shipment Created"){
			shipmentStatus = 0; 
		}else if(req.body.shipmentStatus == "In-Transit"){
			shipmentStatus = 1; 
		}else if(req.body.shipmentStatus == "Processed By Distributor"){
			shipmentStatus = 2; 
		}else if(req.body.shipmentStatus == "In-Store"){
			shipmentStatus = 3; 
		}
		shipmentID = parseInt(req.body.shipmentID);
		console.log("Shipment Status = "+shipmentStatus);
		
		console.log(req.body.traceValue);
		
        contractInstanceShipmentManagement.updateShipment(shipmentID, req.body.palletArray,req.body.productArray, req.body.palletWeight, shipmentStatus,req.body.shipmentsquence,req.body.lastProcessingPoint,req.body.traceValue, {
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call updateShipment:::::::::");
                console.error(e);
                return;
            } else if (result) {
                //console.log('Successfully UPDATED Shipment.');
                console.log('Transaction hash : ' + result);
                res.json(result)
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });

    });

   

    // function to get total shipment count      commented due to update 22/8/2017
    app.get("/getShipmentCount", multipartMiddleware, function(req, res, next) {
        console.log('In crud::getShipmentCount::::::');
       console.log(" sender = "+ variables['sender_'+req.session.unique_part]);
        console.log(" pass = "+ variables['pass_'+req.session.unique_part]);
        
		 var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
       
        
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
       
        contractInstanceShipmentManagement.getShipmentCount({
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call getShipmentCount:::::::::");
                console.error(e);
            } else if (result) {
                console.log('Successfully got getShipmentCount = '+result);
              
                //console.log('Got the Pallet for index::'+_index+' with values::'+x);
                console.log('Got the Shipment for count::'+result);
                res.json(result);
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });

    });
	
	
	
	
	 // function to get total palletCount    
    app.get("/getPalletCount", multipartMiddleware, function(req, res, next) {
        console.log('In crud::getPalletCount::::::');
       console.log(" sender = "+ variables['sender_'+req.session.unique_part]);
        console.log(" pass = "+ variables['pass_'+req.session.unique_part]);
        
		 var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
       
        
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
       
        contractInstancePalletManagement.getPalletCount({
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call getPalletCount:::::::::");
                console.error(e);
            } else if (result) {
              //  console.log('Successfully got getPalletCount = '+result);
                var x = JSON.parse(result.toString());
                //console.log('Got the Pallet for index::'+_index+' with values::'+x);
                console.log('Got the PalletCount::'+x);
                res.json(x);
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });

    });
	
	
	
	
	
	 // function to get current pallet     
    app.get("/getCurrentPalletBarcode", multipartMiddleware, function(req, res, next) {
        console.log('In crud::getCurrentPalletBarcode::::::');
       console.log(" sender = "+ variables['sender_'+req.session.unique_part]);
        console.log(" pass = "+ variables['pass_'+req.session.unique_part]);
        
		 var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
       
        
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
       
        contractInstancePalletManagement.getCurrentPalletBarcode({
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call getCurrentPalletBarcode:::::::::");
                console.error(e);
            } else if (result) {
                console.log('Successfully got getCurrentPalletBarcode = '+result);
				console.log("getCurrentPalletBarcode = "+parseInt(result));
                var x = JSON.parse(result.toString());
                //console.log('Got the Pallet for index::'+_index+' with values::'+x);
                console.log('Got the getCurrentPalletBarcode for count::'+x);
                res.json(x);
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });

    });
	
	
	
	 // function to get Pallet Size     
    app.get("/getPalletSize", multipartMiddleware, function(req, res, next) {
        console.log('In crud::getPalletSize::::::');
       console.log(" sender = "+ variables['sender_'+req.session.unique_part]);
        console.log(" pass = "+ variables['pass_'+req.session.unique_part]);
        
		 var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
       
        
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
       
        contractInstancePalletManagement.getPalletSize({
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call getPalletSize:::::::::");
                console.error(e);
            } else if (result) {
                console.log('Successfully got getPalletSize = '+result);
				console.log("getPalletSize = "+parseInt(result));
                var x = JSON.parse(result.toString());
                //console.log('Got the Pallet for index::'+_index+' with values::'+x);
                console.log('Got the getPalletSize for count::'+x);
                res.json(x);
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });

    });
	
	
	
	
	
	// function to get current product size    
    app.get("/getProductSize/:palletID", multipartMiddleware, function(req, res, next) {
        console.log('In crud::getProductSize::::::');
       console.log(" sender = "+ variables['sender_'+req.session.unique_part]);
        console.log(" pass = "+ variables['pass_'+req.session.unique_part]);
        
		 var sender = variables['sender_'+req.session.unique_part];
        console.log("address = "+sender+ " part = "+req.session.unique_part)
         var pass = variables['pass_'+req.session.unique_part];
       
		var palletId = req.params.palletID;
		console.log(" palletID = "+palletId);
       
        
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
       
        contractInstancePalletManagement.getProductSize(palletId,{
            from: sender,
            gas: 4700000
        }, function(e, result) {
            if (e) {
                console.error("Got error for doing the function call getProductSize:::::::::");
                console.error(e);
            } else if (result) {
                console.log('Successfully got getProductSize = '+result);
                var x;
                if(result != undefined){
                    x = JSON.parse(result.toString());
                }
                //console.log('Got the Pallet for index::'+_index+' with values::'+x);
                console.log('Value of x::'+x);
                res.json(x);
            } else {
                console.log("Please Contact Administrator...It should never come here.")
            }
        });

    });

 

 app.get("/getPalletNEW", multipartMiddleware, function(req, res, next) {
        console.log('In method /getPalletNEW');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
        
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var palletList = [];
        contractInstancePalletManagement.ManageProductAndPalletEvent({
                 createdBy: sender
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
          
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
					//	console.log(" ProductID "+ProductID+ " eachRec.productBarCode = "+eachRec.productBarCode );
                        if(eachRec.productBarCode.toString() == ProductID.toString()){
						 	
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	//console.log("EachRec:: Larger"+eachRec);
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                           // 	console.log("Latest Block number = "+latestBlockNum+ " productBarCode = "+eachRec.productBarCode )
                          	}
                        }
                    }     
                    //console.log("latestObj::"+JSON.stringify(latestObj));
                    palletList.push(latestObj);
                }
            }
          //  console.log("palletList.length::"+palletList.length)
            return res.json(palletList);
        }); 
    });
	
	
	
	
	app.get("/getPalletCreated", multipartMiddleware, function(req, res, next) {
        console.log('In method /getPalletCreated');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
		
       
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var palletArray = [];
        contractInstancePalletManagement.update_pallet({
                pallet_status: 0
             }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
          
            data = result;
			
            for(var i in data) {
                 
				
				outerRec = data[i].args; 
                var PalletID = outerRec.palletName;
				
                var latestBlockNum = outerRec.blockNum;
				//console.log("latestBlockNum = "+latestBlockNum);
                var found = false;
                for(var i = 0; i < palletArray.length; i++) {
					
                    if (palletArray[i].palletName.toString() == PalletID.toString()) {
						//console.log("Inside Pallet Array check ");
                        found = true;
                        break;
                    }
                }
				
                if(!found){
                    latestObj = outerRec;
					
                    for (var j in data) {
                       
					    eachRec = data[j].args;
						
                        if(eachRec.palletName.toString() == PalletID.toString()){
						 
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	//console.log("EachRec:: Larger"+eachRec);
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                            	//console.log("Latest Block number = "+latestBlockNum+ " shipmentBarCode = "+eachRec.shipmentBarCode )
                          	}
                        }
                    }     
                    //console.log("latestObj::"+JSON.stringify(latestObj));
                    palletArray.push(latestObj);
                }
            }
           
            return res.json(palletArray);
        }); 
    });
	
	
 app.get("/getuser", multipartMiddleware, function(req, res, next) {
        console.log('In method /getuser');
        console.log("deepak username = "+req.session.username);
        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
        console.log(" sender  = "+ variables['sender_'+req.session.unique_part]);
         return res.json(sender);
        }); 




	
	
	 app.get("/getShipmentNEW", multipartMiddleware, function(req, res, next) {
        console.log('In method /getShipmentNEW');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
		console.log(" sender  = "+ variables['sender_'+req.session.unique_part]);
       
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var shipments = [];
         contractInstanceShipmentManagement.ManageShipmentEvent({
               createdBy: sender
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
        
            data = result;
			
            for(var i in data) {
               
				
				outerRec = data[i].args; 
                var ShipmentID = outerRec.shipmentBarCode;
			
				
                var latestBlockNum = outerRec.blockNum;
				//console.log("latestBlockNum = "+latestBlockNum);
                var found = false;
                for(var i = 0; i < shipments.length; i++) {
				
                    if (shipments[i].shipmentBarCode.toString() == ShipmentID.toString()) {
					//	console.log("Inside the material id check ");
                        found = true;
                        break;
                    }
                }
				//console.log("Before Found = "+found);
                if(!found){
                    latestObj = outerRec;
					//console.log("Before Second For Loop ");
                    for (var j in data) {
                       
					    eachRec = data[j].args;
						//console.log(" ShipmentID "+ShipmentID+ " eachRec.shipmentBarCode = "+eachRec.shipmentBarCode );
                        if(eachRec.shipmentBarCode.toString() == ShipmentID.toString()){
						 
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	//console.log("EachRec:: Larger"+eachRec);
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                            //	console.log("Latest Block number = "+latestBlockNum+ " shipmentBarCode = "+eachRec.shipmentBarCode )
                          	}
                        }
                    }     
                    //console.log("latestObj::"+JSON.stringify(latestObj));
                    shipments.push(latestObj);
                }
            }
         
            return res.json(shipments);
        }); 
    });
	
    app.get("/getBillsOfSupplyForManufacturer", multipartMiddleware, function(req, res, next) {
        console.log('In method /getBillsOfSupplyForManufacturer');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
        
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var billsOfSupply = [];
        contractInstanceRM.BillsOfSupplyEvent({
            //createdBy: sender
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
           
            data = result;
            
            for(var i in data) {
                //var outerRec = JSON.parse(data[i].args); 
                
                outerRec = data[i].args; 
                var RMID = outerRec.materialId;
               
                
                var latestBlockNum = outerRec.blockNum;
                //console.log("latestBlockNum = "+latestBlockNum);
                var found = false;
                for(var i = 0; i < billsOfSupply.length; i++) {
                   
                    if (billsOfSupply[i].materialId.toString() == RMID.toString()) {
                        //console.log("Inside the material id check ");
                        found = true;
                        break;
                    }
                }
                
                if(!found){
                    latestObj = outerRec;
                   
                    for (var j in data) {
                        
                        eachRec = data[j].args;
                        //console.log(" RMID "+RMID+ " eachRec.materialId = "+eachRec.materialId );
                        if(eachRec.materialId.toString() == RMID.toString()){
                            
                            if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                               
                                latestObj = eachRec;
                                latestBlockNum = eachRec.blockNum;
                                //console.log("Latest Block number = "+latestBlockNum+ " materialId = "+eachRec.materialId )
                            }
                        }
                    }     
                   
                    billsOfSupply.push(latestObj);
                }
            }
           
            return res.json(billsOfSupply);
        }); 
    });
	



}