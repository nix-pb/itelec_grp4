const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const PORT = 5001; 
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.json());

app.use(cors()); 
app.use(bodyParser.json()); 



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Root12345@',
  database: 'rentatool_data',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});





// Helper function to check existing buyer username
function checkExistingBuyerUsername(username, callback) {
  console.log(`Checking for existing buyer username: ${username}`);
  const sql = `SELECT * FROM buyer WHERE username = ?`;
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error(`Error querying for existing buyer username: ${err.message}`);
    }
    callback(err, results);
  });
}

function checkExistingSellerUsername(username, callback) {
  console.log(`Checking for existing seller username: ${username}`);
  const sql = `SELECT * FROM seller WHERE username = ?`;
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error(`Error querying for existing seller username: ${err.message}`);
    }
    callback(err, results);
  });
}

function checkExistingBuyerEmail(email, callback) {
  console.log(`Checking for existing buyer email: ${email}`);
  const sql = `SELECT * FROM buyer WHERE email = ?`;
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error(`Error querying for existing buyer email: ${err.message}`);
    }
    callback(err, results);
  });
}

function checkExistingSellerEmail(email, callback) {
  console.log(`Checking for existing seller email: ${email}`);
  const sql = `SELECT * FROM seller WHERE email = ?`;
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error(`Error querying for existing seller email: ${err.message}`);
    }
    callback(err, results);
  });
}

// Buyer registration
app.post('/api/buyerregister', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    console.log('Validation error: Missing fields');
    return res.status(400).json({ error: 'Username, password, and email are required.' });
  }

  checkExistingBuyerUsername(username, (err, existingBuyers) => {
    if (err) {
      console.error('Error checking existing buyers:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (existingBuyers.length > 0) {
      return res.status(400).json({ error: 'Buyer username already exists.' });
    }

    checkExistingBuyerEmail(email, (err, existingBuyerEmail) => {
      if (err) {
        console.error('Error checking existing buyer email:', err);
        return res.status(500).json({ error: 'Internal server error.' });
      }

      if (existingBuyerEmail.length > 0) {
        return res.status(400).json({ error: 'Buyer email already exists.' });
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Error hashing password.' });
        }

        const sql = 'INSERT INTO buyer (username, password, email) VALUES (?, ?, ?)';
        connection.query(sql, [username, hash, email], (err) => {
          if (err) {
            return res.status(500).json({
              error: 'Error inserting buyer into database.',
              details: err.message,
              code: err.code,
            });
          }
          res.status(201).json({ message: 'Buyer created successfully!' });
        });
      });
    });
  });
});

// Seller registration
app.post('/api/sellerregister', (req, res) => {
  const { username, password, email } = req.body;

  // Validate input fields
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required.' });
  }

  // Check if the seller's username already exists
  checkExistingSellerUsername(username, (err, existingSellers) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (existingSellers.length > 0) {
      return res.status(400).json({ error: 'Seller username already exists.' });
    }

    // Check if the seller's email already exists
    checkExistingSellerEmail(email, (err, existingSellerEmail) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error.' });
      }

      if (existingSellerEmail.length > 0) {
        return res.status(400).json({ error: 'Seller email already exists.' });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Error hashing password.' });
        }

        // Start a database transaction
        connection.beginTransaction((err) => {
          if (err) {
            return res.status(500).json({ error: 'Error starting transaction.' });
          }

          // Step 1: Insert the seller into the 'seller' table
          const sqlInsertSeller = 'INSERT INTO seller (username, password, email) VALUES (?, ?, ?)';
          connection.query(sqlInsertSeller, [username, hash, email], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({
                  error: 'Error inserting seller into database.',
                  details: err.message,
                  code: err.code,
                });
              });
            }

            const sellerId = result.insertId; // Get the seller's ID

            // Step 2: Insert a new shop for the seller into the 'shops' table
            const sqlInsertShop = 'INSERT INTO shops (username, owner_id) VALUES (?, ?)';
            connection.query(sqlInsertShop, [`${username}'s Shop`, sellerId], (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({
                    error: 'Error creating shop for the seller.',
                    details: err.message,
                    code: err.code,
                  });
                });
              }

              // Commit the transaction if both queries are successful
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.status(500).json({ error: 'Error committing transaction.' });
                  });
                }

                // Return success response
                res.status(201).json({ message: 'Seller and shop created successfully!' });
              });
            });
          });
        });
      });
    });
  });
});


