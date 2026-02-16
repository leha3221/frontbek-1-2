const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let products = [
    { id: 1, name: 'Телефон', price: 79999 },
    { id: 2, name: 'Ноутбук', price: 124999 },
    { id: 3, name: 'Наушники', price: 8990 }
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ 
            message: 'Необходимо указать название (name) и стоимость (price)' 
        });
    }
    
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    const { name, price } = req.body;
    
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    products.splice(productIndex, 1);
    res.json({ message: 'Товар успешно удален' });
});

app.get('/', (req, res) => {
    res.send(`
        <h1>API управления товарами</h1>
        <p>Доступные маршруты:</p>
        <ul>
            <li><b>GET /products</b> - получить все товары</li>
            <li><b>GET /products/:id</b> - получить товар по ID</li>
            <li><b>POST /products</b> - создать товар (нужен JSON: {"name": "...", "price": ...})</li>
            <li><b>PATCH /products/:id</b> - обновить товар</li>
            <li><b>DELETE /products/:id</b> - удалить товар</li>
        </ul>
    `);
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});