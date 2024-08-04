import { createServer } from 'http';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;

const jsonMiddleWare = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next(); 
}
const registration = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () =>{
        const parsedBody = JSON.parse(body);
        const { username, email, password, confirmedPassword } = parsedBody;
        const [users] = await pool.query('SELECT * FROM users');
        const userUsername = users.find((user) => user.username === parsedBody.username)
        const userEmail = users.find((user) => user.email === parsedBody.email);
        if(parsedBody.username==="" || parsedBody.email==="" 
            || parsedBody.password==="" || parsedBody.confirmedPassword===""){
            res.write(JSON.stringify({message: 'All fields must be complete'}));
            res.end();  
            return;  
        }else if(userUsername){
            res.write(JSON.stringify({message: 'Username already exists'}));
            res.end(); 
        }else if(userEmail){
            res.write(JSON.stringify({message: 'Email already exists'}));
            res.end(); 
        }
    })
}
const notFoundHandler = (req,res) => {
    res.statusCode = 404;
    res.write(JSON.stringify({message: 'Route not foundee'}));
    res.end();
}

const server = createServer((req, res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    jsonMiddleWare(req, res, () => {
        if(req.url==='/registration' && req.method==='POST'){
            registration(req, res);
        }else{
            notFoundHandler(req,res); 
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});