# Formatter Components

This directory contains the Text Formatter and JSON Formatter components for the DocMagic application.

## Components

### Text Formatter (`text-formatter.tsx`)

A comprehensive text formatting tool with 20+ operations.

#### Features:

**Case Transformations:**
- UPPERCASE - Converts all text to uppercase
- lowercase - Converts all text to lowercase
- Capitalize Words - Capitalizes the first letter of each word
- Sentence case - Capitalizes the first letter of each sentence

**Text Manipulation:**
- Reverse - Reverses the entire text
- Remove Spaces - Removes all whitespace
- Trim Spaces - Removes extra spaces and trims
- Remove Line Breaks - Converts multiline text to single line

**Line Operations:**
- Sort Lines - Alphabetically sorts all lines
- Remove Duplicates - Removes duplicate lines
- Add Line Numbers - Adds line numbers to each line

**Encoding & Decoding:**
- URL Encode - Encodes text for URL usage
- URL Decode - Decodes URL-encoded text
- Base64 Encode - Encodes text to Base64
- Base64 Decode - Decodes Base64 text

**Analysis & Extraction:**
- Count Words - Shows word, character, and line count
- Extract Emails - Finds and lists all email addresses
- Extract URLs - Finds and lists all URLs

**Actions:**
- Copy to clipboard
- Download as .txt file
- Clear all text

---

### JSON Formatter (`json-formatter.tsx`)

A powerful JSON validation and formatting tool with conversion capabilities.

#### Features:

**Format & Validate:**
- Format JSON - Pretty-prints JSON with customizable indentation (2, 4, or 8 spaces)
- Minify - Removes all whitespace to create compact JSON
- Validate Only - Checks JSON validity without formatting
- Real-time validation status with error messages

**String Operations:**
- Escape JSON - Escapes special characters for string usage
- Unescape JSON - Unescapes escaped JSON strings

**Conversion:**
- Convert to XML - Transforms JSON structure to XML format
- Convert to CSV - Converts JSON arrays to CSV format (requires array of objects)

**Actions:**
- Copy to clipboard
- Download as .json file
- Clear all text

**Validation:**
- Real-time syntax validation
- Detailed error messages with line/column information
- Visual success/error indicators

---

## Usage

```tsx
import { TextFormatter } from "@/components/formatter/text-formatter";
import { JsonFormatter } from "@/components/formatter/json-formatter";

// In your page component
<TextFormatter />
<JsonFormatter />
```

## UI/UX Design

The formatters match the DocMagic website design with:
- Glass-effect cards with shimmer animations
- Bolt gradient text effects
- Responsive layout with mobile support
- Toast notifications for user feedback
- Loading skeleton states
- Hover effects and smooth transitions
- Color-coded operation buttons
- Badge indicators for status and counts

## Dependencies

- `@/components/ui/button`
- `@/components/ui/card`
- `@/components/ui/textarea`
- `@/components/ui/label`
- `@/components/ui/badge`
- `@/components/ui/select`
- `@/components/ui/alert`
- `@/hooks/use-toast`
- `lucide-react` icons

## Navigation

The formatter page is accessible via:
- URL: `/formatter`
- Navigation menu: "Formatter" with Code icon
- Tooltip: "Format and validate text and JSON data"
