import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
  },
  iconContainer: {
    paddingHorizontal: 15,
  },
  rightIconContainer: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#6366f1",
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#6366f1",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14,
  },
  signUpButton: {
    borderColor: "#6366f1",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  signUpButtonTitle: {
    color: "#6366f1",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
