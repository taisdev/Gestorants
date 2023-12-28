import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAuth } from "../../context/authContext";
import logoImg from "../../assets/logo.png";
import { Box, Button, Container, IconButton, TextField } from "@mui/material";
import Loading from "../../components/loader/Loading";
import ErrorMensage from "../../firebase/errorMensage";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signIn } = UserAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    password: Yup.string().required("Campo obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await signIn(values.email, values.password);
        setIsLoading(false);
        navigate("/pedidos");
      } catch (error) {
        setIsLoading(false);
        const errorCode = error.code;
        const errorMessage = ErrorMensage(errorCode);
        toast.error(errorMessage);
      }
    },
  });

  const { email, password } = formik.values;
  const { handleSubmit } = formik;

const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <section className="login">
      {isLoading && <Loading />}
      <ToastContainer />
      <div className="login-box">
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="login-img">
              <img src={logoImg} alt="logo" />
              <span>Gestorants</span>
            </div>
            <Box
              component="form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <TextField
                sx={{
                  textAlign: "center",
                }}
                margin="dense"
                label="Usuário"
                variant="standard"
                type="text"
                name="email"
                value={email}
                fullWidth
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                sx={{
                 marginBottom: 8,
                 marginTop: 5,

                }}
                margin="dense"
                label="Senha"
                variant="standard"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={togglePasswordVisibility}
                      variant="outlined"
                    >
                       {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </IconButton>
                  ),
                }}
                fullWidth
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
                <Button
                  variant="contained"
                  size="large"
                  className="--btn --btn-block"
                  type="submit"
                >
                  Entrar
                </Button>
            </Box>
          </Box>
        </Container>
      </div>
    </section>
  );
};

export default Login;
