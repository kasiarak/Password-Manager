import { createServer } from 'http';
import pool from './db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

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
        if(parsedBody.username==="" || parsedBody.email === "" 
            || parsedBody.password === "" || parsedBody.confirmedPassword === ""){
            res.write(JSON.stringify({message: 'All fields must be complete'}));
            res.end();  
            return;  
        }
        const [users] = await pool.query('SELECT * FROM users');
        const userUsername = users.find((user) => user.username === parsedBody.username)
        const userEmail = users.find((user) => user.email === parsedBody.email);
        if(userUsername){
            res.write(JSON.stringify({message: 'Username already exists'}));
            res.end(); 
            return;
        }
        if(userEmail){
            res.write(JSON.stringify({message: 'Email already exists'}));
            res.end(); 
            return; 
        }
        const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
        if(!parsedBody.email.match(emailPattern)){
            res.write(JSON.stringify({message: 'The email address is not valid. Please enter a valid email address.'}));
            res.end(); 
            return; 
        }
        if(parsedBody.password !== parsedBody.confirmedPassword){
            res.write(JSON.stringify({message: 'Password and confirmation password do not match. Please ensure both passwords are identical.'}));
            res.end(); 
            return;
        }
        const passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$";
        if(!parsedBody.password.match(passwordPattern)){
            res.write(JSON.stringify({message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.'}));
            res.end(); 
            return;
        }
        res.write(JSON.stringify({message: null}));
        const hash = crypto.createHash('sha256');
        hash.update(parsedBody.password);

        await pool.query('INSERT INTO users (id, username, email, password) VALUES (id, ?, ?, ?)',[parsedBody.username, parsedBody.email, hash.digest('hex')])
        res.end(); 
    })
}
const login = (req,res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const parsedBody = JSON.parse(body);
        const { username, password } = parsedBody;
        if(parsedBody.username === "" || password === ""){
            res.write(JSON.stringify({message: 'All fields must be complete'}));
            res.end();  
            return; 
        }
        const [users] = await pool.query('SELECT * FROM users');
        const user = users.find((user) => user.username === username);
        if(user){
            const hash = crypto.createHash('sha256');
            hash.update(password);
            const hashedPassword = hash.digest('hex');
            if(user.password !== hashedPassword){
                res.write(JSON.stringify({ message: 'Password is incorrect' }));
                res.end();
                return;
            }else{
                res.write(JSON.stringify({ message: null }));
                res.end();
                return;
            }
        }else{
            res.write(JSON.stringify({ message: 'User not found' }));
            res.end();
            return;
        }
    })
}

const getUserPasswords = async (req, res) =>{
    const userId = req.url.split('/')[2];
    const [passwords] = await pool.query('SELECT * FROM passwords WHERE user_id = ?', userId);
    res.write(JSON.stringify(passwords));
    res.end();
}

const getDataPassword = async (req, res) =>{
    const id = req.url.split('/')[2];
    const [password] = await pool.query('SELECT * FROM passwords WHERE id = ?', [id])
    res.write(JSON.stringify(password)); 
    res.end();
}

const getUserId = async (req,res) => {
    const username = req.url.split('/')[2];
    const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    res.write(JSON.stringify({ id: user[0].id}));
    res.end();
}

const notFoundHandler = (req,res) => {
    res.write(JSON.stringify({message: 'Route not found'}));
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
        if(req.url === '/registration' && req.method === 'POST'){
            registration(req, res);
        }else if(req.url === '/login' && req.method === 'POST'){
            login(req,res);
        }else if(req.url.match(/\/password\/([0-9]+)/) && req.method === 'GET'){
            getDataPassword(req, res);
        }else if(req.url.match(/\/id\/([A-Za-z0-9_\-]+)/) && req.method === 'GET'){
            getUserId(req, res);
        }else if(req.url.match(/\/passwords\/([0-9]+)/) && req.method === 'GET'){
            getUserPasswords(req, res);
        }else{
            notFoundHandler(req,res); 
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});