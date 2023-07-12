const conectar = async ()=>{
if(global.conexao && global.conexao.state != 'disconected')
    return global.conexao

const mysql = require('mysql2/promise')
const con = await mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'M@gnus1990',
    database:'barbearia'

})

console.log('CONECTOU AO BANCO')
global.conexao = con
return con

}

const consulta = async(cliente)=>{

    const con = await conectar()
    const valores = [cliente.email]
    const [linhas] = await con.query('SELECT c.nome, c.email, c.senha, c.telefone, COALESCE(DATE_FORMAT(a.data, "%Y-%m-%d %H:%i:%s"), "SEM AGENDAMENTO") AS data FROM clientes c LEFT JOIN agendamentos a ON a.id = c.codagendamento WHERE c.email = ?', valores);
    return await linhas

}

const inserir = async(cliente)=>{
    const con = await conectar()
    const valores = [cliente.data]
    con.query('INSERT INTO agendamentos(data) VALUES(?)',valores)
}

const consultar = async(cliente) =>{
    const con = await conectar()
    const valores = [cliente.data]
    const [linhas] = await con.query('SELECT id FROM agendamentos WHERE data = ?',valores)
    return await linhas

}

const agendar = async(cliente)=>{
    const con = await conectar()
    const valores = [cliente.id,cliente.email]
    con.query('UPDATE clientes SET codagendamento = ? where email = ?',valores)
}

const atualizar = async(cliente)=>{
    const con = await conectar()
    const valores = [cliente.datanova,cliente.atual]
    con.query('UPDATE agendamentos SET data = ? WHERE data = ?',valores)

}

const excluicod = async(cliente)=>{
    const con = await conectar()
    const valores = [cliente.email]
    con.query('UPDATE clientes SET codagendamento = NULL WHERE email = ?',valores)
}

const excluiagendamento = async(cliente)=>{
    const con = await conectar()
    const valores = [cliente.email]
    con.query('DELETE FROM agendamentos WHERE data = ?',valores)
}

const inserircliente = async(cliente)=>{
    const con = await conectar()
    const valores = [cliente.nome,cliente.email,cliente.telefone,cliente.senha]
    con.query('INSERT INTO clientes(nome,email,telefone,senha) VALUES (?,?,?,?)',valores)

}
module.exports = {
    consulta,inserir,consultar,agendar,atualizar,excluicod,excluiagendamento,inserircliente
}