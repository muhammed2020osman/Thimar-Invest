# Form Validation Rules

This document outlines the validation rules for various forms in the application.

## Product Form (`src/components/product-form.tsx`)

The product form uses `zod` for schema validation. The following rules are applied:

1.  **Product Name (`name`)**
    *   **Type:** String
    *   **Rule:** Must be at least 2 characters long.
    *   **Error Message:** "Product name must be at least 2 characters."

2.  **Description (`description`)**
    *   **Type:** String
    *   **Rule:** Must be at least 10 characters long.
    *   **Error Message:** "Description must be at least 10 characters."

3.  **Price (`price`)**
    *   **Type:** Number
    *   **Rule:** Must be a positive number.
    *   **Error Message:** "Price must be a positive number."

4.  **Stock (`stock`)**
    *   **Type:** Number (Integer)
    *   **Rule:** Must be an integer and cannot be negative (0 or more).
    *   **Error Message:** "Stock cannot be negative."

5.  **Category (`category`)**
    *   **Type:** String
    *   **Rule:** Must be selected (cannot be an empty string).
    *   **Error Message:** "Please select a category."
