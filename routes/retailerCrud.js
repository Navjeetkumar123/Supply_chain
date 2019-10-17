module.exports = function(app) {

   	// Create the contract source code shipment
    abiDefinitionSH = JSON.parse(variables.ShipmentContractJSON);

    SHContract = web3.eth.contract(abiDefinitionSH);
    // In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
    contractInstanceShipmentManagement = SHContract.at(variables.ShipmentContractAddress);

	var sender = variables.sender_distributor;
    var pass = variables.pass_distributor;
		

	
	
	app.get("/getShipmentRetailerNEW", multipartMiddleware, function(req, res, next) {
        console.log('In method /getShipmentRetailerNEW');

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
             //  status: 2
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
            console.log("result in getShipmentRetailerNEW ::"+result);
            console.log("stringified result is ::"+JSON.stringify(result));
            data = result;
			
            for(var i in data) {
                //var outerRec = JSON.parse(data[i].args); 
				
				outerRec = data[i].args; 
                var ShipmentID = outerRec.shipmentBarCode;
			
				
                var latestBlockNum = outerRec.blockNum;
				console.log("latestBlockNum = "+latestBlockNum);
                var found = false;
                for(var i = 0; i < shipments.length; i++) {
					
                    if (shipments[i].shipmentBarCode.toString() == ShipmentID.toString()) {
						console.log("Inside the material id check ");
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
                            	console.log("Latest Block number = "+latestBlockNum+ " shipmentBarCode = "+eachRec.shipmentBarCode )
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
	
	
	
	
	
	
	
	
	app.get("/getShipmentRetailerFinal", multipartMiddleware, function(req, res, next) {
        console.log('In method /getShipmentRetailerFinal');

        var sender = variables['sender_'+req.session.unique_part];
        var pass = variables['pass_'+req.session.unique_part];
		///console.log(" sender  = "+ variables['sender_'+req.session.unique_part]);
       
        var match = web3.personal.unlockAccount(sender, pass, 6000);
        while (!match) {
            pass = prompt("Enter correct passphrase for " + sender + " :", "");
            match = web3.personal.unlockAccount(sender, pass, 6000);
        }
        var shipments = [];
         contractInstanceShipmentManagement.ManageShipmentEvent({
             //  status: 3,
			   updatedBy: sender 
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        }).get(function(error, result) {
            console.log("result in getShipmentRetailerFinal ::"+result);
            console.log("stringified result is ::"+JSON.stringify(result));
            data = result;
			console.log("Before First For Loop ");
			console.log("DATA  =  "+data.length);
            for(var i in data) {
               
				
				outerRec = data[i].args; 
                var ShipmentID = outerRec.shipmentBarCode;
				console.log("outerRec = "+outerRec);
				console.log("ShipmentID = "+ShipmentID);
				
                var latestBlockNum = outerRec.blockNum;
				console.log("latestBlockNum = "+latestBlockNum);
                var found = false;
                for(var i = 0; i < shipments.length; i++) {
					console.log("shipments.shipmentBarCode = "+typeof shipments[i].shipmentBarCode);
					console.log("ShipmentID inside for= "+typeof ShipmentID);	
                    if (shipments[i].shipmentBarCode.toString() == ShipmentID.toString()) {
						console.log("Inside the material id check ");
                        found = true;
                        break;
                    }
                }
				//console.log("Before Found = "+found);
                if(!found){
                    latestObj = outerRec;
					//console.log("Before Second For Loop ");
                    for (var j in data) {
                        //console.log("data args is::"+JSON.stringify(data[j].args));
                        //eachRec = JSON.stringify(data[j].args);
					    eachRec = data[j].args;
						console.log(" ShipmentID "+ShipmentID+ " eachRec.shipmentBarCode = "+eachRec.shipmentBarCode );
                        if(eachRec.shipmentBarCode.toString() == ShipmentID.toString()){
						 
                          	if(parseInt(eachRec.blockNum) > parseInt(latestBlockNum)){
                            	//console.log("EachRec:: Larger"+eachRec);
                            	latestObj = eachRec;
                            	latestBlockNum = eachRec.blockNum;
                            	console.log("Latest Block number = "+latestBlockNum+ " shipmentBarCode = "+eachRec.shipmentBarCode )
                          	}
                        }
                    }     
                    //console.log("latestObj::"+JSON.stringify(latestObj));
                    shipments.push(latestObj);
                }
            }
            console.log("shipments.length::"+shipments.length)
			 console.log("shipments.length::"+shipments.length)
            return res.json(shipments);
        }); 
    });
	
	
	
	
	

}