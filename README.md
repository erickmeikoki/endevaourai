# Document Processing System

A web application for automating manufacturing trade document processing. This tool extracts line items from purchase orders, matches them to product catalog items, allows for human verification, and exports the matched data.

## Features

- **Document Upload**: Easily upload PDF documents or use provided test documents.
- **Automated Extraction**: Extract line items from purchase orders automatically.
- **Intelligent Matching**: Match extracted items to products in your catalog with confidence scores.
- **Human Verification**: Review and adjust matches to ensure accuracy.
- **Data Export**: Export the verified matches as CSV, Excel, or JSON.

## Workflow

The application guides users through a 4-step process:

1. **Upload**: Select or upload a purchase order document.
2. **Extract**: The system extracts line items from the document.
3. **Verify**: Review and verify the matched products, with the ability to search for alternatives.
4. **Export**: Export the final matched data in various formats.

## Technical Details

- **Frontend**: React with TailwindCSS and shadcn/ui components
- **Backend**: Express.js server with RESTful API
- **Storage**: In-memory database for development/demonstration purposes
- **Data Processing**:
  - Document parsing with line item extraction
  - Product matching using similarity algorithms
  - Human-in-the-loop verification interface

## Getting Started

### Prerequisites

- Node.js (v20+)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the application at: http://localhost:5000

## Testing

The application includes pre-configured test documents for easy demonstration:

- **Easy Level**: Simple documents with clear line items
- **Medium Level**: Documents with varied formatting
- **Hard Level**: Complex documents with challenging text extraction

## Future Enhancements

- Database integration for persistent storage
- AI-powered matching improvements
- Batch processing capabilities
- Custom product catalog upload
- User authentication and role-based access

## License

This project is proprietary software.

---

Developed as a prototype for manufacturing trade document automation.# endevaourai
