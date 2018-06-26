const divText = document.querySelector('#text');
let input = document.querySelector('#name');
let cod = document.querySelector('#cod');
let add = document.querySelector('#add');
let del = document.querySelector('#del');
let key = document.querySelector('#key');
let update = document.querySelector('#update');
var suc = true;

// Crie um pedido para abrir um banco de dados
let request = window.indexedDB.open("MyDataBase", 1), db;
// Para ter acesso a um banco de dados, chame open()

request.onerror = function(event) {
        console.log("Erro ao abrir o banco de dados", event);
}

request.onupgradeneeded   = function(event) {
    console.log("Atualizando...");
    db = event.target.result;
    var objectStore = db.createObjectStore("Estudantes", { keyPath : "PK" });
    // var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
};

request.onsuccess  = function(event) {
    // Adicionando dados ao seu banco de dados
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso.");
}

add.addEventListener('click', function () {
    var transaction = db.transaction("Estudantes","readwrite");
    transaction.oncomplete = function(event) {
            // console.log("Sucesso");
            suc = true;
    };

    transaction.onerror = function(event) {
            // console.log("Error");
            suc = false;
    };
    if (suc) {
        var objectStore = transaction.objectStore("Estudantes");
        var a = cod.value;  
        var b = input.value;
        var c = Math.floor(Math.random() * 400) + 1;
        objectStore.add({Codigo: a, nome : b, PK: c});
        var p = document.createElement('p');
        p.innerHTML = 'Produto: ' + b + ' Quantidade: ' + a + ' Sua chave: ' + c;
        var div = document.createElement('div');
        div.classList.add('c_' + c);
        div.appendChild(p);
        divText.appendChild(div);
        input.value = '';
        cod.value = '';
    }
});

// Removendo dados
del.addEventListener('click', function () {
    var a = document.querySelector('.c_' + Number(key.value));
    divText.removeChild(a);
    db.transaction("Estudantes","readwrite").objectStore("Estudantes").delete(Number(key.value));
    key.value = '';
    console.log('Deletado');
});
// Acessando um objeto pela sua chave
// Para acessar um objeto pelo sua chave use a função get()

// var request = db.transaction(["Estudantes"],"readwrite").objectStore("Estudantes").get(Codigo);
// request.onsuccess = function(event){
//       console.log("Nome : " + request.result.nome);    
// };

// Atualizando dados
update.addEventListener('click', function () {
    var objectStore = db.transaction("Estudantes","readwrite").objectStore("Estudantes");
    var req = objectStore.get('334');
    console.log(req.result);
    var div = document.createElement('div');
    var p = document.createElement('p');
    p.innerHTML = 'Nome:' + req.result[0].nome + ' Quantidade:' + req.result[0].codigo + ' Sua chave:' + req.result[0].PK;
    div.classList.add('c_' + req.result[0].pk);
    div.appendChild(p);
    divText.appendChild(div);
});