// Buyer Login
app.post('/api/buyerlogin', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const sql = 'SELECT * FROM buyer WHERE username = ?';
  connection.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const buyer = results[0];

    bcrypt.compare(password, buyer.password, (err, match) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred during password verification.' });
      }
      if (!match) {
        return res.status(401).json({ message: 'Invalid password!' });
      }

      const token = jwt.sign(
        { id: buyer.id, username: buyer.username, role: 'buyer' },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user_id: buyer.id,
        username: buyer.username,
        email: buyer.email,
      });
    });
  });
});

// Seller Login
app.post('/api/sellerlogin', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const sql = 'SELECT * FROM seller WHERE username = ?';
  connection.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const seller = results[0];

    bcrypt.compare(password, seller.password, (err, match) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred during password verification.' });
      }
      if (!match) {
        return res.status(401).json({ message: 'Invalid password!' });
      }

      const token = jwt.sign(
        { id: seller.id, username: seller.username, role: 'seller' },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user_id: seller.id,
        username: seller.username,
        email: seller.email,
      });
    });
  });
});

// Middleware to authenticate users
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
};

// Get user profile
app.get('/api/user-profile', authenticate, (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  let sql = '';
  if (role === 'buyer') {
    sql = 'SELECT * FROM buyer WHERE id = ?';
  } else if (role === 'seller') {
    sql = 'SELECT * FROM seller WHERE id = ?';
  }

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user profile.' });
    }
    res.json(results[0]);
  });
});

// API to fetch user's profile image
app.get('/api/user-image', (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Validate userId here if needed
  const sql = 'SELECT image FROM users WHERE id = ?';

  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error fetching profile image: ' + error.message });
    }

    if (results.length === 0 || !results[0].image) {
      return res.status(404).json({ message: 'User not found or image not set' });
    }

    res.status(200).json({ image: results[0].image });
  });
});

const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const upload = multer({ 
  dest: 'uploads/', 
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Ensure file is an image
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// API to update user's profile image
app.post('/api/update-user-image', upload.single('image'), (req, res) => {
  const userId = req.body.user_id;
  const imageFile = req.file;

  if (!userId || !imageFile) {
    return res.status(400).json({ message: 'User ID and profile image are required' });
  }

  // Save the file path to the database
  const imagePath = `/uploads/${imageFile.filename}`;
  const sql = 'UPDATE users SET image = ? WHERE id = ?';

  connection.query(sql, [imagePath, userId], (error) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error updating profile image: ' + error.message });
    }

    res.status(200).json({ message: 'Profile image updated successfully', imagePath });
  });
});

// Serve static files (images) from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





