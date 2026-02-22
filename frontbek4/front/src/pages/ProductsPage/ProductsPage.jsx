import React, { useState, useEffect } from 'react';
import './ProductsPage.scss';
import ProductList from '../../components/ProductList';
import ProductForm from '../../components/ProductForm';
import { api } from '../../api';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки товаров. Убедитесь, что сервер запущен.');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode('edit');
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm('Вы уверены, что хотите удалить этот товар?');
        if (!ok) return;

        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            alert('Ошибка удаления товара');
        }
    };

    const handleSubmitModal = async (productData) => {
        try {
            if (modalMode === 'create') {
                const newProduct = await api.createProduct(productData);
                setProducts(prev => [...prev, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(productData.id, productData);
                setProducts(prev => prev.map(p => 
                    p.id === productData.id ? updatedProduct : p
                ));
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert('Ошибка сохранения товара');
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">🛒 Internet Shop</div>
                    <div className="header__right">
                        <span className="header__stats">
                            Товаров: {products.length}
                        </span>
                    </div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Каталог товаров</h1>
                        <button className="btn btn--primary" onClick={openCreateModal}>
                            + Добавить товар
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading">Загрузка товаров...</div>
                    ) : (
                        <ProductList
                            products={products}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">
                    © {new Date().getFullYear()} Internet Shop. Все права защищены.
                </div>
            </footer>

            <ProductForm
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}