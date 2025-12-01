"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/interfaces/interfaces";
import AddProductModal from "@/components/modals/AddProductModal";
import EditProductModal from "@/components/modals/EditProductModal";
import { productService } from "@/services/products";
import { Notificaction } from "@/helpers/utils";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function DashboardPage() {
  const router = useRouter();
  const { isAdmin, loading, user } = useAuth();
  const { t } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Notificaction(t("dashboard.error") || "Error loading products", "error");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(t("dashboard.confirmDelete"))) return;

    try {
      await productService.delete(productId, user?.email);
      Notificaction(t("dashboard.deleted"), "success");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      Notificaction(t("dashboard.error") || "Error deleting product", "error");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  // Nombre “inteligente” (multi-idioma)
  const getProductName = (product: Product) =>
    (product as any).name_es ||
    (product as any).name_en ||
    (product as any).name ||
    "";

  // Redirect si NO es admin
  useEffect(() => {
    if (!loading && !isAdmin()) {
      router.push("/login");
    }
  }, [loading, isAdmin, router]);

  // Cargar productos solo si es admin
  useEffect(() => {
    if (!loading && isAdmin()) {
      void fetchProducts();
    }
  }, [loading, isAdmin]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "black",
          color: "white",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t("dashboard.loading")}</Typography>
      </Box>
    );
  }

  if (!isAdmin()) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("dashboard.title")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
        >
          {t("dashboard.addProduct")}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "#111", color: "white" }}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "gray" }}>
                {t("dashboard.image")}
              </TableCell>
              <TableCell sx={{ color: "gray" }}>
                {t("dashboard.name")}
              </TableCell>
              <TableCell sx={{ color: "gray" }}>
                {t("dashboard.category")}
              </TableCell>
              <TableCell sx={{ color: "gray" }} align="right">
                {t("dashboard.price")}
              </TableCell>
              <TableCell sx={{ color: "gray" }} align="right">
                {t("dashboard.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingProducts ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                  {t("dashboard.noProducts")}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={(product as any)._id ?? getProductName(product)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* Imagen */}
                  <TableCell component="th" scope="row">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={getProductName(product) || "Product image"}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 1,
                          bgcolor: "#222",
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Nombre */}
                  <TableCell sx={{ color: "white" }}>
                    {getProductName(product)}
                  </TableCell>

                  {/* Categoría */}
                  <TableCell sx={{ color: "white" }}>
                    {product.categoria}
                  </TableCell>

                  {/* Precio */}
                  <TableCell align="right" sx={{ color: "green" }}>
                    ${Number(product.precio).toLocaleString()}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit(product)}
                      sx={{ color: "blue", mr: 1 }}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDelete((product as any)._id || "")
                      }
                      sx={{ color: "red" }}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal crear */}
      <AddProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchProducts}
      />

      {/* Modal editar */}
      {editingProduct && (
        <EditProductModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onUpdated={fetchProducts}
        />
      )}
    </main>
  );
}
