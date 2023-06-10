const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");

//Create a new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    order
  });

});

//Get Single Order
exports.getSingleOrder = catchAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

        
    res.status(200).json({
        success: true,
        order
    });
});

//Get logged in user Orders
exports.getMyOrder = catchAsyncErrors( async (req, res, next) => {
    const orders = await Order.find({user: req.user._id});

        
    res.status(200).json({
        success: true,
        orders
    });
});

//Get all Orders - Admin
exports.getAllOrders = catchAsyncErrors( async (req, res, next) => {
    const orders = await Order.find();

    //Total Amount of all Orders to show on dashboard
    let totalAmount = 0;                           //*
    orders.forEach((order) =>{                     //*
      totalAmount += order.totalPrice;             //*
    });                                            //*
    //************************************************
        
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});


//Update Orders Status- Admin
exports.updateOrderStatus = catchAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
      return next(new ErrorHandler("Order not found with this id", 404));
    }
    
    if(order.orderStatus === "Delivered"){
      return next(new ErrorHandler("You have already delivered the order", 404));
    }
    
   if(req.body.status === "Shipped"){
    order.orderItems.forEach(async (oder) => {
      await updateStock(oder.product, oder.quantity);
    });
   }

    order.orderStatus = req.body.status;
    if(order.orderStatus === "Delivered"){
      order.deliveredAt = Date.now();

    }

    const names = await User.find();
    let uName = "";
    let uEmail="";
    names.forEach((item => {
      if(item._id.equals(order.user)){
        uName=item.name;
        uEmail=item.email;
      }
    }))

    const orderItemNames = new Array();
    let i=0;
    order.orderItems.forEach((item) => {
      orderItemNames[i] = item.name;
      i++;
    })
    // sending email when product is delivered.
 const message = `Dear ${uName},

Your Order containing ${orderItemNames.toString()} delivered to the following address:

Shipping Address: ${order.shippingInfo.address}, ${order.shippingInfo.city}

If you have any questions or concerns regarding your order, feel free to reach out to our customer support team at no.reply.cellkart@gmail.com or +1 (555) 555-1234. We are here to assist you.

Thank you for choosing CellKart. We appreciate you and hope you enjoy your new purchase.

Best regards,

CellKart`;

  try {
    await sendEmail({
      email: uEmail,
      subject: `Order Delivered!😍`,
      message,
    });

    
  } catch (error) {

    return next(new ErrorHandler(error.message, 500));
  }

    await order.save({validateBeforeSave: false}); 
    res.status(200).json({
        success: true,
      
    });
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    if(product.stock <0){
      product.stock = 0;
    }

    await product.save({validateBeforeSave: false});
}

//Delete order -- Admin

exports.deleteOrder = catchAsyncErrors (async (req, res, next)=>{
  const order = await Order.findById(req.params.id);

  if(!order){
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully"
  });
});



