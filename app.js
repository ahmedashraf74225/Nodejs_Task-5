const express = require('express');
const app = express();
const mysql = require("mysql")
app.use(express.json());




const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password:"",
  database: "thecamp_market"
});

const pool2 = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password:"",
    database: "thecamp_market_sells"
  });


app.get('/market/products', (req, res) => {

  pool.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'failed to retrieve' });
    } else {
      res.send(results);
    }
  });
});


app.post('/market/products', (req, res) => {
  const { name, price } = req.body;


  if (!name || !price) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  
  pool.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add product to database' });
    } else {
      res.json({ id: results.insertId });
    }
  });
});


app.put('/market/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  
  if (!name || !price) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

 
  pool.query('UPDATE products SET name=?, price=? WHERE id=?', [name, price, id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update product in database' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: `Product with id ${id} not found` });
    } 
  });
});


app.delete('/market/products/:id', (req, res) => {
    const { id } = req.params;
  
   
    pool.query('DELETE FROM products WHERE id=?', [id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete product from database' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: `Product with id ${id} not found` });
      } else {
        res.status(204).send();
      }
    });
});


app.get('/market/sells', (req, res) => {

    pool2.query('SELECT * FROM sells', (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve sells from database' });
      } else {
        res.json(results);
      }
    });
  });


app.post('/market/sells', (req, res) => {
    const { product_id, customer_name, quantity } = req.body;
  
    if (!product_id || !customer_name || !quantity) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
  
    pool2.query('INSERT INTO sells (product_id, customer_name, quantity) VALUES (?, ?, ?)', [product_id, customer_name, quantity], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to record sale in database' });
      } else {
        res.json({ id: results.insertId });
      }
    });
  });

  
  app.delete('/market/sells/:id', (req, res) => {
    const { id } = req.params;
  
    pool2.query('DELETE FROM sells WHERE id=?', [id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete sale from database' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: `Sale with id ${id} not found` });
      } else {
        res.status(204).send();
      }
    });
  });

app.put('/market/sells/:id', (req, res) => {
    const { id } = req.params;
    const { product_id, quantity } = req.body;
  
    if (!product_id || !quantity) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
  
    pool.query('UPDATE sells SET product_id=?, quantity=? WHERE id=?', [product_id, quantity, id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update sale in database' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: `Sale with id ${id} not found` });
      } else {
        res.status(204).send();
      }
    });
  });
  

    app.listen(3000, ()=>{  
        console.log("Server is Runing in localost :3000....")
    });

    