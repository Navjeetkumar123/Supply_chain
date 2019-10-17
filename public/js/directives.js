var directives = angular.module('directives', []);

directives.directive('ngFiles', ['$parse', function ($parse) {
            console.log("ngFiles directive")
            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ]);