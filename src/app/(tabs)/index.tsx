import { useState, useEffect } from "react";
import {
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ThemedView } from "@components/ThemedView";
import { ThemedText } from "@components/ThemedText";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useProducts, { type Product } from "@hooks/useProducts";

export default function ProductManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { products, deleteProduct, fetchProducts, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [productTypes, setProductTypes] = useState<string[]>([]);

  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const cardBackground = useThemeColor(
    { light: "#f5f5f7", dark: "#1c1c1e" },
    "background"
  );
  const borderColor = useThemeColor({}, "icon");

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (!token) {
          router.replace("/(auth)/login");
          return;
        }
        setIsAuthenticated(true);
        fetchProducts();
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.replace("/(auth)/login");
      }
    };
    checkAuth();
  }, []);

  // Extract unique product types
  useEffect(() => {
    if (products.length > 0) {
      const types = [
        "All",
        ...Array.from(new Set(products.map((product) => product.type))),
      ];
      setProductTypes(types);
    }
  }, [products]);

  // Filter products when type changes or products update
  useEffect(() => {
    if (products.length > 0) {
      if (selectedType === "All") {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(
          products.filter((product) => product.type === selectedType)
        );
      }
    } else {
      setFilteredProducts([]);
    }
  }, [selectedType, products]);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // Handle delete product with proper error handling
  const handleDeletePress = (id: string) => {
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
              await deleteProduct(id);
              Alert.alert("Success", "Product deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Handle image errors
  const handleImageError = (item: Product) => {
    console.warn(`Failed to load image for product: ${item.name}`);
    // You could set a fallback image here if needed
  };

  // Render product item with proper image handling
  const renderProductItem = ({ item }: { item: Product }) => (
    <ThemedView
      style={[
        styles.productCard,
        { backgroundColor: cardBackground, borderColor },
      ]}
    >
      <Image
        source={{
          uri: `http://10.0.2.2:5000${item.image}`,
        }}
        style={styles.productImage}
        resizeMode="cover"
        onError={() => handleImageError(item)}
      />

      <ThemedView style={styles.productInfo}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {item.name}
        </ThemedText>
        <ThemedView style={styles.productMeta}>
          <ThemedText>{item.price.toLocaleString("vi-VN")} VNĐ</ThemedText>
          <ThemedView style={styles.typeTag}>
            <ThemedText style={styles.typeText}>{item.type}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.stockText}>Stock: 0</ThemedText>
      </ThemedView>

      <ThemedView style={styles.actionButtons}>
        <Pressable
          style={[styles.iconButton, { backgroundColor: tintColor }]}
          onPress={() => router.push(`/(products)/view/${item._id}`)}
        >
          <Ionicons name="eye-outline" size={18} color="#fff" />
        </Pressable>
        <Pressable
          style={[styles.iconButton, { backgroundColor: "#f59e0b" }]}
          onPress={() => router.push(`/(products)/edit/${item._id}`)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
        </Pressable>
        <Pressable
          style={[styles.iconButton, { backgroundColor: "#ef4444" }]}
          onPress={() => handleDeletePress(item._id)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );

  if (isAuthenticated === null) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={{ marginTop: 16 }}>
          Checking authentication...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Products</ThemedText>
        <Pressable
          style={[styles.addButton, { backgroundColor: tintColor }]}
          onPress={() => router.push("/(products)/add")}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <ThemedText
            style={styles.addButtonText}
            lightColor="#fff"
            darkColor="#fff"
          >
            Add Product
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Type Filter */}
      <ThemedView style={styles.filterContainer}>
        <ThemedText type="defaultSemiBold">Filter by Type:</ThemedText>
        <FlatList
          data={productTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.filterButton,
                selectedType === item && { backgroundColor: tintColor },
              ]}
              onPress={() => setSelectedType(item)}
            >
              <ThemedText
                style={selectedType === item ? styles.selectedFilterText : null}
                lightColor={selectedType === item ? "#fff" : undefined}
                darkColor={selectedType === item ? "#fff" : undefined}
              >
                {item}
              </ThemedText>
            </Pressable>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
        />
      </ThemedView>

      {/* Product List */}
      {loading && products.length === 0 ? (
        <ThemedView style={styles.centerContent}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={{ marginTop: 16 }}>Loading products...</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[tintColor]}
              tintColor={tintColor}
            />
          }
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={iconColor} />
              <ThemedText type="subtitle" style={styles.emptyText}>
                {selectedType !== "All"
                  ? `No products found in ${selectedType} category`
                  : "No products found"}
              </ThemedText>
              <Pressable
                style={[styles.refreshButton, { backgroundColor: tintColor }]}
                onPress={onRefresh}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <ThemedText
                  style={styles.refreshButtonText}
                  lightColor="#fff"
                  darkColor="#fff"
                >
                  Refresh
                </ThemedText>
              </Pressable>
            </ThemedView>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: "600",
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterList: {
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginRight: 8,
  },
  selectedFilterText: {
    fontWeight: "600",
  },
  productList: {
    padding: 16,
    gap: 16,
    flexGrow: 1,
  },
  productCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "space-between",
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  typeTag: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
  },
  stockText: {
    marginTop: 8,
    opacity: 0.7,
    fontSize: 14,
  },
  actionButtons: {
    justifyContent: "space-between",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  emptyText: {
    marginTop: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    marginLeft: 8,
    fontWeight: "600",
  },
});
