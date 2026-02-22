const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Логирование запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Путь к файлу с товарами
const productsFile = path.join(__dirname, 'products.json');

// Загрузка товаров из файла (если файл существует)
let products = [];
try {
    const data = fs.readFileSync(productsFile, 'utf8');
    products = JSON.parse(data);
    console.log(`Загружено ${products.length} товаров из файла`);
} catch (err) {
    console.log('Файл products.json не найден, создаем начальные данные');
    // Начальные данные (10+ товаров)
    products = [
        { id: nanoid(6), name: 'Смартфон Galaxy S23', category: 'Электроника', description: 'Флагманский смартфон с отличной камерой', price: 79999, stock: 15, rating: 4.8 },
        { id: nanoid(6), name: 'Ноутбук MacBook Air M2', category: 'Компьютеры', description: 'Тонкий и легкий ноутбук с мощным процессором', price: 124999, stock: 8, rating: 4.9 },
        { id: nanoid(6), name: 'Наушники Sony WH-1000XM5', category: 'Аудио', description: 'Беспроводные наушники с шумоподавлением', price: 29990, stock: 23, rating: 4.7 },
        { id: nanoid(6), name: 'Планшет iPad Air', category: 'Электроника', description: 'Универсальный планшет для работы и развлечений', price: 54990, stock: 12, rating: 4.8 },
        { id: nanoid(6), name: 'Умные часы Apple Watch', category: 'Гаджеты', description: 'Стильные умные часы с множеством функций', price: 34990, stock: 7, rating: 4.6 },
        { id: nanoid(6), name: 'Кофемашина DeLonghi', category: 'Для дома', description: 'Автоматическая кофемашина для идеального эспрессо', price: 45990, stock: 5, rating: 4.9 },
        { id: nanoid(6), name: 'Фитнес-браслет Xiaomi', category: 'Гаджеты', description: 'Отслеживание активности и пульса', price: 2990, stock: 42, rating: 4.5 },
        { id: nanoid(6), name: 'Внешний SSD 1TB', category: 'Компьютеры', description: 'Быстрый внешний накопитель', price: 8990, stock: 18, rating: 4.7 },
        { id: nanoid(6), name: 'Клавиатура механическая', category: 'Аксессуары', description: 'Механическая клавиатура с подсветкой', price: 5990, stock: 11, rating: 4.6 },
        { id: nanoid(6), name: 'Монитор 27" 4K', category: 'Компьютеры', description: 'Профессиональный монитор с высокой цветопередачей', price: 32990, stock: 6, rating: 4.8 },
        { id: nanoid(6), name: 'Робот-пылесос', category: 'Для дома', description: 'Умный пылесос с лазерной навигацией', price: 24990, stock: 9, rating: 4.7 },
        { id: nanoid(6), name: 'Электронная книга', category: 'Электроника', description: 'С дисплеем без бликов', price: 15990, stock: 14, rating: 4.5 }
    ];
    // Сохраняем в файл
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// Функция для сохранения товаров в файл
const saveProducts = () => {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

// Функция-помощник для поиска товара
const findProductOr404 = (id, res) => {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
};

// ========== CRUD ОПЕРАЦИИ ==========

// GET /api/products - получить все товары
app.get('/api/products', (req, res) => {
    res.json(products);
});

// GET /api/products/:id - получить товар по ID
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    res.json(product);
});

// POST /api/products - создать новый товар
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;
    
    if (!name || !category || !description || !price || !stock) {
        return res.status(400).json({ 
            error: "Необходимо указать название, категорию, описание, цену и количество" 
        });
    }
    
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        rating: rating ? Number(rating) : 0
    };
    
    products.push(newProduct);
    saveProducts();
    res.status(201).json(newProduct);
});

// PATCH /api/products/:id - обновить товар
app.patch('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Нет данных для обновления" });
    }
    
    const { name, category, description, price, stock, rating } = req.body;
    
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    
    saveProducts();
    res.json(product);
});

// DELETE /api/products/:id - удалить товар
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const exists = products.some(p => p.id === id);
    
    if (!exists) {
        return res.status(404).json({ error: "Товар не найден" });
    }
    
    products = products.filter(p => p.id !== id);
    saveProducts();
    res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Необработанная ошибка:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// Запуск сервера
app.listen(port, () => {
    console.log(` Сервер запущен на http://localhost:${port}`);
    console.log(` Доступные маршруты:`);
    console.log(`GET  /api/products - все товары`);
    console.log(`GET  /api/products/:id - товар по ID`);
    console.log(`POST /api/products - создать товар`);
    console.log(`PATCH /api/products/:id - обновить товар`);
    console.log(`DELETE /api/products/:id - удалить товар`);
});