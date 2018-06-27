const divText = document.querySelector('#text');
const divC = document.querySelector('.clear');
let quant = document.querySelector('#quant');
let prod = document.querySelector('#prod');
let cod = document.querySelector('#cod');
let add = document.querySelector('#add');
let del = document.querySelector('#del');
let database = null;
let suc = true, cont = 0;

// Crie um pedido para abrir um banco de dados
let request = window.indexedDB.open("MyDataBase", 1);

request.onerror = function(event) { console.log("Erro ao abrir o banco de dados", event);};

request.onupgradeneeded  = function(event) {
    console.log("Atualizando...");
    database = event.target.result;
    var objectStore = database.createObjectStore("Estudantes", { keyPath : "id" });
    // var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
};

request.onsuccess  = function(event) {
    // Adicionando dados ao seu banco de dados
    database = event.target.result;
    console.log("Banco de dados aberto com sucesso.");
};

add.addEventListener('click', function (e) {
    e.preventDefault();
    // Para executar qualquer ação no armazenamento de objetos precisamos criar uma transação
    var transaction = database.transaction("Estudantes","readwrite");

    // transaction.oncomplete = function(event) { suc = true;};
    // transaction.onerror = function(event) { suc = false;};
    if (prod.value != '' && quant.value != '') {
        objectStore = transaction.objectStore("Estudantes");
        var random = Math.floor(Math.random() * 400) + 1;
        objectStore.add({produto: prod.value, quantidade: quant.value, id: random});
        var p = document.createElement('p');
        p.innerHTML = 'Produto: ' + prod.value + ' Quantidade: ' + quant.value + ' Sua chave: ' + random;
        var div = document.createElement('div');
        div.classList.add('c_' + random);
        div.appendChild(p);
        divC.style.display = 'none';
        divText.appendChild(div);
        prod.value = '';
        quant.value = '';
    } else { console.log('Preencha os campos')};
});

// Removendo dados
del.addEventListener('click', function (e) {
    e.preventDefault();
    if (document.querySelector('.c_' + cod.value) != null) {
        divText.removeChild(document.querySelector('.c_' + cod.value));
        database.transaction("Estudantes","readwrite").objectStore("Estudantes").delete(Number(cod.value));
        cod.value = '';
        console.log('Deletado');
    } else { console.log('Código não encontrado');}
    if (divText.childNodes.length === 1) { divC.style.display = 'block';}
});

// Atualizando dados
setTimeout(() => {
    var objectStore = database.transaction("Estudantes","readwrite").objectStore("Estudantes");
    var req = objectStore.getAll();
    req.onsuccess = function () {
        while (cont < req.result.length) {
            divC.style.display = 'none';
            var div = document.createElement('div');
            var p = document.createElement('p');
            p.innerHTML = 'Produto:' + req.result[cont].produto + ' Quantidade:' + req.result[cont].quantidade + ' Sua chave:' + req.result[cont].id;
            div.classList.add('c_' + req.result[cont].id);
            div.appendChild(p);
            divText.appendChild(div);
            cont++;
        };
        cont = 0;
    };
}, 500);