import { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import styles from "./styles";
import { FontAwesome } from "@expo/vector-icons";
import { useRegister } from "@hooks/useAuth";
import { router } from "expo-router";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Use the custom auth hook for registration
  const {
    authenticate: register,
    loading: registerLoading,
    error: registerError,
  } = useRegister();

  // Show error if any
  useEffect(() => {
    if (registerError) {
      Alert.alert("Error", registerError);
    }
  }, [registerError]);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    await register(email, password);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=2070",
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <View style={styles.logoContainer}>
                <FontAwesome name="microchip" size={60} color="#ffffff" />
                <Text style={styles.logoText}>TechParts</Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Create Account</Text>
                <Text style={styles.subtitleText}>
                  Register to start shopping for PC parts
                </Text>

                <View style={styles.inputContainer}>
                  {/* Email Input */}
                  <View style={styles.inputWrapper}>
                    <View style={styles.iconContainer}>
                      <FontAwesome name="envelope" size={20} color="#6366f1" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputWrapper}>
                    <View style={styles.iconContainer}>
                      <FontAwesome name="lock" size={20} color="#6366f1" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.rightIconContainer}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesome
                        name={showPassword ? "eye-slash" : "eye"}
                        size={20}
                        color="#6366f1"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={handleRegister}
                  disabled={registerLoading}
                >
                  {registerLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonTitle}>Register</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                {/* Toggle to Login */}
                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => router.push("/(auth)/login")}
                >
                  <Text style={styles.signUpButtonTitle}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
