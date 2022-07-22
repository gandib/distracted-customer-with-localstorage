import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getStoredCart, removeFromDb } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [randomProduct, setRandomProduct] = useState([]);

    useEffect(() => {
        fetch('products.json')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    useEffect(() => {
        const storedProduct = getStoredCart();
        const savedProduct = [];
        for (const id in storedProduct) {
            const addedProduct = products.find(product => product.id === id);
            if (addedProduct) {
                savedProduct.push(addedProduct);
            }
        }
        setCart(savedProduct);
    }, [products]);

    const handleAddToCart = (selectedProduct) => {
        let newCart = [];
        let value = cart.length;
        const exists = cart.find(product => product.id === selectedProduct.id);
        if (!exists) {
            if (value < 4) {
                addToDb(selectedProduct.id);
                newCart = [...cart, selectedProduct];
            }
            else {
                alert("Oops... Can't selected more than 4!");
                newCart = [...cart];
            }
        }
        else {
            alert('Product already added.')
            newCart = [...cart];
        }
        setCart(newCart);
        // addToDb(selectedProduct.id);
    }

    const chooseForMeHandle = (cart) => {
        let randomItem;
        let myProducts = cart;
        if (myProducts.length !== 0) {
            randomItem = myProducts[Math.floor(Math.random() * myProducts.length)];
            setRandomProduct(randomItem);
        }
    }

    const resetHandle = () => {
        let resetCart = deleteShoppingCart();
        resetCart = [];
        setCart(resetCart);
        setRandomProduct(resetCart);
    }

    const deleteBtn = (carts) => {
        const deletedItem = carts;
        let finalCart = [...cart];
        const indexOfDeletedItem = finalCart.indexOf(deletedItem);
        finalCart.splice(indexOfDeletedItem, 1); //1 mean 1 item deleted only
        let deleteFromLocal = removeFromDb(carts.id);
        console.log(deleteFromLocal)
        setCart(finalCart);
    }

    return (
        <div className='shop-container'>
            <div className='products-container'>
                {
                    products.map(product => <Product
                        key={product.id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }

            </div>
            <div className='cart-container'>
                <Cart cart={cart}
                    randomProduct={randomProduct}
                    chooseForMeHandle={chooseForMeHandle}
                    resetHandle={resetHandle}
                    deleteBtn={deleteBtn}></Cart>
            </div>
        </div>
    );
};

export default Shop;