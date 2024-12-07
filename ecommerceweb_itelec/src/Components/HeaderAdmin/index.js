import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const HeaderAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const goToAccountProfile = () => {
        navigate("/AccountProfile");
    };

    const pageTitles = {
        "/Home": "Home",
        "/SignIn": "Sign In",
        "/SignUp": "Sign Up",
        "/Orders": "History",
        "/PurchaseForm": "Renting",
        "/CartList": "Cart",
        "/AdminAddProduct": "Add Product",
        "/AdminHome": "Home",
        "/AccountProfile": "Profile",
        "/EditProduct/:id": "Edit Product",
    };

    const currentPageTitle = pageTitles[location.pathname] || "Page";

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
                {/* Left Section */}
                <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                    <button
                        onClick={handleBack}
                        style={{
                            backgroundColor: "#E8982D", // Orange
                            color: "white",
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
                        <span style={{ fontSize: "20px" }}>&#8592;</span>
                    </button>
                    <p style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "10px" }}>
                        {currentPageTitle}
                    </p>
                </div>

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
        </div>
    );
};

export default HeaderAdmin;
