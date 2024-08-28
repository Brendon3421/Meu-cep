function limpa_formulário_cep() {
    document.getElementById('rua').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('uf').value = ("");
    document.getElementById('ibge').value = ("");
    document.getElementById('ddd').value = ("");
    document.getElementById('gia').value = ("");
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        document.getElementById('cidade').value = (conteudo.localidade);
        document.getElementById('uf').value = (conteudo.uf);
        document.getElementById('ibge').value = (conteudo.ibge);
        document.getElementById('ddd').value = (conteudo.ddd);
        document.getElementById('gia').value = (conteudo.gia);
    } else {
        limpa_formulário_cep();
        Swal.fire({
            title: 'Erro',
            text: 'CEP não encontrado.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function pesquisacep(valor) {
    var cep = valor.replace(/\D/g, '');

    if (cep != "") {
        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";
            document.getElementById('ibge').value = "...";
            document.getElementById('ddd').value = "...";
            document.getElementById('gia').value = "...";

            var script = document.createElement('script');
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';
            document.body.appendChild(script);

        } else {
            limpa_formulário_cep();
            Swal.fire({
                title: 'Erro',
                text: 'Formato de CEP inválido.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } else {
        limpa_formulário_cep();
    }
}

let longitudeInput = document.getElementById("longitude");
let latitudeInput = document.getElementById("Latitude");
let h2 = document.querySelector("h2");
var map;

function success(pos) {
    console.log(pos.coords.latitude, pos.coords.longitude);

    latitudeInput.value = pos.coords.latitude;
    longitudeInput.value = pos.coords.longitude;

    h2.textContent = `Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`;

    if (map === undefined) {
        map = L.map("map").setView([pos.coords.latitude, pos.coords.longitude], 13);
    } else {
        map.remove();
        map = L.map("map").setView([pos.coords.latitude, pos.coords.longitude], 13);
    }

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

var cepInput = document.getElementById('cep');
var maskOptionsCpf = {
    mask: '00000-000'
};


function displayUserIP() {
    axios.get('https://api.ipify.org?format=json')
        .then(response => {
            document.getElementById('user-ip').textContent = `Seu IP é: ${response.data.ip}`;
        })
        .catch(error => {
            console.error('Erro ao obter IP do usuário:', error);
            document.getElementById('user-ip').textContent = 'Não foi possível obter o IP.';
        });
}

// Chama a função quando a página carrega
window.onload = displayUserIP;
