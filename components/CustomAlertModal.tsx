import Colors from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {Modal, View, Text, StyleSheet,Pressable,Image} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

interface CustomAlertProps {
    onClose: () => void;
    buttonText?: string;
    image?: any;
    visible: boolean;
    message?: string | null;
    loading?: boolean;
    progress?: number;
  }


export const CustomAlertModal: React.FC<CustomAlertProps>  = ({
  visible,
  image,
  onClose, 
  loading = false,
  message,
  progress = 0 
}) => {

  useEffect(() => {
    if (loading && progress >= 1) {
        onClose();
    }
}, [progress, loading, onClose]);
  return (
    <Modal 
    transparent={true}
    visible={visible}
    animationType='fade'
    onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
      <LinearGradient start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }} // 10% vertical gradient
          locations={[0, 1]} 
          colors={[Colors.green.alt, '#FFFFFF']}  style={styles.modalContainer}>
    {loading ? (
            <View style={styles.loadingContainer}>
              <Progress.Circle
                showsText={true}
                textStyle={styles.progressText}
                progress={progress}
                size={100}
                animated={true}
                thickness={10}
                color={Colors.theme.secondary}
              />
              <Text style={styles.message}>{message}</Text>
            </View>
          ) : (
            <>
              {image && (
                <Image
                  source={image}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.message}>{message}</Text>
              {onClose && (
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="black"
                  />
                </Pressable>
              )}
            </>
          )}
      </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  
  modalContainer: {
    width: 250,
    height: 200,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  progressText:{
    fontSize: 18,
  },
  image: {
    width: 100,
    height: 100,
 
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})