function supplierController($scope, $rootScope, $location, $http, $window) {
    console.log("supplierController");

    var supplierIdentifier = "10000";
    var numOfBills = 0;

    $scope.selectrow = function(_x) {
        //console.log(_x);
        $scope.Bill = _x;
        console.log($scope.Bill);
    }

    $(document).ready(function() {
        $("#update1").click(function() {
            $('#createBillModal').modal('show');
        });
    });
   


	$http.get("/getUserName").success(function(data) {
        $scope.username = data.username;
        $scope.name = data.name;
        $scope.uniquePartInUserName = data.uniquePartInUserName;
        $scope.type = data.type;
    }).error(function(data) {
        console.log("Error in getUserName");
    });

    $(document).ready(function() {
        $("#update").click(function() {
            if ($('input:radio[name=yourSupplierRadio]:checked').length == 0) {
                $('#myModal').modal('hide');
                bootbox.alert("Please select atleast one row.")
            } else {
                $('#myModal').modal('show');
            }
        });
    });

    $http.get('/getBillOfSupplyCount').success(function(data) {
        console.log('In getBillOfSupplyCount method with data:'+data)
        numOfBills = data;
    }).error(function(data) {
        console.log("Error while calling getBillOfSupplyCount");
    });

    $scope.populateBillOfSupplyID = function() {
        //console.log("In function populateBillOfSupplyID with unique identifier::"+$scope.uniquePartInUserName)
        str = $scope.uniquePartInUserName;
        var num = parseInt(str.match(/\d+/),10)
	    supplierIdentifierVal = supplierIdentifier + num; 
	    valToBeIncremented = parseInt(numOfBills) + 1;
	    $scope.billOfSupplyID = supplierIdentifierVal + valToBeIncremented;
    }

    $scope.createBill = function() {
        if ($scope.billOfSupplyID != null && $scope.name != null && $scope.quantity != null && $scope.origin != null && $scope.shippedTo != null && $scope.comments != null) {
            var fd = new FormData();
            fd.append('billOfSupplyID', $scope.billOfSupplyID);
            fd.append('name', $scope.name);
            fd.append('quantity', $scope.quantity);
            fd.append('origin', $scope.origin);
            fd.append('shippedTo', $scope.shippedTo);
            fd.append('status', "Ready");
            fd.append('comments', encodeURI($scope.comments));
            var request = {
                method: 'POST',
                url: '/createBill',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }
            $http(request).success(function(data) {
                    bootbox.alert("Successfully created bill of supply. \n Transaction hash is:" + data);
                    setTimeout(function() {
                        window.location.reload();
                    }, 5000);

                })
                .error(function() {
                    alert('Error in submitting the data. Please try again.');
                });
        } else {
            bootbox.alert("warning: Fields are empty.")
        }
    }

    $http.get('/getBillsOfSupply').success(function(data) {
		console.log("Inside getBillsOfSupply ");
        console.log("type of data"+typeof data);
        console.log(data);
		$scope.bills = [];
        for (var i in data) {
            data[i].comments = decodeURI(data[i].comments)
            $scope.bills.push(data[i]);
        }
    }).error(function(data) {
         console.log("Error while calling getBillsOfSupply");
    });

    $scope.updateBill = function() {
        if ($scope.Bill.materialId != null && $scope.Bill.name != null && $scope.Bill.quantity != null && $scope.Bill.origin != null && $scope.Bill.shippedTo != null && $scope.Bill.status != null && $scope.Bill.comments != null) {
            console.log("updateBill");
            var fd = new FormData();
            fd.append('billOfSupplyID', $scope.Bill.materialId);
            fd.append('name', $scope.Bill.name);
            fd.append('quantity', $scope.Bill.quantity);
            fd.append('origin', $scope.Bill.origin);
            fd.append('shippedTo', $scope.Bill.shippedTo)
            fd.append('status', $scope.Bill.status)
            fd.append('comments', $scope.Bill.comments)
           
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
                   
                })
                .error(function() {
                    alert('Error in submitting the data. Please try again.');
                });
        } else {
            bootbox.alert("Please fill all the fields.");
        }
    }

}