import { render, screen } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '../app/(tabs)/home';
import { useSnacks } from '../src/hooks/useSnacks';
import { MOCK_SNACKS } from './_mocks';

// Mock the hooks and modules
jest.mock('../src/hooks/useSnacks');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockUseSnacks = useSnacks as jest.Mock;

describe('HomeScreen Component', () => {
  it('should render a list of snacks with accessible elements', () => {
    // Arrange: Mock the API response
    mockUseSnacks.mockReturnValue({
      data: MOCK_SNACKS,
      isLoading: false,
      isError: false,
    });

    // Act
    render(<HomeScreen />);

    // Assert: Check if snacks are rendered
    expect(screen.getByText('Cosmic Crunch Tortilla Chips')).toBeTruthy();
    expect(screen.getByText('Chewy Chocolate Nova Cookies')).toBeTruthy();

    // Assert: Check for basic accessibility
    const searchInput = screen.getByPlaceholderText('Search snacks...');
    expect(searchInput.props.accessibilityLabel).toBe('Search snacks input');
  });
});

