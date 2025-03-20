import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@components/ThemedView";
import { ThemedText } from "@components/ThemedText";
import { useThemeColor } from "@hooks/useThemeColor";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import useProducts from "@hooks/useProducts";

const productTypes = [
  "GPU",
  "CPU",
  "Storage",
  "Memory",
  "Motherboard",
  "Case",
  "PSU",
];

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const { addProduct } = useProducts();

  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const inputBackground = useThemeColor(
    { light: "#f5f5f7", dark: "#1c1c1e" },
    "background"
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name || !price || !type || !image) {
      alert("Please fill in all fields");
      return;
    }

    addProduct(name, type, parseFloat(price), image);
    alert("Product added successfully!");
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <ThemedText type="title">Add Product</ThemedText>
      </ThemedView>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">Product Name</ThemedText>
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

        <ThemedView style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">Price (vnd)</ThemedText>
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

        <ThemedView style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">Product Type</ThemedText>
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

        <ThemedView style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">Product Image</ThemedText>
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <ThemedText>Pick an image</ThemedText>
            )}
          </Pressable>
        </ThemedView>

        <Pressable
          style={[styles.saveButton, { backgroundColor: tintColor }]}
          onPress={handleSave}
        >
          <ThemedText
            style={styles.saveButtonText}
            lightColor="#fff"
            darkColor="#fff"
          >
            Save Product
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: { marginRight: 16 },
  form: { padding: 16 },
  formGroup: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
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
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  image: { width: "100%", height: "100%", borderRadius: 8 },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: { fontWeight: "600", fontSize: 16 },
});
