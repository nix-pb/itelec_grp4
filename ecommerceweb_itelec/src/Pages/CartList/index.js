import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductListCart from '../ProductListCart';
import CheckoutTab from '../../Components/CheckoutTab';
import Header from '../Header';

const CartList =()=>
{
    const navigate = useNavigate();
    const goToHome= () => 
    {
        navigate('/Home')
    }
        return(
        <>
            <Header />
            <div>Cart List</div>
            <ProductListCart/>
            <CheckoutTab/>
        </>
        );
    
}
    
    export default CartList;
    