'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$rootScope', '$scope', '$location', '$filter', 'patient', 'patientService',
                    'appService', 'openmrsPatientMapper', 'notifier',
        function ($rootScope, $scope, $location, $filter, patientModel, patientService, appService, patientMapper, notifier) {

                $scope.actions = {};
                $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");

                (function () {
                    $scope.srefPrefix = "newpatient.";
                    $scope.patient = patientModel.create();
                })();

                $scope.save = function () {
                    var errMsg = Bahmni.Common.Util.ValidationUtil.validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
                    if(errMsg){
    //                   messagingService.showMessage('formError', errMsg);
                        return;
                    }

                    patientService.create($scope.patient).success(successCallback).error(errorCallback);
                };

                var successCallback = function (patientProfileData) {
                    $rootScope.patient = patientMapper.map(patientProfileData.patient);
                    $scope.patient.uuid = patientProfileData.patient.uuid;
                    $scope.patient.name = patientProfileData.patient.person.names[0].display;
                    $scope.patient.isNew = true;
                    var successMessage = $filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED');
                    notifier.success(successMessage);
                    $location.url("/dashboard/" + $scope.patient.uuid);
                };

                var errorCallback = function (data, status) {
                    notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
                };
        }]);
