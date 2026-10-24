import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useAuth } from "../../context/AuthContext";


export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const onLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Please enter email and password");
        return;
      }
      setLoading(true);
      await login(email, password);
    } catch (err) {
      Alert.alert("Login failed", "Check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your job search</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
           
            <TextInput
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              style={styles.input}
            />
            <TouchableOpacity 
              onPress={() => setSecureText(!secureText)}
              style={styles.eyeIcon}
            >
              
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
             
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
             
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#64748b",
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  footerText: {
    color: "#64748b",
    fontSize: 14,
  },
  footerLink: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
});