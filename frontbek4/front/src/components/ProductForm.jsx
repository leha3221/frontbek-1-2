import React, { useState, useEffect } from 'react';

export default function ProductForm({ open, mode, initialProduct, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        stock: '',
        rating: ''
    });

    useEffect(() => {
        if (!open) return;
        
        if (initialProduct) {
            setFormData({
                name: initialProduct.name || '',
                category: initialProduct.category || '',
                description: initialProduct.description || '',
                price: initialProduct.price || '',
                stock: initialProduct.stock || '',
                rating: initialProduct.rating || ''
            });
        } else {
            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                stock: '',
                rating: ''
            });
        }
    }, [open, initialProduct]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Введите название товара');
            return;
        }
        if (!formData.category.trim()) {
            alert('Введите категорию');
            return;
        }
        if (!formData.description.trim()) {
            alert('Введите описание');
            return;
        }
        
        const price = Number(formData.price);
        if (!price || price <= 0) {
            alert('Введите корректную цену (больше 0)');
            return;
        }
        
        const stock = Number(formData.stock);
        if (!Number.isFinite(stock) || stock < 0) {
            alert('Введите корректное количество (0 или больше)');
            return;
        }
        
        const rating = formData.rating ? Number(formData.rating) : 0;
        if (rating < 0 || rating > 5) {
            alert('Рейтинг должен быть от 0 до 5');
            return;
        }
        
        onSubmit({
            id: initialProduct?.id,
            name: formData.name.trim(),
            category: formData.category.trim(),
            description: formData.description.trim(),
            price: price,
            stock: stock,
            rating: rating
        });
    };

    const title = mode === 'edit' ? 'Редактировать товар' : 'Добавить новый товар';

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title">{title}</h2>
                    <button className="modal__close" onClick={onClose}>✕</button>
                </div>
                
                <form className="modal__form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название товара *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Например: Смартфон Galaxy S23"
                            autoFocus
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Категория *</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Например: Электроника"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Описание *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Краткое описание товара"
                            rows="3"
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Цена (₽) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="79999"
                                min="0"
                                step="1"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Количество *</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="10"
                                min="0"
                                step="1"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Рейтинг (0-5)</label>
                        <input
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="4.5"
                            min="0"
                            max="5"
                            step="0.1"
                        />
                    </div>
                    
                    <div className="modal__footer">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === 'edit' ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}