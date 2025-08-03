import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fakeApi } from '../../src/api/fakeApi';
import { useCartStore } from '../../src/store/cart.store';

const { width: screenWidth } = Dimensions.get('window');

export default function SnackDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const {
    data: snack,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['snack', id],
    queryFn: () => fakeApi.getSnackById(id!),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (snack) {
      addItem(snack.id);
      // Navigate to cart or show confirmation
      router.push('/cart');
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!snack) {
    return (
      <View style={styles.centered}>
        <Text>Snack not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" color="#666" />
              <Text style={styles.loadingText}>Loading image...</Text>
            </View>
          )}
          {!imageError ? (
            <Image
              source={{ uri: snack.imageUrl }}
              style={[styles.image, imageLoading && styles.hiddenImage]}
              onLoad={handleImageLoad}
              onError={handleImageError}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>🍕</Text>
              <Text style={styles.placeholderText}>{snack.category}</Text>
              <Text style={styles.placeholderSubtext}>Image not available</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{snack.name}</Text>
            <Text style={styles.category}>{snack.category}</Text>
            <Text style={styles.price}>${snack.price.toFixed(2)}</Text>
          </View>
          
          <Text style={styles.description}>{snack.description}</Text>
          
          {/* Nutrition Facts */}
          {snack.nutritionFacts && (
            <View style={styles.nutritionContainer}>
              <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionItem}>Calories: {snack.nutritionFacts.calories}</Text>
                <Text style={styles.nutritionItem}>Fat: {snack.nutritionFacts.fat}g</Text>
                <Text style={styles.nutritionItem}>Carbs: {snack.nutritionFacts.carbs}g</Text>
                <Text style={styles.nutritionItem}>Protein: {snack.nutritionFacts.protein}g</Text>
              </View>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <Button
              title={snack.inStock ? "Add to Cart" : "Out of Stock"}
              onPress={handleAddToCart}
              disabled={!snack.inStock}
              accessibilityLabel={`Add ${snack.name} to cart`}
            />
          </View>
          
          {!snack.inStock && (
            <Text style={styles.outOfStock}>This item is currently out of stock</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hiddenImage: {
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
  },
  content: { 
    padding: 20,
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  name: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 34,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  price: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  description: { 
    fontSize: 16, 
    lineHeight: 24, 
    color: '#444',
    marginBottom: 24,
  },
  nutritionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    fontSize: 14,
    color: '#666',
    width: '48%',
    marginBottom: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  outOfStock: { 
    color: '#e74c3c', 
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

