const express = require("express")
const cors = require("cors");
const PORTA = 3000;
const app = express();
app.use(cors());
app.use(express.json());

let VEICULOS = [
    { id: 1, placa: "ABC-1234", modelo: "Fusca", pago: true, horario_entrada: new Date().toISOString() },
    { id: 2, placa: "XYZ-5678", modelo: "Civic", pago: false, horario_entrada: new Date().toISOString() },
    { id: 3, placa: "DEF-9012", modelo: "Corolla", pago: true, horario_entrada: new Date().toISOString() },
    { id: 4, placa: "GHI-3456", modelo: "Onix", pago: false, horario_entrada: new Date().toISOString() }
]

app.get("/", (req, res) => {
    res.status(200).json({ msg: "Sistema de Estacionamento API" })
})

app.get("/lerveiculos", (req, res) => {
    res.status(200).json(VEICULOS)
})

app.get("/lerveiculos/:id", (req, res) => {
    const id = req.params.id;
    console.log(id)
    const meuCarro = VEICULOS.find(veiculo => veiculo.id === Number(id))

    if (!meuCarro) {
        return res.status(404).json({ erro: "Veículo não encontrado" });
    }

    res.status(200).json(meuCarro);
})

app.patch("/atualizarpagamento/:id", (req, res) => {
    const veiculo = VEICULOS.find(x => x.id === Number(req.params.id));
    if (!veiculo) return res.status(404).json({ erro: "Veículo não encontrado" });

    const { pago } = req.body;
    if (pago !== undefined) veiculo.pago = pago;

    res.json(veiculo)
})

app.delete("/deletarveiculo/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = VEICULOS.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Veículo não encontrado" });
    }

    const removido = VEICULOS.splice(index, 1);
    res.status(200).json({ msg: "Veículo removido com sucesso", removido });
});

// Adicionar novo veículo
app.post("/adicionarveiculo", (req, res) => {
    const { placa, modelo } = req.body;
    
    if (!placa || !modelo) {
        return res.status(400).json({ erro: "Placa e modelo são obrigatórios" });
    }

    const novoId = VEICULOS.length > 0 ? Math.max(...VEICULOS.map(v => v.id)) + 1 : 1;
    
    const novoVeiculo = {
        id: novoId,
        placa,
        modelo,
        pago: false,
        horario_entrada: new Date().toISOString()
    };

    VEICULOS.push(novoVeiculo);
    res.status(201).json(novoVeiculo);
});

app.listen(PORTA, () => {
    console.log(`🚗 Servidor de estacionamento rodando em http://localhost:${PORTA}`)
})