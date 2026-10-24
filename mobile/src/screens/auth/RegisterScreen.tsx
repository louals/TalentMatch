import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,Dimensions
} from "react-native";
import { register } from "api";

const { width } = Dimensions.get('window');
const MAX_FORM_WIDTH = 370;

type Props = {
  navigation: any;
};

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  async function handleRegister() {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({ 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName, 
        role: "candidate" // Default role
      });
      Alert.alert("Success", "Account created! Please login.");
      navigation.goBack();
    } catch (err: any) {
      console.error("Register error:", err);
      if (err?.response?.data?.message) {
        Alert.alert("Registration failed", err.response.data.message);
      } else {
        Alert.alert("Registration failed", "Try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community of professionals</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.form}>
              {/* Name Row */}
              <View style={styles.nameRow}>
                <View style={[styles.inputWrapper, styles.halfInput]}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.inputWrapper, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText}
                  />
                  <TouchableOpacity 
                    onPress={() => setSecureText(!secureText)}
                    style={styles.toggleButton}
                  >
                    <Text style={styles.toggleText}>
                      {secureText ? "Show" : "Hide"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirmText}
                  />
                  <TouchableOpacity 
                    onPress={() => setSecureConfirmText(!secureConfirmText)}
                    style={styles.toggleButton}
                  >
                    <Text style={styles.toggleText}>
                      {secureConfirmText ? "Show" : "Hide"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity 
                style={[styles.registerButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Prompt */}
            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400, // Constrained form width
    alignSelf: 'center',
  },
  form: {
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  halfInput: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
  },
  toggleButton: {
    padding: 14,
  },
  toggleText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLink: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
