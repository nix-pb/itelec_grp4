import React from "react";
import { useNavigate, Link } from "react-router-dom";

const HeaderHome = ({ onSearch }) => { 
    const navigate = useNavigate();

    const goToAccountProfile = () => {
        navigate("/AccountProfile");
    };

    const goToCartList = () => {
        navigate("/CartList");
    };

    const goToOrders = () => {
        navigate("/Orders");
    };

    const handleSearch = (event) => {
        onSearch(event.target.value);
    };

    // Updated Icon Component
    const Icon = ({ name, color }) => {
        const icons = {
            profile: <i className="fas fa-user text-2xl" style={{ color }}></i>,
            orders: <i className="fas fa-box text-2xl" style={{ color }}></i>,
            cart: <i className="fas fa-shopping-cart text-2xl" style={{ color }}></i>,
            search: <i className="fas fa-search text-2xl" style={{ color }}></i>,
        };
        return icons[name] || null;
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                backgroundColor: "#1e3a8a", // Dark blue
                color: "white",
            }}
        >
            {/* Top Header Section */}
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "#192B44", // Blue
                    height: "70px",
                }}
            >
                {/* Center Section - Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "300px",
                    }}
                >
                    <Link
                        to="/Home"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "white",
                        }}
                    >
                        <img
                            src="https://storage.googleapis.com/a1aa/image/OtRcMNHfsyTGeEa3FpdtsCmBmFoYfZMnQvmIJ7Uv84ZCfbJPB.jpg"
                            alt="Tool Zone Logo"
                            style={{ height: "40px", marginRight: "10px", width: "40px" }}
                        />

                        <span style={{ fontSize: "24px", fontWeight: "bold" }}>TOOL ZONE</span>
                    </Link>
                </div>

                {/* Right Section */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        gap: "30px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            width: "200px",
                            height: "40px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search products"
                            onChange={handleSearch}
                            style={{
                                padding: "8px",
                                border: "none",
                                borderRadius: "20px 0 0 20px",
                                outline: "none",
                                width: "160px",
                                height: "100%",
                            }}
                        />
                        <button
                            style={{
                                backgroundColor: "#E8982D", // Orange
                                border: "none",
                                padding: "10px",
                                borderRadius: "0 20px 20px 0",
                                cursor: "pointer",
                                height: "100%",
                                width: "40px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Icon name="search" color="#FFFFFF" />
                        </button>
                    </div>
                    <button
                        onClick={goToAccountProfile}
                        style={{
                            backgroundColor: "#E8982D", // Orange
                            border: "none",
                            padding: "10px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Icon name="profile" color="#FFFFFF" />
                    </button>
                </div>
            </header>

            {/* Bottom Navigation Section */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    backgroundColor: "#C1460E", // Red
                    padding: "10px",
                    alignItems: "center",
                    height: "60px",
                    gap: "20px",
                }}
            >
                <div
                    onClick={goToOrders}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        height: "100%",
                        width: "120px",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Icon name="orders" color="#FFCF36" />
                    <span style={{ fontSize: "16px", fontWeight: "bold", marginLeft: "8px" }}>
                        Orders
                    </span>
                </div>
                <div
                    onClick={goToCartList}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        height: "100%",
                        width: "120px",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Icon name="cart" color="#FFCF36" />
                    <span style={{ fontSize: "16px", fontWeight: "bold", marginLeft: "8px" }}>
                        Cart
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HeaderHome;
