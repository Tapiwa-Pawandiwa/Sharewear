import 'react-native-gesture-handler/jestSetup'; // Ensure gesture handler is initialized for Jest
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DonationRequestCard from '../user/DonationRequestCard';
import { Tables } from '@/app/database.types';
import '@testing-library/jest-native/extend-expect';

// Mocking react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: any) => <>{children}</>,
}));

// Mocking react-native-reanimated-carousel
jest.mock('react-native-reanimated-carousel', () => {
    return {
      __esModule: true,
      default: ({ children }: any) => <>{children}</>,
    };
  });

// Mocking Link component from 'expo-router'
jest.mock('expo-router', () => ({
  Link: ({ children, href }: any) => (
    <a href={JSON.stringify(href)}>{children}</a>
  ),
}));

// Define DonationRequestWithCategoryAndTags type for typing props correctly
type DonationRequestWithCategoryAndTags = Tables<'donation_requests_with_categories_and_tags'>;

// Mock data for DonationRequestCard props
const mockDonationRequest: DonationRequestWithCategoryAndTags = {
  donation_request_id: 1,
  headline: 'Donation Request Headline',
  formatted_address: '123 Charity Lane',
  images: ['https://via.placeholder.com/150'],
  beneficiary_ID: '123',
  category_names: ['Clothing', 'Food'],
  description: 'This is a donation request description',
  item_names: ['Shirts', 'Pants'],
  tag_names: ['Urgent', 'Local'],
  time_added: '2024-09-10T10:00:00.000Z',
  latitude: null,
  longitude: null,
  main_location: null,
  secondary_location: null,
  status: null,
};

describe('DonationRequestCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders DonationRequestCard with headline, and address', () => {
    // Render the component
    render(<DonationRequestCard donationRequest={mockDonationRequest} />);

    // Check if the headline is rendered
    const headline = screen.getByText('Donation Request Headline');
    expect(headline).toBeTruthy();

    // Check if the formatted address is rendered
    const formattedAddress = screen.getByText('123 Charity Lane');
    expect(formattedAddress).toBeTruthy();
  });
});
