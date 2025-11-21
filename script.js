// script.js

// 1. Mapeamento dos elementos HTML
const inputNovaTarefa = document.getElementById('inputNovaTarefa');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaDeTarefas = document.getElementById('listaDeTarefas');
const btnLimparTudo = document.getElementById('btnLimparTudo');

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

// ===================================================
// CONFIGURAÇÃO DE EVENTOS E INICIALIZAÇÃO
// ===================================================

// Configuração dos Eventos (Event Listeners)
btnAdicionar.addEventListener('click', adicionarTarefa);
btnLimparTudo.addEventListener('click', limparTudo);

// Permite adicionar a tarefa pressionando a tecla 'Enter'
inputNovaTarefa.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});

// Inicia a aplicação carregando os dados salvos
carregarTarefas();