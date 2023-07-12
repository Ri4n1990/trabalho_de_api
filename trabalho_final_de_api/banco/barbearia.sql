CREATE DATABASE barbearia;
USE barbearia;

CREATE TABLE clientes(

id INT NOT NULL AUTO_INCREMENT,
nome VARCHAR(100)  NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
telefone INT NOT NULL,
codagendamento INT,
PRIMARY KEY(id),
FOREIGN KEY(codagendamento) REFERENCES agendamentos(id)


);

ALTER TABLE clientes ADD COLUMN senha VARCHAR(100);


CREATE TABLE agendamentos(

id INT NOT NULL AUTO_INCREMENT,
data  DATETIME UNIQUE,
PRIMARY KEY(id)
);

