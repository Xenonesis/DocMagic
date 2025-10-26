import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRGenerator } from '../qr-generator';

// Mock QRCodeStyling library
const mockAppend = jest.fn();
const mockUpdate = jest.fn();
const mockDownload = jest.fn();

// Create a mock QRCodeStyling class that properly handles DOM operations
class MockQRCodeStyling {
  append = mockAppend;
  update = mockUpdate;
  download = mockDownload;

  constructor() {
    // Simulate successful initialization
    mockAppend.mockImplementation((element) => {
      // Simulate appending by adding a data attribute
      if (element) {
        element.setAttribute('data-qr-generated', 'true');
      }
    });
  }
}

jest.mock('qr-code-styling', () => {
  return jest.fn().mockImplementation(() => new MockQRCodeStyling());
});

// Mock toast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('QRGenerator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the QR generator with default state', () => {
      render(<QRGenerator />);

      // Check for main tabs
      expect(screen.getByRole('tab', { name: /content/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /style/i })).toBeInTheDocument();

      // Check for QR Code Type label
      expect(screen.getByText(/qr code type/i)).toBeInTheDocument();

      // Check for generate button
      expect(screen.getByRole('button', { name: /generate qr code/i })).toBeInTheDocument();
    });

    it('renders all QR type options', () => {
      render(<QRGenerator />);

      // Check for all QR type cards (using getAllByText for duplicates)
      const websiteUrls = screen.getAllByText('Website URL');
      expect(websiteUrls.length).toBeGreaterThan(0);
      expect(screen.getByText('Plain Text')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('SMS')).toBeInTheDocument();
      expect(screen.getByText('WiFi')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    it('displays URL input field by default', () => {
      render(<QRGenerator />);

      expect(screen.getByLabelText(/website url/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/https:\/\/example\.com/i)).toBeInTheDocument();
    });
  });

  describe('QR Type Selection', () => {
    it('switches to email type and shows email fields', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Click on Email type card
      const emailCard = screen.getByText('Email').closest('div[class*="cursor-pointer"]');
      if (emailCard) await user.click(emailCard);

      // Check for email-specific fields
      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/subject \(optional\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message \(optional\)/i)).toBeInTheDocument();
      });
    });

    it('switches to phone type and shows phone field', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Click on Phone type card
      const phoneCard = screen.getByText('Phone').closest('div[class*="cursor-pointer"]');
      if (phoneCard) await user.click(phoneCard);

      // Check for phone field
      await waitFor(() => {
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/\+1234567890/i)).toBeInTheDocument();
      });
    });

    it('switches to WiFi type and shows WiFi fields', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Click on WiFi type card
      const wifiCard = screen.getByText('WiFi').closest('div[class*="cursor-pointer"]');
      if (wifiCard) await user.click(wifiCard);

      // Check for WiFi-specific fields
      await waitFor(() => {
        expect(screen.getByLabelText(/network name \(ssid\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/encryption/i)).toBeInTheDocument();
      });
    });

    it('switches to contact type and shows vCard fields', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Click on Contact type card
      const contactCard = screen.getByText('Contact').closest('div[class*="cursor-pointer"]');
      if (contactCard) await user.click(contactCard);

      // Check for vCard-specific fields
      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });
    });

    it('switches to location type and shows coordinate fields', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Click on Location type card
      const locationCard = screen.getByText('Location').closest('div[class*="cursor-pointer"]');
      if (locationCard) await user.click(locationCard);

      // Check for location-specific fields
      await waitFor(() => {
        expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument();
      });
    });
  });

  describe('QR Code Generation', () => {
    it('shows error toast when generating without data', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      const generateButton = screen.getByRole('button', { name: /generate qr code/i });
      await user.click(generateButton);

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Data Required',
          description: 'Please enter the required information',
          variant: 'destructive',
        }),
      );
    });

    it('accepts URL input for URL type', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example\.com/i);
      await user.type(urlInput, 'https://test.com');

      expect(urlInput).toHaveValue('https://test.com');
    });

    it('accepts email input for email type', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Switch to email type
      const emailCard = screen.getByText('Email').closest('div[class*="cursor-pointer"]');
      if (emailCard) await user.click(emailCard);

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('accepts WiFi credentials for WiFi type', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Switch to WiFi type
      const wifiCard = screen.getByText('WiFi').closest('div[class*="cursor-pointer"]');
      if (wifiCard) await user.click(wifiCard);

      await waitFor(() => {
        expect(screen.getByLabelText(/network name \(ssid\)/i)).toBeInTheDocument();
      });

      const ssidInput = screen.getByLabelText(/network name \(ssid\)/i);
      await user.type(ssidInput, 'TestNetwork');

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'password123');

      expect(ssidInput).toHaveValue('TestNetwork');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Style Tab', () => {
    it('switches to style tab and displays styling options', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      const styleTab = screen.getByRole('tab', { name: /style/i });
      await user.click(styleTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/size \(px\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/margin/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/dot style/i)).toBeInTheDocument();
        expect(screen.getByText(/colors/i)).toBeInTheDocument();
      });
    });

    it('allows changing QR code size', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      const styleTab = screen.getByRole('tab', { name: /style/i });
      await user.click(styleTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/size \(px\)/i)).toBeInTheDocument();
      });

      const sizeInput = screen.getByLabelText(/size \(px\)/i) as HTMLInputElement;

      // Select all and replace instead of clear
      await user.tripleClick(sizeInput);
      await user.type(sizeInput, '500');

      expect(sizeInput.value).toContain('500');
    });

    it('allows changing colors', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      const styleTab = screen.getByRole('tab', { name: /style/i });
      await user.click(styleTab);

      await waitFor(async () => {
        const colorInputs = screen.getAllByLabelText(/dots color/i);
        const textInput = colorInputs.find((input) => input.getAttribute('type') === 'text');

        if (textInput) {
          await user.clear(textInput);
          await user.type(textInput, '#FF0000');
          expect(textInput).toHaveValue('#FF0000');
        }
      });
    });
  });

  describe('Input Validation', () => {
    it('validates contact information fields', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Switch to Contact type
      const contactCard = screen.getByText('Contact').closest('div[class*="cursor-pointer"]');
      if (contactCard) await user.click(contactCard);

      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'John Doe');

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.type(phoneInput, '+1234567890');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      expect(nameInput).toHaveValue('John Doe');
      expect(phoneInput).toHaveValue('+1234567890');
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('validates location coordinates', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Switch to Location type
      const locationCard = screen.getByText('Location').closest('div[class*="cursor-pointer"]');
      if (locationCard) await user.click(locationCard);

      await waitFor(() => {
        expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
      });

      const latInput = screen.getByLabelText(/latitude/i);
      await user.type(latInput, '37.7749');

      const lonInput = screen.getByLabelText(/longitude/i);
      await user.type(lonInput, '-122.4194');

      // Number inputs store values as numbers
      expect(latInput).toHaveValue(37.7749);
      expect(lonInput).toHaveValue(-122.4194);
    });

    it('validates phone number input', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Switch to Phone type
      const phoneCard = screen.getByText('Phone').closest('div[class*="cursor-pointer"]');
      if (phoneCard) await user.click(phoneCard);

      await waitFor(() => {
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      });

      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '+1234567890');

      expect(phoneInput).toHaveValue('+1234567890');
    });

    it('validates SMS with message', async () => {
      const user = userEvent.setup();
      render(<QRGenerator />);

      // Switch to SMS type
      const smsCard = screen.getByText('SMS').closest('div[class*="cursor-pointer"]');
      if (smsCard) await user.click(smsCard);

      await waitFor(() => {
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      });

      const numberInput = screen.getByLabelText(/phone number/i);
      await user.type(numberInput, '+1234567890');

      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'Hello World');

      expect(numberInput).toHaveValue('+1234567890');
      expect(messageInput).toHaveValue('Hello World');
    });
  });
});
