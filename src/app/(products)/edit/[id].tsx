import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "@components/ThemedView";
import { ThemedText } from "@components/ThemedText";
import { useThemeColor } from "@hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import useProducts from "@hooks/useProducts";

// Product types for dropdown
const productTypes = [
  "GPU",
  "CPU",
  "Storage",
  "Memory",
  "Motherboard",
  "Case",
  "PSU",
];

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const { getProductById, updateProduct, loading, error } = useProducts();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState<string>("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const inputBackground = useThemeColor(
    { light: "#f5f5f7", dark: "#1c1c1e" },
    "background"
  );

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const product = await getProductById(id as string);
          if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setType(product.type);
            setImage(product.image);
            setNewImage(product.image);
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          Alert.alert("Error", "Failed to load product data");
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    // Validate inputs
    if (!name || !price || !type) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateProduct(
        id as string,
        name,
        type,
        parseFloat(price),
        newImage
      );
      Alert.alert("Success", "Product updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Error", "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>
          <ThemedText type="title">Edit Product</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={{ marginTop: 16 }}>
            Loading product data...
          </ThemedText>
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
        <ThemedText type="title">Edit Product</ThemedText>
      </ThemedView>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <ThemedView style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {newImage ? (
              <Image
                source={{
                  uri:
                    newImage != image
                      ? newImage
                      : `http://10.0.2.2:5000${image}`,
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : image ? (
              <Image
                source={{
                  uri: `http://10.0.2.2:5000${image}`,
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={48} color={textColor} />
                <ThemedText style={{ marginTop: 8 }}>
                  Tap to select image
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </ThemedView>

        {/* Product Name */}
        <ThemedView style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">Product Name *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackground, color: textColor },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter product name"
            placeholderTextColor="gray"
          />
        </ThemedView>

        {/* Price */}
        <ThemedView style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">Price (VNĐ) *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackground, color: textColor },
            ]}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            placeholderTextColor="gray"
            keyboardType="decimal-pad"
          />
        </ThemedView>

        {/* Type */}
        <ThemedView style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">Product Type *</ThemedText>
          <Pressable
            style={[
              styles.input,
              styles.typeSelector,
              { backgroundColor: inputBackground },
            ]}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}
          >
            <ThemedText>{type || "Select product type"}</ThemedText>
            <Ionicons
              name={showTypeDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color={textColor}
            />
          </Pressable>

          {showTypeDropdown && (
            <ThemedView style={[styles.dropdown, { backgroundColor }]}>
              {productTypes.map((item) => (
                <Pressable
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setType(item);
                    setShowTypeDropdown(false);
                  }}
                >
                  <ThemedText>{item}</ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          )}
        </ThemedView>

        {/* Save Button */}
        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: tintColor },
            isSubmitting && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ThemedText
              style={styles.saveButtonText}
              lightColor="#fff"
              darkColor="#fff"
            >
              Update Product
            </ThemedText>
          )}
        </Pressable>
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
  },
  form: {
    padding: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    overflow: "hidden",
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
