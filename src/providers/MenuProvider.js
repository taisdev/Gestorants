import React, { useState, useEffect } from "react";
import MenuContext from "../context/menuContext";
import axios from "axios";
import { Outlet } from "react-router-dom";

const CategoriasProvider = () => {
  const [categorias, setCategorias] = useState([]);
  const [itens, setItens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategorias = async (loading) => {
    setIsLoading(loading);
    try {
      await axios
        .get(
          "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/categoria"
        )
        .then((response) => {
          setCategorias(response.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const fetchItens = async (loading) => {
    setIsLoading(loading);
    try {
      await axios
        .get(
          "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/item"
        )
        .then((response) => {
          setItens(response.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias(true);
    fetchItens(true);
  }, []);

  const createCategoria = async (data) => {
    const descricao = data.descricao;
    const urlImage = data.urlImage;
    const refImage = data.refImage;

    const response = await axios.post(
      "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/categoria",
      { descricao, urlImage, refImage}
    );
    fetchCategorias(true);
    return response;
  };

  const deleteCategoria = async (id) => {
    const response = await axios.delete(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/categoria/${id}`
    );
    fetchCategorias(false);
    return response;
  };

  const updateCategoria = async (id, data) => {
    const descricao = data.descricao;
    const urlImage = data.urlImage;
    const refImage = data.refImage;

    const response = await axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/categoria/${id}`,
      { descricao, urlImage, refImage});
    fetchCategorias(true);
    return response;
  };

  const createItem = async (data) => {
    const nome = data.nome;
    const descricao = data.descricao;
    const valor = data.valor;
    const tamanho = data.tamanho;
    const ativo = data.ativo;
    const urlImage = data.urlImage;
    const refImage = data.refImage;
    const categoriaId = data.categoriaId;
    const response = await axios.post(
      "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/item",
      { nome, descricao, valor, tamanho, ativo, urlImage, refImage, categoriaId }
      );
      console.log("createItem from provider");
    fetchItens(true);
    return response;
  };

  const updateItem = async (id, data) => {
    const nome = data.nome;
    const descricao = data.descricao;
    const valor = data.valor;
    const tamanho = data.tamanho;
    const ativo = data.ativo;
    const urlImage = data.urlImage;
    const refImage = data.refImage;

    const response = await axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/item/${id}`,
      { nome, descricao, valor, tamanho, ativo, urlImage, refImage });
    fetchItens(true);
    return response;
  };

  const updateItemAtivo = async (id, data) => {
    await axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/item/${id}`,
      { ativo: data }
    );
    fetchItens(false);
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/item/${id}`
    );
    fetchItens(false);
    return response;
  };


  const values = {
    categorias,
    itens,
    isLoading,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    createItem,
    updateItem,
    updateItemAtivo,
    deleteItem,
  };

  return (
    <MenuContext.Provider value={values}>
      <Outlet />
    </MenuContext.Provider>
  );
};

export default CategoriasProvider;
