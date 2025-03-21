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
import { useLogin } from "@hooks/useAuth";
import { router } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Use the custom auth hooks
  const {
    authenticate: login,
    loading: loginLoading,
    error: loginError,
  } = useLogin();

  // Show error if any
  useEffect(() => {
    if (loginError) {
      Alert.alert("Error", loginError);
    }
  }, [loginError]);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    const userData = await login(email, password);
    router.replace("/(tabs)");
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
                <Text style={styles.logoText}>PC Parts</Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subtitleText}>
                  Sign in to continue to PC Parts
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

                {/* Forgot Password Link */}
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={handleLogin}
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonTitle}>Sign In</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                {/* Toggle to Register */}
                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => router.push("/(auth)/register")}
                >
                  <Text style={styles.signUpButtonTitle}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