// Add a product
app.post('/add-product', [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('image').optional(),
  body('term_value').isFloat({ gt: 0 }).withMessage('Term must be a positive number'),
  body('term_id').notEmpty().withMessage('Term is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('seller_id').notEmpty().withMessage('Seller ID is required'),  // Added validation for seller_id
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, image, term_value, term_id, category, seller_id } = req.body;

  // Debugging: Log the incoming request body and seller_id
  console.log('Received request to add product:', req.body);
  console.log('Received seller_id:', seller_id); // Debugging line

  const sql = 'INSERT INTO products (name, description, price, image, term_value, term_id, category, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  connection.query(sql, [name, description, price, image, term_value, term_id || null, category, seller_id], (error, results) => {
    if (error) {
      console.error('SQL Error: ', error);
      return res.status(500).json({ message: 'Failed to add product: ' + error.message });
    }
    console.log('Product added with ID:', results.insertId);
    res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
  });
});




 
// update a product
app.put('/api/products/:id', [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('description').optional().notEmpty().withMessage('Description is required'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('image').optional(),
  body('category').optional().notEmpty().withMessage('Category is required')
], (req, res) => {
  const productId = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, image, category } = req.body;

  const sql = `
    UPDATE products 
    SET name = COALESCE(?, name), 
        description = COALESCE(?, description), 
        price = COALESCE(?, price), 
        image = COALESCE(?, image), 
        category = COALESCE(?, category)
    WHERE id = ?
  `;

  connection.query(sql, [name, description, price, image, category, productId], (error, results) => {
    if (error) {
      console.error('SQL Error: ', error);
      return res.status(500).json({ message: 'Failed to update product: ' + error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    console.log('Product updated with ID:', productId);
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

//delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  const deleteQuery = 'DELETE FROM products WHERE id = ?';
  connection.query(deleteQuery, [productId], (error, results) => {
      if (error) {
          console.error('Error deleting product:', error);
          return res.status(500).json({ error: 'Error deleting product' });
      }

      if (results.affectedRows === 0) {
          
          return res.status(404).json({ error: 'Product not found' });
      }

      
      res.status(200).json({ message: 'Product deleted successfully' }); 
  });
});



app.get('/api/user-profile', async (req, res) => {
  const userId = req.user.id; 
  try {
      const [user] = await db.query('SELECT name, email FROM users WHERE id = ?', [userId]);
      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile image for a user
app.put('/api/update-profile-image', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('image').optional(),
], (req, res) => {
  const { userId, image } = req.body; // userId corresponds to the id in the database
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // SQL query to update the user's profile image
  const sql = `
    UPDATE users 
    SET image = COALESCE(?, image)
    WHERE id = ?
  `;

  connection.query(sql, [image, userId], (error, results) => {
    if (error) {
      console.error('SQL Error: ', error);
      return res.status(500).json({ message: 'Failed to update profile image: ' + error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile image updated for user ID:', userId);
    res.status(200).json({ message: 'Profile image updated successfully' });
  });
});






// chat
app.post('/api/chat', (req, res) => {
  const { user_id, message } = req.body;

  const sql = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
  db.query(sql, [user_id, message], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding product.' });
    }
    res.status(201).json({ message: 'Product added successfully!' });
  });
});

// Fetch product details (for buyers)
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  const sql = 'SELECT * FROM products WHERE id = ?';
  connection.query(sql, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching product.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(results[0]);
  });
});


// Route to get all products
app.get('/api/products', (req, res) => {
  // SQL query to get all products
  const sql = 'SELECT * FROM products';

  connection.query(sql, (error, results) => {
      if (error) {
          console.error('SQL Error:', error);
          return res.status(500).json({ message: 'Failed to fetch products: ' + error.message });
      }
      
      // Send the products as the response
      res.status(200).json(results);
  });
});


// API to get all products for a specific seller
app.get('/api/user-products', (req, res) => {
  const sellerId = req.query.user_id; // Assuming user_id is the seller_id
  console.log('Received sellerId in API call:', sellerId);

  // Check if sellerId is provided
  if (!sellerId) {
    console.error('Seller ID is missing in the request');
    return res.status(400).json({ message: 'Seller ID is required' });
  }

  // SQL query to get all products for the seller
  const sql = `
    SELECT id, name, description, price, image, term_id, term_value, category, seller_id 
    FROM products 
    WHERE seller_id = ?
  `;

  // Query the database to get the products for the seller
  connection.query(sql, [sellerId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error fetching products: ' + error.message });
    }

    // Log the fetched results for debugging
    console.log('Products fetched for sellerId:', sellerId, results);

    // Send the results back to the client as JSON
    res.status(200).json(results);
  });
});






// API to get pending orders for a specific user
app.get('/api/orders_pending', (req, res) => {
  const userId = req.query.user_id; 
  console.log('Received userId in API call:', userId); 

  // Check if userId is provided
  if (!userId) {
    console.error('User ID is missing in the request');
    return res.status(400).json({ message: 'User ID is required' });
  }

  // SQL query to get pending orders for the user
  const sql = `
    SELECT 
      o.id, 
      o.product_id, 
      o.user_id, 
      p.name, 
      p.price, 
      o.quantity, 
      o.purchase_date, 
      p.image, 
      o.status 
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = ? AND LOWER(o.status) = 'pending'
  `;

  // Query the database
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error fetching orders: ' + error.message });
    }

    if (results.length === 0) {
      console.log('No pending orders found for userId:', userId);
      return res.status(200).json([]); // Return an empty array if no results
    }

    console.log('Pending orders fetched for userId:', userId, results);
    res.status(200).json(results); // Return the fetched results
  });
});


// API to get in transit orders for a user
app.get('/api/orders_intransit', (req, res) => {
  const userId = req.query.user_id; 
  console.log('Received userId in API call:', userId); 

  // Check if userId is provided
  if (!userId) {
    console.error('User ID is missing in the request');
    return res.status(400).json({ message: 'User ID is required' });
  }

  // SQL query to get in transit orders for the user
  const sql = `
    SELECT id, product_id, user_id, name, price, quantity, purchase_date, image, status 
    FROM orders 
    WHERE user_id = ? AND LOWER(status) = 'in transit'
  `;

  // Query the database to get orders
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error fetching orders: ' + error.message });
    }

    // Log the fetched results for debugging
    console.log('Orders fetched for userId:', userId, results);

    // Send the results back to the client as JSON
    res.status(200).json(results);
  });
});

