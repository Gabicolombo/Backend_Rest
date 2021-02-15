const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID, ObjectId} = require('mongodb');
(async() =>{

  const dbName = 'Backend_Rest';
  //const url = 'mongodb://localhost:27017';
  const url = 'mongodb+srv://admin:ll6zsQlAPOOXHapM@cluster0.aao1d.mongodb.net/Backend_Rest?retryWrites=true&w=majority';

  
  console.log('Conectando com o banco de dados MongoDB');

  const client = await MongoClient.connect(url, {useUnifiedTopology: true});
  console.log('MongoDB conectado com sucesso');

  const db = client.db(dbName);

  const app = express();

  app.use(bodyParser.json());
  const door = process.env.PORT || 3001;

  const dados = db.collection('dados');

  // Read all
  app.get('/dados', async (req, res)=>{
    // retorna o que não estiver vazio
    res.send(await dados.find().toArray());
  })

  // Read id
  app.get('/dados/:id', async (req, res)=>{
    const id = req.params.id;

    const data = await dados.findOne({_id: ObjectID(id)})
    if(data == null) res.send('Não temos essa informação no banco de dados');
    else res.send(data);
  })

  // Create new user
  app.post('/dados', async (req, res) => {
    const id = req.body.id;
    // verificando se já está no bando de dados
    const identificador = await dados.findOne({id: id})
    if (identificador != null){
      res.send("Esse usuário já existe");
      return;
    } 
    const data = req.body;
    if(!data) {
      res.send("Mensagem inválida");
      return;
    }
    await dados.insertOne(data);
    res.send("Mensagem criada com sucesso...");
  })

  // Update information
  app.put('/dados/:id', async (req, res)=>{
    const id = req.params.id;
    const newDatas = req.body;
    const data = await dados.findOne({_id: ObjectId(id)})

    if(data == null) res.send("Não existe esse usuário");
    else{
      await dados.updateOne(
        {_id: ObjectId(id)},
        { $set:{
          ... newDatas
        }}
        
      )
      res.send('Mensagem atualizada com sucesso');
    }
    
  })

  // Delete
  app.delete('/dados/:id', async (req, res) =>{
    const id = req.params.id;
    console.log(id);
    const data = await dados.findOne({_id: ObjectID(id)})
    if (!data){
      res.send("Esse usuário não existe no banco de dados");
      return
    }
    await dados.deleteOne({_id:ObjectID(id)});
    res.send('Mensagem removida com sucesso');
    
  })

  app.listen(door, ()=>{
    console.info('Servidor rodando em http://localhost:' + door);
  })

})();