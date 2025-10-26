# QR Generator Test Suite

## Overview

This test suite comprehensively verifies the QR Generator component functionality, ensuring all features work correctly.

## Test Coverage

### Component Rendering (3 tests)

- ✅ Renders the QR generator with default state
- ✅ Renders all QR type options (URL, Text, Email, Phone, SMS, WiFi, Contact, Location)
- ✅ Displays URL input field by default

### QR Type Selection (5 tests)

- ✅ Switches to email type and shows email-specific fields
- ✅ Switches to phone type and shows phone field
- ✅ Switches to WiFi type and shows WiFi-specific fields (SSID, password, encryption)
- ✅ Switches to contact type and shows vCard fields
- ✅ Switches to location type and shows coordinate fields

### QR Code Generation (4 tests)

- ✅ Shows error toast when generating without data
- ✅ Accepts URL input for URL type
- ✅ Accepts email input for email type
- ✅ Accepts WiFi credentials for WiFi type

### Style Tab (3 tests)

- ✅ Switches to style tab and displays styling options
- ✅ Allows changing QR code size
- ✅ Allows changing colors

### Input Validation (4 tests)

- ✅ Validates contact information fields (name, phone, email)
- ✅ Validates location coordinates (latitude, longitude)
- ✅ Validates phone number input
- ✅ Validates SMS with message

## Total: 19 Tests - All Passing ✅

## Running the Tests

To run the QR generator tests:

```bash
npm test -- qr-generator.test.tsx
```

To run all tests:

```bash
npm test
```

## Key Features Tested

1. **Multiple QR Code Types**: URL, Plain Text, Email, Phone, SMS, WiFi, Contact (vCard), Location (Geo)
2. **Dynamic Form Fields**: Each QR type displays appropriate input fields
3. **Input Validation**: Error handling for missing required data
4. **Styling Options**: Size adjustment, color customization, dot styles
5. **User Interactions**: Tab switching, type selection, form inputs

## Mocking Strategy

The test suite uses the following mocks:

- `qr-code-styling`: Mocked to avoid actual QR code rendering in tests
- `useToast`: Mocked to verify toast notifications
- Clipboard API: Mocked for copy functionality tests (future enhancement)

## Notes

- Tests focus on UI interactions and user experience
- QR code generation library is properly mocked to ensure fast, reliable tests
- All tests use React Testing Library best practices
- User interactions are simulated with @testing-library/user-event