// API to get received orders for a user
app.get('/api/orders_ratenow', (req, res) => {
  const userId = req.query.user_id; 
  console.log('Received userId in API call:', userId); 

  // Check if userId is provided
  if (!userId) {
    console.error('User ID is missing in the request');
    return res.status(400).json({ message: 'User ID is required' });
  }

  // SQL query to get in transit orders for the user
  const sql = `
    SELECT id, product_id, user_id, name, price, quantity, purchase_date, image, status 
    FROM orders 
    WHERE user_id = ? AND LOWER(status) = 'rate now'
  `;

  // Query the database to get orders
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error fetching orders: ' + error.message });
    }

    // Log the fetched results for debugging
    console.log('Orders fetched for userId:', userId, results);

    // Send the results back to the client as JSON
    res.status(200).json(results);
  });
});


// API to get received orders for a user
app.get('/api/orders_ratenow', (req, res) => {
  const userId = req.query.user_id; 
  console.log('Rate Now userId in API call:', userId); 

  // Check if userId is provided
  if (!userId) {
    console.error('User ID is missing in the request');
    return res.status(400).json({ message: 'User ID is required' });
  }

  // SQL query to get in transit orders for the user
  const sql = `
    SELECT id, product_id, user_id, name, price, quantity, purchase_date, image, status 
    FROM orders 
    WHERE user_id = ? AND LOWER(status) = 'rate now'
  `;

  // Query the database to get orders
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error fetching orders: ' + error.message });
    }

    // Log the fetched results for debugging
    console.log('Orders fetched for userId:', userId, results);

    // Send the results back to the client as JSON
    res.status(200).json(results);
  });
});




// API to get received orders for a user
app.get('/api/orders_received', (req, res) => {
  const userId = req.query.user_id; 
  console.log('Received userId in API call:', userId); 

  // Check if userId is provided
  if (!userId) {
    console.error('User ID is missing in the request');
    return res.status(400).json({ message: 'User ID is required' });
  }

  // SQL query to get in transit orders for the user
  const sql = `
    SELECT id, product_id, user_id, name, price, quantity, purchase_date, image, status 
    FROM orders 
    WHERE user_id = ? AND LOWER(status) = 'received'
  `;

  // Query the database to get orders
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error fetching orders: ' + error.message });
    }

    // Log the fetched results for debugging
    console.log('Orders fetched for userId:', userId, results);

    // Send the results back to the client as JSON
    res.status(200).json(results);
  });
});



// Fetch orders for a specific seller, sorted by purchase_date
app.get('/api/ordersadmin', (req, res) => {
  const userId = req.query.seller_id;  // Get seller_id from query parameters

  // If no seller_id is provided, return a bad request response
  if (!userId) {
    return res.status(400).json({ message: 'Seller ID is required.' });
  }

  const sql = `
    SELECT id, product_id, user_id, name, price, quantity, purchase_date, image, status
    FROM orders
    WHERE seller_id = ?
    ORDER BY purchase_date DESC
  `;

  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Failed to fetch orders: ' + error.message });
    }

    res.status(200).json(results);
  });
});

// API to update the order status to "Received"
app.put('/api/mark-order-ratenow', (req, res) => {
  const { order_id } = req.body;

  // Validate the request body
  if (!order_id) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  const sql = `
    UPDATE orders
    SET status = 'Rate Now'
    WHERE id = ?
  `;

  connection.query(sql, [order_id], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error updating order status: ' + error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or status already updated.' });
    }

    res.status(200).json({ message: 'Order status updated to Received successfully.' });
  });
});


// API to update the order status to "Received"
app.put('/api/mark-order-received', (req, res) => {
  const { order_id } = req.body;

  // Validate the request body
  if (!order_id) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  const sql = `
    UPDATE orders
    SET status = 'Received'
    WHERE id = ?
  `;

  connection.query(sql, [order_id], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Error updating order status: ' + error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or status already updated.' });
    }

    res.status(200).json({ message: 'Order status updated to Received successfully.' });
  });
});



