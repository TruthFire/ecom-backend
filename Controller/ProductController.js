import { db } from './../connect.js';

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

export const getProducts = async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  var q = '';
  if (qCategory) {
    q =
      'SELECT p.id, p.name, p.ImageUrl, p.price, p.createdAt, c.category_name FROM `products` as `p` JOIN `categories` as `c` ON (c.category_name = ?) WHERE c.id = p.categoryId';
  } else {
    q = 'SELECT * FROM `products` WHERE 1';
  }
  if (qNew) q += ' ORDER BY createdAt DESC';

  db.query(q, [qCategory], (err, data) => {
    console.log(q);
    if (err) {
      console.log(err);
      return 'error';
    } else {
      return res.status(200).json(data);
    }
  });
};

export const getProduct = async (req, res) => {
  const q = 'SELECT * from `products` WHERE `id` = ?';
  console.log(req.params);
  db.query(q, req.params.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      return res.status(200).json(data[0]);
    }
  });
};

// router.get('/', async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.category;
//   try {
//     let products;

//     if (qNew) {
//       products = await Product.find().sort({ createdAt: -1 }).limit(1);
//     } else if (qCategory) {
//       products = await Product.find({
//         categories: {
//           $in: [qCategory],
//         },
//       });
//     } else {
//       products = await Product.find();
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
