
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('product_added', 'product_approved', 'product_rejected', 'new_message') DEFAULT 'product_added',
  title VARCHAR(255),
  message TEXT,
  listing_id INT,
  related_user_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
);

-- use this one to create users table 
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role ENUM('user','admin') DEFAULT 'user',
  PRIMARY KEY (id)
);

table listings;
CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,

  title VARCHAR(255) NOT NULL,
  price INT NOT NULL,

  category VARCHAR(100) NOT NULL,        -- Cars, Bikes, Mobiles...
  subcategory VARCHAR(100) NOT NULL,     -- SUV, Bicycle, Men, etc.

  location TEXT NOT NULL,                -- "State, City, Landmark"
  year INT,                              -- year of purchase

  description TEXT,                     -- sub-category specific data

  seller_id INT NOT NULL,                -- user who posted

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE listing_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  image_path TEXT NOT NULL,              -- filename stored in /uploads
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);


CREATE TABLE favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,
  listing_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_fav (user_id, listing_id),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

desc chats;
CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,

  listing_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,

  chat_id INT NOT NULL,
  sender_id INT NOT NULL,

  message TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);


-- optional
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- data ----------------------------
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE messages;
TRUNCATE TABLE chats;
TRUNCATE TABLE favourites;
TRUNCATE TABLE listing_images;
TRUNCATE TABLE listings;
TRUNCATE TABLE users;

ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE listings AUTO_INCREMENT = 1;
ALTER TABLE listing_images AUTO_INCREMENT = 1;
ALTER TABLE favourites AUTO_INCREMENT = 1;
ALTER TABLE chats AUTO_INCREMENT = 1;
ALTER TABLE messages AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;



-- checks ---

/* ===== CLEAN START ===== */
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE messages;
TRUNCATE TABLE chats;
TRUNCATE TABLE favourites;
TRUNCATE TABLE listing_images;
TRUNCATE TABLE listings;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  ip_address VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  event_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- do not make change in this 
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('product_added', 'product_approved', 'product_rejected', 'new_message') DEFAULT 'product_added',
  title VARCHAR(255),
  message TEXT,
  listing_id INT,
  related_user_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
);