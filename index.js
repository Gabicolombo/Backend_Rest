const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
const door = 3001;

const dados = [
  {
    "id":1,
    "nome":"Gabriela Colombo",
    "idade": 21,
    "Área atuante": "Tecnologia"
  },
  {
    "id":2,
    "nome":"Giovana Rodrigues",
    "idade": 20,
    "Área atuante": "Medicina"
  }
];

// Read all
app.get('/dados', (req, res)=>{
  // retorna o que não estiver vazio
  res.send(dados.filter(Boolean));
})

// Read id
app.get('/dados/:id', (req, res)=>{
  const index = req.params.id - 1;
  const value = dados[index];
  if(value == null) res.send("Esse usuário não existe");
  else res.send(value);
})

// Create new user
app.post('/dados', (req, res) => {
  const data = req.body;
  data.id = dados.length + 1;
  dados.push(data);
  res.send("Mensagem criada com sucesso...");
})

// Update information
app.put('/dados/:id', (req, res)=>{
  const id = +req.params.id;

  const newDatas = req.body;
  
  const index = dados.findIndex(msg => msg.id ===id);
  if(index == null) res.send("Não existe esse usuário");
  else{
    const mesage = dados[index];

    // esse ... pega todas as propriedades do mesage (que é o que já
    // está na lista) e do newDatas (que são as informações atualizadas)
    dados[index]= {
      ...mesage,
      ...newDatas
    };

    res.send('Mensagem atualizada com sucesso');
  }
  
})

// Delete
app.delete('/dados/:id', (req, res) =>{
  const id = +req.params.id;

  const index = dados.findIndex(msg=> msg.id === id);
  if (index == null) res.send("Esse id não existe");
  else{
    delete dados[index];
    res.send('Mensagem removida com sucesso');
  }
})

app.listen(door, ()=>{
  console.info('Servidor rodando em http://localhost: ' + door);
})

