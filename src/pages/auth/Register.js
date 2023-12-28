import React, { useState } from "react";
import "./auth.scss";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loader/Loading";
import  ErrorMensage from "../../firebase/errorMensage";
import { toast, ToastContainer } from "react-toastify";
 import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                  user: email,
                  password: password,
                  typeAccount: account
                })
              });
      setIsLoading(false);
      navigate('/pedidos')
    } catch (error) {
      setIsLoading(false);
      const errorCode = error.code;
      const errorMessage = ErrorMensage(errorCode);
      toast.error(errorMessage);
    }
  };

  return (
    <section>
      {isLoading && <Loading />}
      <ToastContainer />
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="user"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="name">Usuário</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="pass"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="pass">Senha</label>
          </div>
          <div className="user-box">
            <select value={account} onChange={(e) => setAccount(e.target.value)}>
              <option value="" selected>Tipo de usuário</option>
              <option value="admin">Admin</option>
              <option value="user">Usuário</option>
            </select>
          </div>
          <div className="button-form">
            <button className=" --btn --btn-block --btn-primary" type="submit">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
