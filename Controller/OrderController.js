import { db } from './../connect.js';
import { getIdFromCookie } from './ControllerUtils.js';

export const getProductsByCategory = async (req, res) => {
  const q =
    'SELECT p.*, c.category_name FROM `products` as `p` JOIN `categories` as `c` ON (p.categoryId = ?)';

  db.query(q, [uId], (err, data) => {
    if (err) {
      console.log(err);
      return 'error';
    } else {
      return data[0];
    }
  });
};

export const placeOrder = async (req, res) => {
  if (req.headers.cookie === undefined) {
    return res.status(409).json('no data');
  } else {
    const productValues = [];

    const userId = getIdFromCookie(req.headers.cookie);
    const orderId = await insertOrder([userId, null, req.body.total]);

    req.body.products.forEach((el) => {
      productValues.push([el.id, orderId]);
    });

    const q = 'INSERT INTO `order_item` (product_id, order_id) VALUES ?';

    db.query(q, [productValues], (err, data) => {
      if (err) {
        console.log('err', err);
        return res.status(500).json('Error');
      } else if (data) {
        return res.status(200).json({ id: orderId });
      }
    });
  }
};

const insertOrder = (values) => {
  const q =
    'INSERT INTO `user_order`(`user_id`, `delivery_adress`, `order_price`) VALUES (?)';
  return new Promise((resolve, reject) => {
    db.query(q, [values], (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data.insertId);
      }
    });
  });
};

// try {
//     if (!('cookie' in req.headers)) {
//       return res.status(409).json('no data');
//     }

//     const limit = req.query.limit || 10;
//     const offset = req.query.offset || 0;
//     const q = `
//       SELECT id, delivery_adress, status, order_price,
//              DATE_FORMAT(placed_at, '%Y-%m-%d %H:%i') AS placed_at,
//              DATE_FORMAT(closed_at, '%Y-%m-%d') AS closed_at
//       FROM user_order
//       WHERE user_id = ?
//       ORDER BY placed_at DESC
//       LIMIT ? OFFSET ?
//     `;
//     const userId = getIdFromCookie(req.headers.cookie);
//     const data = db.query(q, [userId, limit, offset]);
//     return res.status(200).json(data);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err.message);
//   }
// };

export const GetMyOrders = (req, res) => {
  try {
    if (!('cookie' in req.headers)) {
      return res.status(401).json({
        error: 'You are not authorized to view this page. Please Log in.',
      });
    }

    const limit = req.query.limit || 25;
    const offset = req.query.offset || 0;
    const q = `
      SELECT id, delivery_adress, status, order_price,
             DATE_FORMAT(placed_at, '%Y-%m-%d %H:%i') AS placed_at,
             DATE_FORMAT(closed_at, '%Y-%m-%d') AS closed_at
      FROM user_order
      WHERE user_id = ?
      ORDER BY placed_at DESC
      LIMIT ? OFFSET ?
    `;
    const userId = getIdFromCookie(req.headers.cookie);
    db.query(q, [userId, limit, offset], (err, data) => {
      if (data) {
        return res.status(200).json(data);
      } else if (err) {
        console.log(err);
        throw err;
      }
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const acceptPayment = async (req, res) => {
  if (!('cookie' in req.headers)) {
    return res.status(401).json({
      error: 'You are not authorized to view this page. Please Log in.',
    });
  }
  const q =
    'UPDATE `user_order` SET `status`= "Paid", `step`= 1, delivery_adress=? WHERE id = ?';
  const orderId = req.params.id;
  db.query(q, [JSON.stringify(req.body), orderId], (err, data) => {
    if (data) {
      return res.status(200).json('Order status switched');
    } else if (err) {
      console.log(err);
      return res.status(500).json('Error');
    }
  });
};

export const getOrderDetails = async (req, res) => {
  if (req.headers.cookie === undefined) {
    return res.status(401).json('no data');
  }
  var queries = [
    'SELECT `delivery_adress`, `status`, `order_price`, `placed_at`, `closed_at`,step FROM `user_order` WHERE id = ?',
    'SELECT products.id, products.name, products.price, products.ImageUrl FROM `order_item`' +
      ' INNER JOIN products ON products.id = order_item.product_id WHERE order_id = ?;',
  ];

  db.query(queries.join(';'), [req.params.id, req.params.id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json('error');
    } else {
      return res
        .status(200)
        .json({ orderSummary: data[0][0], orderedItems: data[1] });
    }
  });
};