// API to delete an order by ID
app.delete('/api/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  // SQL query to delete the order
  const sql = `DELETE FROM orders WHERE id = ?`;

  connection.query(sql, [orderId], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Failed to delete order: ' + error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  });
});




// Update the status of an order
app.put('/api/update-order-status', (req, res) => {
  const { order_id, new_status } = req.body;

  // Ensure that order_id and new_status are provided
  if (!order_id || !new_status) {
    return res.status(400).json({ message: 'Order ID and new status are required.' });
  }

  // SQL query to update the order status
  const sql = `
    UPDATE orders
    SET status = ?
    WHERE id = ? AND status = 'Pending'
  `;

  // Run the update query
  connection.query(sql, [new_status, order_id], (error, results) => {
    if (error) {
      console.error('SQL Error:', error);
      return res.status(500).json({ message: 'Failed to update order status: ' + error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or already processed.' });
    }

    // Success response
    res.status(200).json({ message: 'Order status updated successfully.' });
  });
});


// API to rate an order
app.post('/api/orders/:orderId/rate', (req, res) => {
  const { orderId } = req.params;
  const { rating } = req.body;

  // Validate rating (must be between 1 and 5)
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5.' });
  }

  // Step 1: Update the order's rating
  const updateOrderRatingSql = `UPDATE orders SET rating = ? WHERE id = ?`;

  connection.query(updateOrderRatingSql, [rating, orderId], (err, result) => {
    if (err) {
      console.error('Error updating order rating:', err);
      return res.status(500).json({ message: 'Failed to update order rating.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Step 2: Fetch the seller_id from the order to calculate the shop's rating
    const fetchSellerIdSql = `
      SELECT o.seller_id
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.id = ?
    `;

    connection.query(fetchSellerIdSql, [orderId], (err, result) => {
      if (err || result.length === 0) {
        console.error('Error fetching seller_id:', err);
        return res.status(500).json({ message: 'Failed to fetch seller information.' });
      }

      const sellerId = result[0].seller_id;

      // Step 3: Recalculate the shop's rating based on the updated order rating
      const recalculateShopRatingSql = `
        UPDATE shops s
        JOIN (
          SELECT p.seller_id, AVG(o.rating) AS average_rating, COUNT(o.rating) AS rating_count
          FROM orders o
          JOIN products p ON o.product_id = p.id
          WHERE o.rating IS NOT NULL
          GROUP BY p.seller_id
        ) r ON s.seller_id = r.seller_id
        SET s.average_rating = r.average_rating, s.rating_count = r.rating_count
        WHERE s.seller_id = ?;
      `;

      // Recalculate the seller's (shop's) rating
      connection.query(recalculateShopRatingSql, [sellerId], (err) => {
        if (err) {
          console.error('Error recalculating shop rating:', err);
          return res.status(500).json({ message: 'Failed to update shop ratings.' });
        }

        res.status(200).json({ message: 'Rating submitted successfully and shop updated.' });
      });
    });
  });
});


// Ensure this API route is correctly set up
app.get('/api/shops/:seller_id', (req, res) => {
  const { seller_id } = req.params;

  if (!seller_id) {
    return res.status(400).json({ message: 'Seller ID is required.' });
  }

  const fetchShopDetailsSql = `
    SELECT id, username, description, seller_id, average_rating, rating_count
    FROM shops
    WHERE seller_id = ?
  `;

  connection.query(fetchShopDetailsSql, [seller_id], (err, shopResult) => {
    if (err) {
      console.error('Error fetching shop details:', err);
      return res.status(500).json({ message: 'Database error fetching shop details.' });
    }

    if (shopResult.length === 0) {
      return res.status(404).json({ message: 'Shop not found.' });
    }

    const shop = shopResult[0];
    // Ensure fields are explicitly defined, even if null
    const response = {
      id: shop.id || null,
      username: shop.username || null,
      description: shop.description || null,
      seller_id: shop.seller_id || null,
      average_rating: shop.average_rating || null,
      rating_count: shop.rating_count || null,
    };
    res.status(200).json(response);
  });
});



// shop list
app.get('/api/productsshop', (req, res) => {
  const { seller_id } = req.query; 

  if (!seller_id) {
    return res.status(400).json({ message: 'Seller ID is required.' });
  }

  // SQL query to fetch products for a specific seller
  const fetchProductsSql = `
    SELECT id, name, price, term_value, term_id, image, seller_id
    FROM products
    WHERE seller_id = ?
  `;

  connection.query(fetchProductsSql, [seller_id], (err, productResults) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Database error fetching products.' });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller.' });
    }

    // Map the result to a response format
    const products = productResults.map(product => ({
      id: product.id || null,
      name: product.name || null,
      price: product.price || null,
      term_value: product.term_value || null,
      term_id: product.term_id || null,
      image: product.image || null,
      seller_id: product.seller_id || null
    }));

    res.status(200).json(products);  // Send the products as a JSON response
  });
});


