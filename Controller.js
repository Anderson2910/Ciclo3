const express = require('express');
const cors = require('cors');

const {Sequelize} =require('./models');

const models=require('./models');

//const req = require('express/lib/request');//

const app=express();
app.use(cors());
app.use(express.json())

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', function(req, res){
    res.send('Olá, mundo')
});

app.get('/servicos', async(req,res) =>{
    await servico.create({
       nome: "HTML/CSS",
       descricao: "Paginas estáticas estilizadas",
       createAt: new Date(),
       updateAt: new Date()  
    });
    res.send('Servico criado com sucesso!');
});

app.get('/servicos', async(req,res) =>{
    await servico.create({
       nome: "Nodejs",
       descricao: "Desenvolvimento de aplicacao back-end",
       createAt: new Date(),
       updateAt: new Date() 
    });
    res.send('Servico criado com sucesso!');
});

app.post('/servicos', async(req,res) =>{
    await servico.create({
       nome: "Delphi",
       descricao: "Manutencao e suporte a sistemas legados em Delphi",
    });
    res.send('Servico criado com sucesso!');
});

app.post('/servicos', async(req,res) =>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Servico criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi Impossivel se conectar." 
        })
    });  
});



app.get('/clientes', async(req,res) =>{
    await cliente.create({
       nome: "Anderson Paulim",
       endereco: "Rua Diamante, 585",
       cidade: "Maringá",
       uf: "PR",
       nascimento: '1977-10/29',
       clienteDesde: '2021-10-04'
    });
    res.send('Cliente criado com sucesso!');

});

app.get('/pedidos', async(req,res) =>{
    await pedido.create({
       ClienteId: 1, 
       data: '2021-10-04'
    });
    res.send('Pedido criado com sucesso!');

});

app.get('/itenspedido', async(req,res) =>{
    await itempedido.create({
       PedidoId: 1, 
       ServicoId: 2,
       quantidade: 3,
       valor: 100.0
    });
    res.send('Item criado com sucesso!');
});

app.get('/listaservicos', async(req, res)=>{
    await servico.findAll({
        //raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/listaclientes', async(req, res)=>{
    await servico.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});



app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: nao foi possivel conectar!"
        });
    });
});

// app.get('/atualizaservico', async(req, res)=>{
//    await servico.findByPk(1)
//    .then(serv =>{
//        serv.nome ='HTML/CSS/JS';
//        serv.descricao = 'Paginas estaticas e dinamicas estilizadas';
//        serv.save();
//        return res.json({serv});
//    });
// });

app.put('/atualizaservico', async(req, res)=>{
       await servico.update(req.body,{
           where: {id: req.body.id}
       }).then(function(){
           return res.json({
               error: false,
               message: "Servico foi alterado com sucesso!"
           });
       }).catch(function(erro){
           return res.status(400).json({
               error: true,
               message: "Erro na alteracao do servico."
           });
       });
       
    });

app.get('/pedidos/id', async(req, res)=>{
    await pedido. findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})

app.put('/pedidos/id/aditaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido nao foi encontrado.'
        });
    };

    if (!await servico.findByPk(req.body.Servicoid)){
        return res.status(400).json({
            error: true,
            message: 'Servico nao foi encontrado.'
        });
    }; 
    
    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Pedido foi alterado com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: nao foi possivel alterar."
        });
    });

});

app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluido com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            messagem: "Erro ao excluir o cliente."
        });
    });
});

app.get('/excluircliente:id', async(req, res)=>{
    cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluido com sucesso!"
        });
    }).catch(function(erro){
        return res. status(400).json({
            error: true,
            messagem: "Erro ao excluir o cliente."
        });
    });
});


let port=process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})
