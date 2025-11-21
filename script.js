// script.js

// 1. Mapeamento dos elementos HTML
const inputNovaTarefa = document.getElementById('inputNovaTarefa');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaDeTarefas = document.getElementById('listaDeTarefas');
const btnLimparTudo = document.getElementById('btnLimparTudo');
const btnCarregarExterno = document.getElementById('btnCarregarExterno');
// Array que armazenará todas as tarefas
let tarefas = [];

// ===================================================
// FUNÇÕES DE PERSISTÊNCIA (Local Storage - Issue #4)
// ===================================================

function salvarTarefas() {
    // Converte o array de objetos 'tarefas' para uma string JSON e salva no Local Storage
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas');

    if (tarefasSalvas) {
        // Converte a string JSON de volta para o array de objetos
        tarefas = JSON.parse(tarefasSalvas);
    } else {
        tarefas = []; 
    }
    renderizarTarefas();
}

// ===================================================
// FUNÇÕES DE MANIPULAÇÃO DA INTERFACE E LÓGICA (Issue #3)
// ===================================================

// Função para renderizar/mostrar a lista na tela
function renderizarTarefas() {
    listaDeTarefas.innerHTML = ''; 

    if (tarefas.length === 0) {
        listaDeTarefas.innerHTML = '<li class="list-group-item text-center text-muted">Nenhuma tarefa encontrada. Adicione uma!</li>';
        return;
    }

    tarefas.forEach((tarefa, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Adiciona classe para riscar o texto se estiver concluída
        if (tarefa.concluida) {
            li.classList.add('tarefa-concluida');
        }

        li.innerHTML = `
            <span>${tarefa.texto}</span>
            <div>
                <button class="btn btn-sm ${tarefa.concluida ? 'btn-warning' : 'btn-success'} me-2" 
                        data-index="${index}" onclick="toggleConcluida(${index})">
                    ${tarefa.concluida ? 'Reabrir' : 'Concluir'}
                </button>
                
                <button class="btn btn-sm btn-danger" data-index="${index}" onclick="excluirTarefa(${index})">
                    Excluir
                </button>
            </div>
        `;
        listaDeTarefas.appendChild(li);
    });
}

// Função para adicionar uma nova tarefa
function adicionarTarefa() {
    const texto = inputNovaTarefa.value.trim();
    
    if (texto === '') {
        alert('Por favor, digite uma tarefa válida.');
        return;
    }

    tarefas.push({
        texto: texto,
        concluida: false
    });

    inputNovaTarefa.value = ''; // Limpa o input
    salvarTarefas(); // Salva no Local Storage
    renderizarTarefas(); // Atualiza a tela
}

// Função para excluir uma tarefa
function excluirTarefa(index) {
    tarefas.splice(index, 1);
    salvarTarefas(); // Salva no Local Storage
    renderizarTarefas();
}

// Função para marcar/desmarcar tarefa como concluída
function toggleConcluida(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarTarefas(); // Salva no Local Storage
    renderizarTarefas();
}

// Função para limpar todas as tarefas
function limparTudo() {
    if (confirm('Tem certeza que deseja limpar todas as tarefas?')) {
        tarefas = []; 
        salvarTarefas(); // Salva a lista vazia
        renderizarTarefas();
    }
}
// Função para carregar tarefas de um Web Service (Issue #5)
async function carregarTarefasExternas() {
    try {
        // 1. Faz a requisição HTTP (consumo do Web Service)
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');

        if (!response.ok) {
            // Checa se a resposta HTTP é OK (status 200)
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        // 2. Converte a resposta para um objeto JavaScript (JSON)
        const dadosExternos = await response.json();

        // 3. Processa os dados e adiciona às tarefas existentes
        dadosExternos.forEach(item => {
            // Adiciona a tarefa se ela ainda não existir na lista
            const textoTarefa = `[API] ${item.title}`;

            // Evita duplicatas ao carregar
            const jaExiste = tarefas.some(t => t.texto === textoTarefa);

            if (!jaExiste) {
                tarefas.push({
                    texto: textoTarefa,
                    concluida: item.completed // Usa o status 'completed' da API
                });
            }
        });

        salvarTarefas(); // Salva a lista atualizada no Local Storage
        renderizarTarefas(); // Atualiza a interface
        alert('5 tarefas de exemplo carregadas com sucesso via Web Service!');

    } catch (error) {
        console.error('Falha ao carregar tarefas externas:', error);
        alert('Não foi possível carregar as tarefas externas. Verifique a conexão.');
    }
}
// ===================================================
// CONFIGURAÇÃO DE EVENTOS E INICIALIZAÇÃO
// ===================================================

// Configuração dos Eventos (Event Listeners)
btnAdicionar.addEventListener('click', adicionarTarefa);
btnLimparTudo.addEventListener('click', limparTudo);
btnCarregarExterno.addEventListener('click', carregarTarefasExternas);
// Permite adicionar a tarefa pressionando a tecla 'Enter'
inputNovaTarefa.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});

// ===================================================
// REGISTRO DO SERVICE WORKER (PWA - Issue #6)
// ===================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(err => {
                console.log('Falha no registro do Service Worker:', err);
            });
    });
}

// Inicia a aplicação carregando os dados salvos
carregarTarefas();

