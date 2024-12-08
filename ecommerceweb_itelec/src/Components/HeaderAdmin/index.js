import React from "react";
import { useNavigate, Link } from "react-router-dom";

const HeaderAdmin = () => {
    const navigate = useNavigate();

    const goToAccountProfile = () => {
        navigate("/AccountProfile");
    };

    // Updated Icon Component
    const Icon = ({ name, color }) => {
        const icons = {
            profile: <i className="fas fa-user text-2xl" style={{ color }}></i>,
            orders: <i className="fas fa-box text-2xl" style={{ color }}></i>,
            cart: <i className="fas fa-shopping-cart text-2xl" style={{ color }}></i>,
        };
        return icons[name] || null;
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                backgroundColor: "#1e3a8a",
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
                    backgroundColor: "#192B44",
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
                        gap: "20px",
                    }}
                >
                    {/* Profile Button */}
                    <button
                        onClick={goToAccountProfile}
                        style={{
                            backgroundColor: "#E8982D",
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