// cartlist
app.post('/api/cartlist', (req, res) => {
  const { productId, userId, name, price, image, quantity, sellerId } = req.body;

  // Validate input and return specific error message for each missing field
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }
  if (!name) {
    return res.status(400).json({ message: 'Product name is required.' });
  }
  if (!price) {
    return res.status(400).json({ message: 'Product price is required.' });
  }
  if (!quantity) {
    return res.status(400).json({ message: 'Quantity is required.' });
  }
  if (!sellerId) {
    return res.status(400).json({ message: 'Seller ID is required.' });
  }

  // Check if the user (buyer) exists in the buyer table
  const checkUserSql = 'SELECT id FROM buyer WHERE id = ?';
  connection.query(checkUserSql, [userId], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ message: 'Database error checking user.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // SQL query to insert product into the cart, including seller_id
    const insertCartSql = `
      INSERT INTO cartlist (product_id, user_id, name, price, image, quantity, seller_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      insertCartSql,
      [productId, userId, name, price, image, quantity, sellerId],
      (err, results) => {
        if (err) {
          console.error('Error adding product to cart:', err);
          return res.status(500).json({ message: 'Database error adding product to cart.' });
        }

        res.status(201).json({ message: 'Product added to cart successfully.', cartId: results.insertId });
      }
    );
  });
});





// Fetch cart items for a specific user
app.get('/api/cartlistfetch', (req, res) => {
  const userId = req.query.user_id;

  // Validate user ID
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  // Check if the user exists
  const checkUserSql = 'SELECT id FROM buyer WHERE id = ?';
  connection.query(checkUserSql, [userId], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ message: 'Database error checking user.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Fetch cart items for the given user ID
    const query = 'SELECT * FROM cartlist WHERE user_id = ?';
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching cart items:', err);
        return res.status(500).json({ message: 'Database error fetching cart items.' });
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'No products found for this user.' });
      }
    });
  });
});

// Endpoint to place orders
app.post('/api/buy', (req, res) => {
  const orders = req.body; // This is an array of order data

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ message: 'No order data provided.' });
  }

  // Validate each order item
  for (const order of orders) {
    const { user_id, product_id, name, price, quantity, purchase_date, image, seller_id, location } = order;

    // Create an array to track missing fields for each order
    const missingFields = [];

    if (!user_id) missingFields.push('user_id');
    if (!product_id) missingFields.push('product_id');
    if (!name) missingFields.push('name');
    if (!price) missingFields.push('price');
    if (!quantity) missingFields.push('quantity');
    if (!purchase_date) missingFields.push('purchase_date');
    if (!image) missingFields.push('image');
    if (!seller_id) missingFields.push('seller_id');
    if (!location) missingFields.push('location');

    // If there are any missing fields, send a specific error message
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')} in the order data.`,
      });
    }
  }

  // Insert each order into the database
  const sql = `
    INSERT INTO orders (user_id, product_id, name, price, quantity, purchase_date, image, seller_id, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const orderPromises = orders.map((order) =>
    new Promise((resolve, reject) => {
      connection.query(
        sql,
        [
          order.user_id,
          order.product_id,
          order.name,
          order.price,
          order.quantity,
          order.purchase_date,
          order.image,
          order.seller_id,
          order.location,
        ],
        (err, results) => {
          if (err) {
            console.error('Database error:', err);
            reject({ message: 'An error occurred while placing an order.', error: err.message });
          } else {
            resolve(results.insertId);
          }
        }
      );
    })
  );

  // Wait for all order promises to resolve
  Promise.all(orderPromises)
    .then((orderIds) => {
      res.status(200).json({ message: 'Order(s) placed successfully!', orderIds });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message || 'Failed to place orders.' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

