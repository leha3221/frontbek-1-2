import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onEdit, onDelete }) {
    if (!products || products.length === 0) {
        return (
            <div className="empty-state">
                <p>Товаров пока нет</p>
                <p className="empty-state__hint">Нажмите "Добавить товар", чтобы создать первый товар</p>
            </div>
        );
    }

    return (
        <div className="products-grid">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}