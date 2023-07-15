const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const handle = require('express-handlebars')
const db = require('./banco/bd')

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())



const handlebarsInstance = handle.create({
    defaultLayout: 'main',
    runtimeOptions: { allowProtoPropertiesByDefault: true }
  });
app.engine('handlebars',handlebarsInstance.engine)
app.set('view engine','handlebars')

app.use(express.static('estilos'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/front/loginn.html')
})


app.post('/verifica',(req,res)=>{
    var email = req.body.ema
    var senha =req.body.sen
    db.consulta({email:email}).then(response =>{
        if(response.length == 0){
            res.send('EMAIL INVÁLIDO')


        }else if(response.length != 0){
            carct = {
                nome:response[0].nome,
                email:response[0].email,
                senha:response[0].senha,
                telefone:response[0].telefone,
                data:response[0].data
            }
            if(senha != carct.senha && email ==carct.email){
                
                res.send('SENHA NÃO CONFERE')
            }else{
                carct = {
                nome:response[0].nome,
                email:response[0].email,
                senha:response[0].senha,
                telefone:response[0].telefone,
                data:response[0].data

            }
                res.send(carct)

            }

            
        } else{

            console.log('ERRO NO SERVIDOR')
            
    }
    }).catch(err =>{
        console.log(`ERRO ${err}`)
    })
    
    
})

app.get('/areacliente/:email/:nome/:telefone/:data', (req, res) => {
    res.render('pagina_contato',{
        style:'pcontato.css',
        layout: 'contato',
        email:req.params.email,
        nome:req.params.nome,
        telefone:req.params.telefone,
        data:req.params.data
        
    })
});

app.post('/areacliente/:email/:nome/:telefone/:data',(req,res)=>{
    console.log(req.body.data)
    db.verificadata({data:req.body.data}).then((response)=>{
        if(response.length == 1){
            res.send('O HORÁRIO JÁ ESTA OCUPADO')
        }else{
            db.inserir({data:req.body.data}).then(()=>{
                db.consultar({data:req.body.data}).then(response =>{
                    db.agendar({id:response[0].id,email:req.params.email}).then(()=>{
                        res.send('AGENDADO COM SUCESSO')
                })
            }) 
    
        }).catch((err)=>{
            console.log(err)
            
        })

        }
    })
      

})

app.put('/areacliente/:email/:nome/:telefone/:data',(req,res)=>{
    db.atualizar({datanova:req.body.hnovo,atual:req.body.hantigo}).then(()=>{
        res.send('atualizado com sucesso')
    })
})


app.delete('/areacliente/:email/:nome/:telefone/:data',(req,res)=>{
    db.excluicod({email:req.params.email}).then(()=>{
        db.excluiagendamento({email:req.params.data}).then(()=>{
            res.send('CANCELADO COM SUCESSO')
        })
    })
})

app.get('/cadastrar',(req,res)=>{
    res.render('cadastro',{
        style:'cad.css',
        layout:'cadastro'
    })
})

app.post('/cadastrar',(req,res)=>{
    db.verificaremail({email:req.body.email}).then(response =>{
        if(response.length == 0){
            db.inserircliente({nome:req.body.nome,email:req.body.email,telefone:req.body.telefone,senha:req.body.senha}).then(()=>{
                res.send('CONCLUIDO')
            })

        }else{
            res.send('O EMAIL JÁ ESTA CADASTRADO!')

        }
    })
    /*
    db.inserircliente({nome:req.body.nome,email:req.body.email,telefone:req.body.telefone,senha:req.body.senha}).then(()=>{
        res.redirect('/')
    }).catch(err =>{
        console.log(err)
    })
    */

})



app.get('/sobrenos',(req,res)=>{
    res.render('precos',{
        style:'precos.css'
    })
})
app.listen(3000,()=>{
    console.log('SERVER RODANDO...')
})
