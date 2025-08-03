import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  ActivityIndicator
} from 'react-native';

import type { Snack } from '../domain/models';

type SnackCardProps = {
  snack: Snack;
  onPress: (id: string) => void;
};

export function SnackCard({ snack, onPress }: SnackCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(snack.id)}
      accessibilityLabel={`View details for ${snack.name}`}
      accessibilityRole="button">
      
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        )}
        {!imageError ? (
          <Image
            source={{ uri: snack.imageUrl }}
            style={[styles.image, imageLoading && styles.hidden]}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>🍕</Text>
            <Text style={styles.placeholderSubtext}>{snack.category}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={2}>{snack.name}</Text>
          <Text style={styles.category}>{snack.category}</Text>
          {!snack.inStock && (
            <Text style={styles.outOfStock}>Out of Stock</Text>
          )}
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${snack.price.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: {
    backgroundColor: '#f8f9fa',
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hidden: {
    opacity: 0,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholderText: {
    fontSize: 24,
    marginBottom: 2,
  },
  placeholderSubtext: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  category: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  outOfStock: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
  },
  priceContainer: {
    justifyContent: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

