import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { button, icon } from "./style";
import { useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../redux/slices/cartSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [error, setError] = useState("");

    // Sync guest cart to server
    const syncGuestCartToServer = async () => {
        try {
            const guestCart = localStorage.getItem("guestCart");
            if (!guestCart) return;

            const guestCartItems = JSON.parse(guestCart);
            if (guestCartItems.length === 0) return;

            // Add each item from guest cart to server cart
            for (const item of guestCartItems) {
                try {
                    await dispatch(
                        addToCart({
                            product_type: item.product_type,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price_id: item.price_id,
                        })
                    ).unwrap();
                } catch (error) {
                    console.error("Error adding item to cart:", error);
                }
            }

            // Clear guest cart after successful sync
            localStorage.removeItem("guestCart");

            // Fetch updated cart
            await dispatch(fetchCart());

            // Trigger event to update navbar and other components
            window.dispatchEvent(new Event("guestCartUpdated"));
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error syncing guest cart:", error);
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await api.get("common/data?param=Roles");
                setRoles(res.data.data || []);

                if (res.data.data.length > 0) {
                    setFormData((prev) => ({ ...prev, role: res.data.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch roles:", err);
                setError("Failed to load roles. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError("");
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (!formData.role) {
            setError("Please select a role");
            return false;
        }

        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const submitFormData = new FormData();
        submitFormData.append("email", formData.email);
        submitFormData.append("password", formData.password);
        submitFormData.append("choose_the_role", formData.role);

        try {
            setLoginLoading(true);
            setError("");
            const res = await api.post("login", submitFormData);

            if (res.data.success && res.data.data) {
                const data = res.data.data;
                const { access_token, full_name } = data;
                const roleRaw = data.role != null ? (typeof data.role === 'object' ? data.role?.name : data.role) : '';
                const roleModify = roleRaw ? String(roleRaw).toLowerCase().trim() : '';
                localStorage.setItem("token", access_token);
                localStorage.setItem("role", roleModify);
                localStorage.setItem("userData", JSON.stringify(data));
                if (full_name) localStorage.setItem("userName", full_name);

                await syncGuestCartToServer();

                window.dispatchEvent(new Event("login"));

                if (roleModify === "parent" && process.env.REACT_APP_PARENT_URL) {
                    window.location.href = process.env.REACT_APP_PARENT_URL;
                } else {
                    navigate("/", { replace: true });
                }
            } else {
                setError(res.data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            const errMsg =
                error.response?.data?.message || "Login failed! Please try again.";
            setError(errMsg);
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <>
            <Grid container sx={{ height: "100vh" }}>
                {/* Left Section */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        backgroundImage: `url("/assets/images/signup-bg.png")`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 4,
                        py: 9,
                    }}
                >
                    <img
                        src="/assets/images/hero-right-img.png"
                        alt="Character"
                        style={{ width: "80%", maxWidth: "300px" }}
                    />
                </Grid>

                {/* Right - Form */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        backgroundColor: "#fff",
                        py: 6,
                        px: { xs: 4, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: 400 }}>
                        {/* Logo */}
                        <Box sx={{ mb: 4 }}>
                            <img
                                src="/assets/images/logo.svg"
                                alt="Logo"
                                style={{ height: '100px', width: 'auto' }}
                            />
                        </Box>

                        {/* Heading */}
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                            <Box component="span" sx={{ color: "#D6232A" }}>
                                Login
                            </Box>
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={onSubmit}>
                            {/* Role Selection */}
                            <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
                                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                                    Select Your Role
                                </FormLabel>
                                {loading ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Loading roles...
                                    </Typography>
                                ) : (
                                    <RadioGroup
                                        row
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                    >
                                        {roles.map((role) => (
                                            <FormControlLabel
                                                key={role.id}
                                                value={role.id}
                                                control={<Radio />}
                                                label={`I am ${role.name}`}
                                            />
                                        ))}
                                    </RadioGroup>
                                )}
                            </FormControl>

                            {/* Email */}
                            <TextField
                                fullWidth
                                name="email"
                                placeholder="Email"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!error && !formData.email}
                                sx={{ mb: 2 }}
                                disabled={loginLoading || loading}
                            />

                            {/* Password */}
                            <TextField
                                fullWidth
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                variant="outlined"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={!!error && !formData.password}
                                sx={{ mb: 2 }}
                                disabled={loginLoading || loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleTogglePasswordVisibility}
                                                edge="end"
                                                sx={{ color: "#666" }}
                                                disabled={loginLoading || loading}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                                <Button
                                    type="submit"
                                    disableElevation
                                    sx={{
                                        ...button,
                                        backgroundColor: "#EF2A1E",
                                        color: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#EF2A1E",
                                        },
                                        "&.Mui-disabled": {
                                            backgroundColor: "#EF2A1E",
                                            color: "#fff",
                                            opacity: 0.7,
                                        },
                                    }}
                                    disabled={loginLoading || loading}
                                >
                                    {loginLoading ? "Logging in..." : "Login"}
                                    {!(loginLoading || loading) && (
                                        <Box sx={icon}>
                                            <ArrowForwardIcon sx={{ fontSize: 20, color: "#EF2A1E" }} />
                                        </Box>
                                    )}
                                </Button>
                            </Box>
                        </form>

                        {/* Footer Link */}
                        <Typography
                            sx={{ textAlign: "center", color: "#555", mt: 3 }}
                        >
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                style={{
                                    color: "#D6232A",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Sign up here
                            </Link>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default Login;
