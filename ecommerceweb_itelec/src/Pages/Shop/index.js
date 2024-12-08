import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import HeaderNoSearch from "../../Components/HeaderNoSearch";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 


// Star logo SVG component
const StarLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="orange">
    <polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8" />
  </svg>
);

const SellerHeader = ({ seller_id }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); 
  const [averageRating, setAverageRating] = useState(""); 
  const [ratingCount, setRatingCount] = useState(""); 
  const [fetchError, setFetchError] = useState(null); 

  useEffect(() => {
    if (!seller_id) {
      return; 
    }

    fetch(`http://localhost:5001/api/shops/${seller_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shop details");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          setFetchError(data.message);
          toast.error(data.message);
        } else {
          setUsername(data.username || "Shop Name Not Available");
          setAverageRating(data.average_rating || "No rating available");
          setRatingCount(data.rating_count ? `${data.rating_count} reviews` : "No reviews");
          setFetchError(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching shop details:", error);
        setFetchError("Failed to fetch shop details.");
        toast.error("Failed to fetch shop details.");
      });
  }, [seller_id]);

  const handleChatClick = () => {
    navigate("/Chat");
  };

  return (
    <div className="seller-header">
      <div className="seller-info">
        <div className="seller-details">
          {fetchError ? (
            <p style={{ color: "red" }}>{fetchError}</p>
          ) : (
            <>
              <h2>{username}</h2>
              <div className="ratings-followers">
                <span>
                  <StarLogo /> {averageRating} / 5.0
                </span>
                <span>( {ratingCount} )</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="seller-actions">
     {/* 
  <button className="chat-button" onClick={handleChatClick}>
    Chat
  </button>
*/}
      </div>
    </div>
  );
};

const ProductListShop = ({ seller_id }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    if (!seller_id) {
      console.error('Seller ID is missing');
      return;
    }
  
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/productsshop?seller_id=${seller_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Fetched Products:', data);
  
        if (data.length === 0) {
          toast.error("No products found for this seller.");
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error("Error fetching products: " + error.message);
      }
    };
  
    fetchProducts();
  }, [seller_id]);
  

  

  return (
    <div>
      <div className="product-list-customer">
        {products.length === 0 ? (
          <p>No products found in this shop.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card-customer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image-wrapper-customer">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image-customer"
                  />
                ) : (
                  <div className="placeholder-image-customer">No Image Available</div>
                )}
              </div>
              <h3>{product.name}</h3>
              <div>
                <strong>PHP</strong> {product.price} /{" "}
                <i className="term">
                  {product.term_value} {product.term_id}
                </i>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer /> {/* Toast container to render error messages */}
    </div>
  );
};


// The default export for Shop (making it the main export)
const Shop = () => {
  const location = useLocation(); 
  const [seller_id, setSellerId] = useState(null);

  useEffect(() => {
    // Extract the seller_id from the query string
    const params = new URLSearchParams(location.search);
    const sellerIdFromQuery = params.get("seller_id");
    setSellerId(sellerIdFromQuery);
  }, [location]);

  return (
    <>
      <HeaderNoSearch />
      <div className="shop-page">
        {seller_id ? (
          <>
            <SellerHeader seller_id={seller_id} /> 
            <ProductListShop seller_id={seller_id} /> 
          </>
        ) : (
          <div>No seller found!</div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

// Default export for Shop component
export default Shop; 

// Named exports for the other components (optional)
export { SellerHeader, ProductListShop };
