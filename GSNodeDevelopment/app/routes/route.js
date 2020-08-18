const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const userController = require('../controller/userController');

// api routes for get, search, get details and update orders
router.get('/gsusa_get_integration_list', controller.getIntigrationNames);
router.get('/gsusa_get_order_search',  controller.seacrhByOrders);
router.get('/gsusa_get_orders_details', controller.getOrderDeatils);
router.put('/gsusa_update_orders', controller.updateOrder);

// api routes for get, create, and update users
router.get('/gsusa_get_users', userController.getUsers);
router.post('/gsusa_create_user', userController.createUser);
 router.put('/gsusa_update_user', userController.updateUser);

module.exports = router;