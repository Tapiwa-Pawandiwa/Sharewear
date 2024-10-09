import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import DonationCard from '@/components/user/DonationCard';
import { useDonorContext } from '@/app/providers/Donor';
import { Tables } from '@/app/database.types';
import '@testing-library/jest-native/extend-expect'; // Extending jest for native components

// Define DonationWithDetails type for typing props correctly
type DonationWithDetails = Tables<'donation_with_details'>;

// Mock the useDonorContext hook to simulate the context behavior during the test
jest.mock('@/app/providers/Donor', () => ({
  useDonorContext: jest.fn(),
}));

describe('DonationCard Component', () => {
  // Mock data for donation props
  const mockDonation: DonationWithDetails = {
    donation_id: 1,
    donation_request_headline: 'Donation Request 1',
    donation_status: 'PENDING',
    timer_canceled: false,
    beneficiary_ID: '123',
    donationRequest_ID: 1,
    donor_ID: '123',
    donation_request_address: '123 Main St',
    expiration_time: '2024-10-10T10:00:00.000Z',
    first_name: 'John',
    images: ['https://via.placeholder.com/150'], // Ensure this matches the expected value
    item_ids: [],
    last_name: 'Doe',
    phone_number: '123-456-7890',
    time_added: '2024-10-08T10:00:00.000Z',
    timer_start_time: '2024-10-08T10:00:00.000Z',
  };

  const mockOnCancelDonation = jest.fn();

  beforeEach(() => {
    // Reset all mock functions before each test to ensure no state leakage
    jest.clearAllMocks();
    (useDonorContext as jest.Mock).mockReturnValue({
      cancelDonation: jest.fn(),
    });
  });

  /**
   * Test: Verifies that the `DonationCard` component correctly renders the image and headline.
   * Purpose: Ensures that the donation image and headline are visible when the component is rendered.
   */
  test('renders DonationCard with donation image and headline', () => {
    render(
      <DonationCard
        donation={mockDonation}
        donationStatus="PENDING"
        timerCanceled={false}
        type="donor"
        onCancelDonation={mockOnCancelDonation}
      />
    );

    // Check if the image is rendered
    const donationImage = screen.getByTestId('donation-image');
    expect(donationImage).toBeTruthy();
    
    // Verify the image source matches the mock data
    expect(donationImage.props.source).toMatchObject([{ uri: 'https://via.placeholder.com/150' }]);

    // Check if the headline text is rendered correctly
    const headline = screen.getByText('Donation Request 1');
    expect(headline).toBeTruthy();
  });

  /**
   * Test: Ensures the address text is rendered when the donation is not complete.
   * Purpose: Verifies that the donation address is visible in the UI when the donation is still pending.
   */
  test('renders the address text if the donation is not complete', () => {
    render(
      <DonationCard
        donation={mockDonation}
        donationStatus="PENDING"
        timerCanceled={false}
        type="donor"
        onCancelDonation={mockOnCancelDonation}
      />
    );

    // Verify the address is displayed
    const address = screen.getByText('123 Main St');
    expect(address).toBeTruthy();
  });

  /**
   Test: Verifies that the cancel donation button functions as expected.
   * Purpose: Ensures that pressing the "Cancel" button triggers the cancellation logic.
   */
  test('handles cancel donation button click correctly', async () => {
    render(
      <DonationCard
        donation={mockDonation}
        donationStatus="PENDING"
        timerCanceled={false}
        type="donor"
        onCancelDonation={mockOnCancelDonation}
      />
    );

 
    const cancelButton = screen.getByText('Cancel');
    fireEvent.press(cancelButton);

    // Assert that the mock function is called after pressing the cancel button
    await waitFor(() => {
      expect(mockOnCancelDonation).toHaveBeenCalledTimes(1);
    });
  });

  /**
    Test: Ensures the Cancel button is not shown if the donation is already cancelled.
     Purpose: This test checks that once the donation is cancelled, the Cancel button is hidden from the user.
   */
  test('does not show cancel button if donation is cancelled', async () => {
    render(
      <DonationCard
        donation={mockDonation}
        donationStatus="PENDING"
        timerCanceled={false}
        type="donor"
        onCancelDonation={mockOnCancelDonation}
      />
    );

    // Press the Cancel button to simulate cancellation
    const cancelButton = screen.getByText('Cancel');
    fireEvent.press(cancelButton);
    
    // Assert that the cancellation logic was triggered
    await waitFor(() => {
      expect(mockOnCancelDonation).toHaveBeenCalledTimes(1);
    });

    // Cancel button should no longer be visible after the donation is cancelled
    expect(screen.queryByText('Cancel')).toBeNull();
  });
});
