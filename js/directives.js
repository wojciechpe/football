'use strict';

/* Directives */

sportApp.directive('groupView', function() {
    return {
        restrict: 'E',
        scope: { group: '=',
                 tournament: '=',
               },
        templateUrl: 'modules/group/group.html'
    };
});