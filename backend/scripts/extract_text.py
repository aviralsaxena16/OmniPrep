import sys
import pdfplumber

# Get the file path from the command-line argument
pdf_path = sys.argv[1]

text = ""
try:
    with pdfplumber.open(pdf_path) as pdf:
        # Iterate over each page and extract text
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    # Print the final combined text to standard output
    print(text)
except Exception as e:
    # Print error to standard error
    print(f"Error processing PDF: {e}", file=sys.stderr)
    sys.exit(1)