console.log("Api.js funcionando");

const API = "http://localhost:3000";
const API_VEICULOS = `${API}/lerveiculos`;
const API_PAGAMENTO = `${API}/atualizarpagamento`;
const API_DELETE = `${API}/deletarveiculo`;
const API_ADD = `${API}/adicionarveiculo`;

async function carregar() {
    try {
        const res = await fetch(API_VEICULOS);
        const dados = await res.json();

        const tabela = document.getElementById("tabela");
        tabela.innerHTML = "";

        let total = 0;
        let pagos = 0;
        let pendentes = 0;

        dados.forEach((carro) => {
            total++;
            if (carro.pago) {
                pagos++;
            } else {
                pendentes++;
            }

            // Formatar a data
            const dataEntrada = new Date(carro.horario_entrada);
            const dataFormatada = dataEntrada.toLocaleDateString('pt-BR') + 
                                 ' ' + dataEntrada.toLocaleTimeString('pt-BR').substring(0,5);

            tabela.innerHTML += `      
            <tr>
                <td>${carro.id}</td>
                <td><strong>${carro.placa}</strong></td>
                <td>${carro.modelo}</td>
                <td>
                    <span class="${carro.pago ? 'pago-sim' : 'pago-nao'}">
                        ${carro.pago ? "✅ PAGO" : "❌ PENDENTE"}
                    </span>
                </td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn-pagar ${carro.pago ? 'cancelar' : ''}" 
                            onclick="pagar(${carro.id}, ${carro.pago})">
                        ${carro.pago ? 'Cancelar Pagamento' : 'Marcar como Pago'}
                    </button>
                    <button class="btn-deletar" 
                            onclick="deletar(${carro.id})">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
            `;
        });

        // Atualizar estatísticas
        document.getElementById('totalVeiculos').textContent = total;
        document.getElementById('pagos').textContent = pagos;
        document.getElementById('pendentes').textContent = pendentes;

    } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        alert("Erro ao carregar dados do servidor");
    }
}

async function pagar(id, pagoAtual) {
    try {
        await fetch(`${API_PAGAMENTO}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pago: !pagoAtual })
        });
        carregar();
    } catch (error) {
        console.error("Erro ao atualizar pagamento:", error);
        alert("Erro ao atualizar status de pagamento");
    }
}

async function deletar(id) {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) return;

    try {
        const res = await fetch(`${API_DELETE}/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("🚗 Veículo removido com sucesso!");
            carregar();
        } else {
            alert("❌ Erro ao remover veículo!");
        }
    } catch (error) {
        console.error("Erro ao deletar veículo:", error);
        alert("Erro ao excluir veículo");
    }
}

// Funções para o modal
function abrirModal() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('placa').value = '';
    document.getElementById('modelo').value = '';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

async function adicionarVeiculo() {
    const placa = document.getElementById('placa').value.trim();
    const modelo = document.getElementById('modelo').value.trim();

    if (!placa || !modelo) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        const res = await fetch(API_ADD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placa, modelo })
        });

        if (res.ok) {
            const novoVeiculo = await res.json();
            alert(`✅ Veículo ${novoVeiculo.placa} adicionado com sucesso!`);
            fecharModal();
            carregar();
        } else {
            const erro = await res.json();
            alert(`❌ Erro: ${erro.erro || 'Não foi possível adicionar o veículo'}`);
        }
    } catch (error) {
        console.error("Erro ao adicionar veículo:", error);
        alert("Erro ao adicionar veículo");
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        fecharModal();
    }
}

// Permitir Enter para enviar no modal
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('modal').style.display === 'flex') {
        adicionarVeiculo();
    }
});

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', carregar);