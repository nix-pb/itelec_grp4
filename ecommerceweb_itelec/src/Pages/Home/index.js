import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import ProductListCustomer from '../ProductListCustomer';
import '../Home/index.css';
import HeaderHome from '../../Components/HeaderHome';






const Home = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null); 
    


    const goToOrders = () => 
        {
            navigate('/Orders');
        };



    const goToCartList = () => {
        navigate('/CartList');
    };




    const goToAdminHome = () => {
        navigate('/AdminHome');
    };


    

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId); 
    };


    const [searchQuery, setSearchQuery] = useState("");


    return (
        <>
            <HeaderHome onSearch={setSearchQuery} />
            <div className='row'>
                <button onClick={() => handleCategoryClick(1)} className='category_buttons'>Hand Tools</button>
                <button onClick={() => handleCategoryClick(2)} className='category_buttons'>Electric Tools</button>
                <button onClick={() => handleCategoryClick(3)} className='category_buttons'>Heavy Tools</button>
            </div>
            
            <div>
                <ProductListCustomer selectedCategory={selectedCategory}  searchQuery={searchQuery} />
            </div>
        </>
    );


}

export default Home;
