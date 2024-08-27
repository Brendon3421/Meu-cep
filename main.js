
function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('uf').value = ("");
    document.getElementById('ibge').value = ("");
    document.getElementById('ddd').value = ("")
    document.getElementById('gia').value = ("")
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        document.getElementById('cidade').value = (conteudo.localidade);
        document.getElementById('uf').value = (conteudo.uf);
        document.getElementById('ibge').value = (conteudo.ibge);
        document.getElementById('ddd').value = (conteudo.ddd);
        document.getElementById('gia').value = (conteudo.gia);
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}

function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";
            document.getElementById('ibge').value = "...";
            document.getElementById('ddd').value = "...";
            document.getElementById('gia').value = "...";
            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
};

let longitudeInput = document.getElementById("longitude");
let latitudeInput = document.getElementById("Latitude");
let h2 = document.querySelector("h2");
var map;

function success(pos) {
    console.log(pos.coords.latitude, pos.coords.longitude);

    // Atualizar os valores dos elementos de entrada
    latitudeInput.value = pos.coords.latitude;
    longitudeInput.value = pos.coords.longitude;

    // Atualizar o conteúdo do h2
    h2.textContent = `Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`;

    // Mostrar o mapa
    if (map === undefined) {
        map = L.map("map").setView([pos.coords.latitude, pos.coords.longitude], 13);
    } else {
        map.remove();
        map = L.map("map").setView([pos.coords.latitude, pos.coords.longitude], 13);
    }

    // Mostrar as ruas/prédios e bairros
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);


    // Adicionar marcador
    L.marker([pos.coords.latitude, pos.coords.longitude])
        .addTo(map)
        .bindPopup("Eu estou neste local!")
        .openPopup();
}

function erro(err) {
    console.log(err);
}

var watchID = navigator.geolocation.watchPosition(success, erro, {
    enableHighAccuracy: true,
    timeout: 1000,
});

//mascara
var cepInput = document.getElementById('cep');
var maskOptionsCpf = {
    mask: '00000-000' // Define a máscara como ###.###.###-##
};