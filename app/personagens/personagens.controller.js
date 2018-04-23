app.controller('personagensController', function ($scope, $mdDialog, $mdToast, personagensFactory, $http) {

    // read personagens
    $scope.readPersonagens = function () {
        // use personagens factory
        personagensFactory.readPersonagens().then(function successCallback(response) {
            $scope.personagens = response.data;
        }, function errorCallback(response) {
            $scope.showToast("Não foi possível realizar a operação.");
        });

        personagensFactory.readTipos().then(function successCallback(response) {
            //create select box
            $scope.tipos = response.data;
        }, function errorCallback(response) {
            $scope.showToast("Não foi possível realizar a operação.");
        });

        personagensFactory.readEspecialidades().then(function successCallback(response) {
            //create select box
            $scope.especialidades = response.data;
        }, function errorCallback(response) {
            $scope.showToast("Não foi possível realizar a operação.");
        });

        personagensFactory.readPersonagemEspecialidade().then(function successCallback(response) {
            //create select box
            $scope.personagem_especialidade = response.data;
        }, function errorCallback(response) {
            $scope.showToast("Não foi possível realizar a operação.");
        });

    }

    // show 'create personagem form' in dialog box
    $scope.showCreatePersonagemForm = function (event) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/personagens/create_personagem.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    }

    $scope.showCreateTipoForm = function (event) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/personagens/create_tipo.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    }

    $scope.showCreateEspecialidadeForm = function (event) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/personagens/create_especialidade.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    }

// create new personagem
    $scope.createPersonagem = function () {

        personagensFactory.createPersonagem($scope).then(function successCallback(response) {
            var form_data = new FormData();
            var filename;
            var upload_file = false;
            angular.forEach($scope.files, function (file) {
                //existe arquivo
                upload_file = true;
                //alterando o nome do arquivo para o id do respectivo personagem + extensão
                filename = response.data + '.' + file.name.split(".").pop();
                form_data.append('file', file);
            });
            if (upload_file)
            {
                $http.post('app/personagens/upload.php/' + filename, form_data,
                        {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined, 'Process-Data': false}
                        });
                $scope.id = response.data;
                personagensFactory.updatePersonagem($scope);
            }
            angular.forEach($scope.selectedEsp, function (especialidade) {
                personagensFactory.createPersonagemEspecialidade(response.data, especialidade.id);
            });

            // tell the user new personagem was created
            $scope.showToast("Cadastro realizado com sucesso.");

            // refresh the list
            $scope.readPersonagens();

            // close dialog
            $scope.cancel();

            // remove form values
            $scope.clearPersonagemForm();

        }, function errorCallback(response) {
            $scope.showToast("Não foi possível realizar o cadastro.");
        });
    }

// readOnePersonagem will be here

// retrieve record to fill out the form
    $scope.showUpdatePersonagemForm = function (id) {
        // get personagem to be edited
        personagensFactory.readOnePersonagem(id).then(function successCallback(response) {
            // put the values in form
            $scope.id = response.data.id;
            $scope.name = response.data.nome;
            $scope.vida = parseFloat(response.data.vida);
            $scope.defesa = parseFloat(response.data.defesa);
            $scope.dano = parseFloat(response.data.dano);
            $scope.velocidade_ataque = parseFloat(response.data.velocidade_ataque);
            $scope.velocidade_movimento = parseFloat(response.data.velocidade_movimento);

            var _tipo_ = $scope.tipos.filter((tipo) => tipo.id == response.data.tipo_id)[0];
            $scope.selectedTipo = _tipo_;

            var especialidades_personagem = $scope.personagem_especialidade.filter(function (especialidades) {
                return (especialidades.personagem_id == response.data.id) ? true : false;
            });
            var arr = [];
            angular.forEach(especialidades_personagem, function (espec_pers) {
                var _especialidade_ = $scope.especialidades.filter(function (especialidade) {
                    return (especialidade.id == espec_pers.especialidade_id) ? true : false;
                });
                arr.push(_especialidade_[0]);
            });
            $scope.selectedEsp = arr;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: './app/personagens/update_personagem.template.html',
                parent: angular.element(document.body),
                //targetEvent: event,
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                fullscreen: true
            }).then(
                    function () {},
                    // user clicked 'Cancel'
                            function () {
                                // clear modal content
                                $scope.clearPersonagemForm();
                            }
                    );

                }, function errorCallback(response) {
            $scope.showToast("Não foi possível realizar a operação.");
        });

    }

