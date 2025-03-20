import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { ThemedView } from "@components/ThemedView";
import { ThemedText } from "@components/ThemedText";
import { useThemeColor } from "@hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useProducts, { type Product } from "@hooks/useProducts";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { getProductById, deleteProduct, loading, error } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const cardBackground = useThemeColor(
    { light: "#f5f5f7", dark: "#1c1c1e" },
    "background"
  );
  const borderColor = useThemeColor({}, "icon");

  const fetchProduct = async () => {
    if (id) {
      try {
        const data = await getProductById(id as string);
        if (data) setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProduct();
    setRefreshing(false);
  };

  const handleDelete = async () => {
    if (!product) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteProduct(product._id);
              Alert.alert("Success", "Product deleted successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading && !product) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <ThemedText type="title">Product Details</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={{ marginTop: 16 }}>Loading product...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error || !product) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <ThemedText type="title">Product Details</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={textColor} />
          <ThemedText style={{ marginTop: 16 }}>
            {error || "Product not found"}
          </ThemedText>
          <Pressable
            style={[styles.retryButton, { backgroundColor: tintColor }]}
            onPress={onRefresh}
          >
            <ThemedText
              style={styles.retryButtonText}
              lightColor="#fff"
              darkColor="#fff"
            >
              Retry
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <ThemedText type="title">Product Details</ThemedText>
      </ThemedView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[tintColor]}
            tintColor={tintColor}
          />
        }
      >
        {/* Product Image */}
        <Image
          source={{
            uri: `http://192.168.1.8:5000${product.image}`,
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <ThemedView
          style={[
            styles.card,
            { backgroundColor: cardBackground, borderColor },
          ]}
        >
          {/* Product Name */}
          <ThemedText type="title" style={styles.productName}>
            {product.name}
          </ThemedText>

          {/* Product Type */}
          <ThemedView style={styles.typeContainer}>
            <ThemedText style={styles.typeLabel}>Type:</ThemedText>
            <ThemedView style={styles.typeTag}>
              <ThemedText style={styles.typeText}>{product.type}</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Price */}
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Price:</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.priceText}>
              {product.price.toLocaleString("vi-VN")} VNĐ
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Action Buttons */}
        <ThemedView style={styles.actionContainer}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: "#f59e0b" }]}
            onPress={() => router.push(`/(products)/edit/${product._id}`)}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <ThemedText
              style={styles.actionButtonText}
              lightColor="#fff"
              darkColor="#fff"
            >
              Edit Product
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: "#ef4444" }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <ThemedText
              style={styles.actionButtonText}
              lightColor="#fff"
              darkColor="#fff"
            >
              Delete Product
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    marginRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  productName: {
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  typeLabel: {
    marginRight: 8,
  },
  typeTag: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    marginRight: 8,
    opacity: 0.7,
  },
  priceText: {
    fontSize: 18,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: "600",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontWeight: "600",
  },
});
