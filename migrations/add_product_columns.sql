-- Migration: Add missing columns to products table
-- Date: 2025-12-04

USE catalogue;

-- Add description column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT AFTER name;

-- Add image_url column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) AFTER category_id;

-- Add stock column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0 AFTER image_url;

-- Update existing products with default image URLs and stock
UPDATE products 
SET 
  image_url = CASE 
    WHEN image_url IS NULL OR image_url = '' THEN 'https://via.placeholder.com/300x300?text=Product+Image'
    ELSE image_url
  END,
  stock = CASE 
    WHEN stock IS NULL THEN 50
    ELSE stock
  END,
  description = CASE 
    WHEN description IS NULL THEN CONCAT('Description for ', name)
    ELSE description
  END;

-- Make image_url NOT NULL after setting defaults
ALTER TABLE products 
MODIFY COLUMN image_url VARCHAR(500) NOT NULL;

SELECT 'Migration completed successfully' AS status;