// update personagem record / save changes
    $scope.updatePersonagem = function () {
        personagensFactory.updatePersonagem($scope).then(function successCallback(response) {
            var form_data = new FormData();
            var upload_file = false;
            angular.forEach($scope.files, function (file) {
                //existe arquivo
                upload_file = true;
                //alterando o nome do arquivo para o id do respectivo personagem + extensão
                filename = $scope.id + '.' + file.name.split(".").pop();
                form_data.append('file', file);
            });
            if (upload_file)
            {
                $http.post('app/personagens/upload.php/' + filename, form_data,
                        {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined, 'Process-Data': false}
                        });
                //$scope.id = response.data;
                //personagensFactory.updatePersonagem($scope);
            }
            personagensFactory.deletePersonagemEspecialidade($scope.id);
            angular.forEach($scope.selectedEsp, function (especialidade) {
                personagensFactory.createPersonagemEspecialidade($scope.id, especialidade.id);
            });

            $scope.showToast("Alteração realizada com sucesso.");

            // refresh the personagem list
            $scope.readPersonagens();

            // close dialog
            $scope.cancel();

            // clear modal content
            $scope.clearPersonagemForm();

        },
                function errorCallback(response) {
                    $scope.showToast("Não foi possível realizar a alteração.");
                });

    }

// cofirm personagem deletion
    $scope.confirmDeletePersonagem = function (event, id) {

        // set id of record to delete
        $scope.id = id;

        // dialog settings
        var confirm = $mdDialog.confirm()
                .title('Confirma exclusão?')
                .textContent('Personagem será excluído definitivamente.')
                .targetEvent(event)
                .ok('Sim')
                .cancel('Não');

        // show dialog
        $mdDialog.show(confirm).then(
                // 'Yes' button
                        function () {
                            // if user clicked 'Yes', delete personagem record
                            $scope.deletePersonagem();
                        },
                        // 'No' button
                                function () {
                                    // hide dialog
                                }
                        );
                    }

// delete personagem
            $scope.deletePersonagem = function () {

                personagensFactory.deletePersonagem($scope.id).then(function successCallback(response) {

                    $scope.showToast("Exclusão realizada com sucesso.");

                    // refresh the list
                    $scope.readPersonagens();

                }, function errorCallback(response) {
                    $scope.showToast("Não foi possível realizar a exclusão.");
                });

            }

// search personagens
            $scope.searchPersonagens = function () {
                // use personagens factory
                personagensFactory.searchPersonagens($scope.search_keywords).then(function successCallback(response) {
                    $scope.personagens = response.data;
                }, function errorCallback(response) {
                    $scope.showToast("Não foi possível concluir a operação.");
                });
            }

// create new tipo
            $scope.createTipo = function () {

                personagensFactory.createTipo($scope).then(function successCallback(response) {

                    // tell the user new personagem was created
                    $scope.showToast("Cadastro realizado com sucesso.");

                    // close dialog
                    $scope.cancel();

                    // remove form values
                    $scope.clearTipoForm();

                    // refresh the list
                    $scope.readPersonagens();

                }, function errorCallback(response) {
                    $scope.showToast("Não foi possível realizar o cadastro.");
                });
            }

// create new especialidade
            $scope.createEspecialidade = function () {

                personagensFactory.createEspecialidade($scope).then(function successCallback(response) {

                    // tell the user new personagem was created
                    $scope.showToast("Cadastro realizado com sucesso.");

                    // close dialog
                    $scope.cancel();

                    // remove form values
                    $scope.clearEspecialidadeForm();

                    // refresh the list
                    $scope.readPersonagens();

                }, function errorCallback(response) {
                    $scope.showToast("Não foi possível realizar o cadastro.");
                });
            }

// clear variable / form values
            $scope.clearPersonagemForm = function () {
                $scope.id = "";
                $scope.name = "";
                $scope.vida = "";
                $scope.defesa = "";
                $scope.dano = "";
                $scope.velocidade_ataque = "";
                $scope.velocidade_movimento = "";
                $scope.selectedTipo = null;
                $scope.selectedEsp = null;
            }
// clear variable / form values
            $scope.clearTipoForm = function () {
                $scope.description = "";
            }
// clear variable / form values
            $scope.clearEspecialidadeForm = function () {
                $scope.description = "";
            }

// show toast message
            $scope.showToast = function (message) {
                $mdToast.show(
                        $mdToast.simple()
                        .textContent(message)
                        .hideDelay(3000)
                        .position("top right")
                        );
            }

            // methods for dialog box
            function DialogController($scope, $mdDialog) {
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        });