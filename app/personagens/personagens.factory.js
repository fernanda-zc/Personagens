app.factory("personagensFactory", function ($http) {

    var factory = {};

    // read all personagens
    factory.readPersonagens = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/Personagens/api.php/personagens'
        });
    };

    // read all especialidades
    factory.readEspecialidades = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/Personagens/api.php/especialidades'
        });
    };

    // read all personagem_especialidade
    factory.readPersonagemEspecialidade = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/Personagens/api.php/personagem_especialidade'
        });
    };

    // read all especialidades
    factory.readTipos = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/Personagens/api.php/tipos'
        });
    };

    // create personagem
    factory.createPersonagem = function ($scope) {
        return $http({
            method: 'POST',
            data: {
                'nome': $scope.name,
                'vida': $scope.vida,
                'defesa': $scope.defesa,
                'dano': $scope.dano,
                'velocidade_ataque': $scope.velocidade_ataque,
                'velocidade_movimento': $scope.velocidade_movimento,
                'tipo_id': $scope.selectedTipo.id
            },
            url: 'http://localhost:8080/Personagens/api.php/personagens'
        });
    };

    // create personagem
    factory.createPersonagemEspecialidade = function (personagem_id, especialidade_id) {
        return $http({
            method: 'POST',
            data: {
                'personagem_id': personagem_id,
                'especialidade_id': especialidade_id
            },
            url: 'http://localhost:8080/Personagens/api.php/personagem_especialidade'
        });
    };

    // create tipo
    factory.createTipo = function ($scope) {
        return $http({
            method: 'POST',
            data: {
                'descricao': $scope.description
            },
            url: 'http://localhost:8080/Personagens/api.php/tipos'
        });
    };

    // create especialidade
    factory.createEspecialidade = function ($scope) {
        return $http({
            method: 'POST',
            data: {
                'descricao': $scope.description
            },
            url: 'http://localhost:8080/Personagens/api.php/especialidades'
        });
    };

// read one personagem
    factory.readOnePersonagem = function (id) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/Personagens/api.php/personagens/' + id
        });
    };

// update personagem
    factory.updatePersonagem = function ($scope) {
        var caminho_arquivo = null;
        if ($scope.files != null && $scope.files.length > 0)
            caminho_arquivo = './app/personagens/imagens/' + $scope.id + '.' + $scope.files[0].name.split(".").pop();
        return $http({
            method: 'PUT',
            data: {
                'id': $scope.id,
                'nome': $scope.name,
                'vida': $scope.vida,
                'defesa': $scope.defesa,
                'dano': $scope.dano,
                'velocidade_ataque': $scope.velocidade_ataque,
                'velocidade_movimento': $scope.velocidade_movimento,
                'tipo_id': $scope.selectedTipo.id,
                'arquivo_caminho': caminho_arquivo
            },
            url: 'http://localhost:8080/Personagens/api.php/personagens/' + $scope.id
        });
    };

// delete personagem
    factory.deletePersonagem = function (id) {
        return $http({
            method: 'DELETE',
            data: {'id': id},
            url: 'http://localhost:8080/Personagens/api.php/personagens/' + id
        });
    };

    // delete personagem_especialidade
    factory.deletePersonagemEspecialidade = function (id) {
        return $http({
            method: 'DELETE',
            data: {'id': id},
            url: 'http://localhost:8080/Personagens/api.php/personagem_especialidade/' + id
        });
    };

// search all personagens
    factory.searchPersonagens = function (keywords) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/Personagens/search.php/personagens/' + keywords
        });
    };

    return factory;
});

