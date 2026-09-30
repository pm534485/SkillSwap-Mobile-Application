/**
 * =====================================================
 * Shared: WebPhoneFrame.js
 * =====================================================
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';

const ViewportContext = createContext(null);

export const useViewportSize = () => {
  const frameContext = useContext(ViewportContext);
  const windowDims = useWindowDimensions();
  if (Platform.OS === 'web' && frameContext) {
    return frameContext;
  }
  return { width: windowDims.width, height: windowDims.height };
};

export const WebPhoneFrame = ({ children }) => {
  const isWeb = Platform.OS === 'web';
  const isFrameEnabled = isWeb && process.env.EXPO_PUBLIC_WEB_FRAME === 'true';

  const [preset, setPreset] = useState({ name: 'iPhone 14', width: 390, height: 844 });
  const [rotated, setRotated] = useState(false);

  const presets = [
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'Pixel 7', width: 412, height: 915 },
    { name: 'Small Phone', width: 360, height: 640 },
    { name: 'Tablet', width: 768, height: 1024 },
  ];

  if (!isFrameEnabled) {
    return <>{children}</>;
  }

  const currentWidth = rotated ? preset.height : preset.width;
  const currentHeight = rotated ? preset.width : preset.height;

  return (
    <View style={styles.webContainer}>
      <View style={styles.toolbar}>
        {presets.map(p => (
          <TouchableOpacity 
            key={p.name} 
            style={[styles.btn, preset.name === p.name && styles.btnActive]} 
            onPress={() => setPreset(p)}
          >
            <Text style={styles.btnText}>{p.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.btn} onPress={() => setRotated(!rotated)}>
          <Text style={styles.btnText}>Rotate ↻</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.phoneWrapper, { width: currentWidth, height: currentHeight }]}>
        <ViewportContext.Provider value={{ width: currentWidth, height: currentHeight }}>
          <View style={styles.phoneContent}>
            {children}
          </View>
        </ViewportContext.Provider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2C2C2E',
    padding: 10,
    borderRadius: 8,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#3A3A3C'
  },
  btnActive: {
    backgroundColor: '#007AFF'
  },
  btnText: {
    color: '#FFF',
    fontSize: 14
  },
  phoneWrapper: {
    backgroundColor: '#000',
    borderRadius: 40,
    borderWidth: 12,
    borderColor: '#3A3A3C',
    overflow: 'hidden',
    boxShadow: '0px 20px 40px rgba(0,0,0,0.5)',
  },
  phoneContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden'
  }
});
