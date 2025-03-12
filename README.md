# eCommerce API

## Base URL
```
https://e-commerce-backend-1l78.onrender.com
```

## Authentication

### Register User
**Endpoint:** `POST /api/v1/user/register`

### Login User
**Endpoint:** `POST /api/v1/user/login`

---

## Wishlist Routes

### Add to Wishlist
**Endpoint:** `POST /api/v1/wishlist/add`

### Remove from Wishlist
**Endpoint:** `DELETE /api/v1/wishlist/delete`

### Get Wishlist
**Endpoint:** `GET /api/v1/wishlist/list`

---

## Product Routes

### Create Product (Only SELLER & ADMIN)
**Endpoint:** `POST /api/v1/product/create`

### Get Product List
**Endpoint:** `GET /api/v1/product/list`

### Get Product Details
**Endpoint:** `GET /api/v1/product/:id`

### Add Review (Only CUSTOMER)
**Endpoint:** `POST /api/v1/product/add-review`

---

## Order Routes

### Create Order
**Endpoint:** `POST /api/v1/order/create`

---

## Coupon Routes

### Create Coupon
**Endpoint:** `POST /coupon/create`

### Get Coupon
**Endpoint:** `GET /coupon/get`

---

## Cart Routes

### Add to Cart
**Endpoint:** `POST /api/v1/cart/add`

### Change Quantity
**Endpoint:** `POST /api/v1/cart/change-qty`

### Get Cart
**Endpoint:** `GET /api/v1/cart/`