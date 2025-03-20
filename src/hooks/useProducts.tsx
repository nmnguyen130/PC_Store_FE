import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://192.168.1.8:5000/products";

export interface Product {
  _id: string;
  name: string;
  type: string;
  price: number;
  image?: string;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      setError("Failed to fetch product details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (
    name: string,
    type: string,
    price: number,
    image_uri: string
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("price", price.toString());
      let file = {
        uri: image_uri,
        type: "image/jpeg",
        name: "product.jpg",
      };
      formData.append("image", file as any);

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts((prev) => [...prev, response.data.product]);
    } catch (err) {
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: string,
    name: string,
    type: string,
    price: number,
    image_uri: string
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("price", price.toString());
      let file = {
        uri: image_uri,
        type: "image/jpeg",
        name: "product.jpg",
      };
      formData.append("image", file as any);

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 5000,
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      );
    } catch (err) {
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;
