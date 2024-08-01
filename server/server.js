import { createServer } from 'http';
const PORT = process.env.PORT;

const server = createServer((req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    res.end();
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});