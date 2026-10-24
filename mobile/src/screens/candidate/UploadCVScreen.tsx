import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Dimensions
} from "react-native";
import DocumentPicker, { types } from "react-native-document-picker";
import { uploadCV, runMatch } from "api";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export default function UploadCVScreen() {
  const [uploading, setUploading] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [progressWidth] = useState(new Animated.Value(0));
  const navigation = useNavigation<any>();

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateProgress = () => {
    Animated.timing(progressWidth, {
      toValue: width - 64,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const handleUploadCV = async () => {
    try {
      animateButton();
      
      const res = await DocumentPicker.pickSingle({
        type: [types.pdf, types.doc, types.docx],
      });

      if (!res) {
        Alert.alert("Selection Error", "Please select a file to proceed");
        return;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: res.uri,
        type: res.type || "application/pdf",
        name: res.name || "cv.pdf",
      } as any);

      setUploading(true);
      animateProgress();

      await uploadCV(formData);
      await runMatch({});

      Alert.alert("Perfect Match!", "Your CV was analyzed and matches were generated!", [
        {
          text: "View Results",
          onPress: () => navigation.navigate("MatchResults"),
          style: "default",
        },
      ]);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // Silent handling - user cancelled
      } else {
        console.error("CV Upload Error:", err);
        Alert.alert("Upload Failed", "We couldn't process your CV. Please try a different file.", [
          { text: "Try Again", style: "default" },
        ]);
      }
    } finally {
      setUploading(false);
      progressWidth.setValue(0);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require("/Users/louai/S6/src/assets/document-upload.png")} // Replace with your local image
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Find Your Dream Job Match</Text>
        <Text style={styles.subtitle}>
          Upload your CV and we'll analyze it against thousands of job openings
        </Text>

        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadCV}
            disabled={uploading}
            activeOpacity={0.7}
          >
            {uploading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>
                  Analyzing...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Select & Upload CV</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {uploading && (
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[styles.progressBar, { width: progressWidth }]} 
            />
          </View>
        )}

        <View style={styles.supportedFormats}>
          <Text style={styles.supportedText}>Supported formats:</Text>
          <View style={styles.formatBadges}>
            <Text style={styles.formatBadge}>PDF</Text>
            
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#dee2e6',
  },
  illustration: {
    width: 120,
    height: 120,
    tintColor: '#3a0ca3',
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 32,
    maxWidth: "80%",
    lineHeight: 24,
  },
  uploadButton: {
    backgroundColor: '#3a0ca3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginBottom: 24,
    shadowColor: '#3a0ca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: width - 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  progressBarContainer: {
    height: 4,
    width: width - 64,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3a0ca3',
    borderRadius: 2,
  },
  supportedFormats: {
    alignItems: "center",
    marginTop: 16,
  },
  supportedText: {
    color: "#6c757d",
    fontSize: 12,
    marginBottom: 8,
  },
  formatBadges: {
    flexDirection: "row",
  },
  formatBadge: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
    fontSize: 12,
    color: "#495057",
    fontWeight: '500',
  },
});