"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/interfaces/interfaces";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { productService } from "@/services/products";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onUpdated: () => void;
}

const VALID_CATEGORIES = ["camisetas", "hoddies", "accesorios"];

export default function EditProductModal({
  open,
  onClose,
  product,
  onUpdated,
}: EditProductModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [name_es, setNameEs] = useState("");
  const [name_en, setNameEn] = useState("");
  const [descripcion_es, setDescripcionEs] = useState("");
  const [descripcion_en, setDescripcionEn] = useState("");

  const [name, setName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("camisetas");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del producto al abrir el modal
  useEffect(() => {
    if (!product) return;

    setNameEs((product as any).name_es || "");
    setNameEn((product as any).name_en || "");
    setDescripcionEs((product as any).descripcion_es || "");
    setDescripcionEn((product as any).descripcion_en || "");

    setName(product.name || "");
    setDescripcion((product as any).descripcion || "");

    // precio como string para el input
    setPrecio(
      typeof product.precio === "number"
        ? product.precio.toString()
        : (product as any).precio?.toString() || ""
    );

    // categoría segura: si no es válida, usamos "camisetas"
    const cat = (product as any).categoria || "camisetas";
    setCategoria(VALID_CATEGORIES.includes(cat) ? cat : "camisetas");

    setImage(null);
    setError(null);
  }, [product, open]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?._id) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Campos multiidioma
      if (name_es) formData.append("name_es", name_es.trim());
      if (name_en) formData.append("name_en", name_en.trim());
      if (descripcion_es) formData.append("descripcion_es", descripcion_es.trim());
      if (descripcion_en) formData.append("descripcion_en", descripcion_en.trim());

      // Legacy (compatibilidad)
      if (name) formData.append("name", name.trim());
      if (descripcion) formData.append("descripcion", descripcion.trim());

      formData.append("precio", precio || "0");
      formData.append("categoria", categoria);
      if (image) {
        formData.append("image", image);
      }

      await productService.update(product._id as string, formData, user?.email);

      onUpdated(); // recargar lista
      handleClose();
    } catch (err: any) {
      console.error("Error updating product:", err?.response?.data || err);
      setError(
        t("productModal.errorUpdate") ||
          "Error al actualizar el producto. Revisa los campos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("productModal.editTitle") || "Editar producto"}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1 }}>
            Español
          </Typography>
          <TextField
            label={`${t("productModal.name")} (ES)`}
            value={name_es}
            onChange={(e) => setNameEs(e.target.value)}
            fullWidth
          />
          <TextField
            label={`${t("productModal.description")} (ES)`}
            value={descripcion_es}
            onChange={(e) => setDescripcionEs(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1 }}>
            English
          </Typography>
          <TextField
            label={`${t("productModal.name")} (EN)`}
            value={name_en}
            onChange={(e) => setNameEn(e.target.value)}
            fullWidth
          />
          <TextField
            label={`${t("productModal.description")} (EN)`}
            value={descripcion_en}
            onChange={(e) => setDescripcionEn(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <Typography variant="caption" sx={{ color: "gray", mt: -1 }}>
            {t("productModal.legacyNote") ||
              "Legacy fields (optional, for backward compatibility)"}
          </Typography>
          <TextField
            label={`${t("productModal.name")} (Legacy)`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            helperText={t("productModal.optional")}
          />
          <TextField
            label={`${t("productModal.description")} (Legacy)`}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            multiline
            rows={2}
            helperText={t("productModal.optional")}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label={t("productModal.price")}
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
            <FormControl fullWidth required>
              <InputLabel>{t("productModal.category")}</InputLabel>
              <Select
                value={categoria}
                label={t("productModal.category")}
                onChange={(e) => setCategoria(e.target.value as string)}
              >
                <MenuItem value="camisetas">
                  {t("collection.categories.tshirts")}
                </MenuItem>
                <MenuItem value="hoddies">
                  {t("collection.categories.hoodies")}
                </MenuItem>
                <MenuItem value="accesorios">
                  {t("collection.categories.accessories")}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="caption" display="block" gutterBottom>
              {t("productModal.image")} ({t("productModal.optional")})
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              style={{ width: "100%" }}
            />
            <Typography variant="caption" color="gray">
              {t("productModal.keepImage") ||
                "Si no seleccionas una nueva imagen, se mantiene la actual."}
            </Typography>
          </Box>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {t("productModal.cancelButton")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            t("productModal.saveButton") || "Guardar cambios"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
