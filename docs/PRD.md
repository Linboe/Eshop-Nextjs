# PRD: Cozy Co

## The product

Cozy Co is an online shop for interior and design: lighting, furniture, textiles, decor and tableware. A visitor can browse and filter products, open a product and fill a cart. A customer who has registered and logged in can place an order and see their profile and order history. Payment is a demo: no card is charged.

## Users

| Who | What they can do |
| --- | --- |
| Visitor (not logged in) | See products, filter by category, open a product, add to the cart and edit the cart, register, log in |
| Customer (logged in) | Everything a visitor can, plus go to checkout, place an order, see an order confirmation, see their profile and order history, log out |

## Pages

| URL | What it shows | Who can see it |
| --- | --- | --- |
| `/` | Home page: hero, categories, featured products | Everyone |
| `/products` | All products. `?category=` filters by category | Everyone |
| `/products/[id]` | One product with an "Add to cart" button | Everyone |
| `/cart` | The cart: items, quantities, total | Everyone |
| `/register` | Registration form | Visitor |
| `/login` | Login form | Visitor |
| `/checkout` | Cart summary and delivery form | Customer (visitors are sent to `/login`) |
| `/orders/[id]` | Confirmation and details of one order | Customer who owns the order |
| `/profile` | Name, email and order history | Customer (visitors are sent to `/login`) |

## User stories

### Products (P)

**P1. Browse products**
As a visitor, I want to see all products, so that I can find something I like.
- [ ] `/products` shows every product with image, name, category and price in SEK
- [ ] If the database has no products, the page shows "No products yet" and does not crash

**P2. Filter by category**
As a visitor, I want to filter products by category, so that I only see what I am looking for.
- [ ] `/products?category=lighting` shows only Lighting products
- [ ] The category links on the page (All, Lighting, Furniture, Textiles, Decor, Tableware) change the list
- [ ] `/products?category=unknown` shows "No products in this category" and does not crash

**P3. Open a product**
As a visitor, I want to open a product, so that I can read about it before I buy.
- [ ] `/products/[id]` shows image, name, category, price, description and material
- [ ] `/products/999999` (a product that does not exist) shows the 404 page

**P4. Add to cart**
As a visitor, I want to add a product to my cart, so that I can buy it later.
- [ ] Clicking "Add to cart" on a product page adds the product, and the cart count in the header goes up
- [ ] Adding the same product again increases its quantity instead of adding a second row
- [ ] If the saved cart is broken (not valid data), it is treated as an empty cart and nothing crashes

**P5. See and edit the cart**
As a visitor, I want to see and change my cart, so that I can check what I am about to buy.
- [ ] `/cart` shows each item with image, name, price, quantity and the total
- [ ] I can increase or decrease the quantity (never below 1) and remove an item, and the total updates
- [ ] If the cart is empty, `/cart` shows "Your cart is empty" and a link to `/products`

### Users (U)

**U1. Register**
As a visitor, I want to register an account, so that I can place orders.
- [ ] `/register` has full name, email and password, and a valid form creates the account and logs me in
- [ ] After registering I am sent to `/profile`
- [ ] If the email is already registered, the form shows "This email is already in use" and no second account is made

**U2. Log in**
As a customer, I want to log in, so that I can order and see my history.
- [ ] `/login` with a correct email and password logs me in and sends me to `/profile`
- [ ] If the page was opened from a protected page (`?next=/checkout`), I am sent back there after logging in
- [ ] A wrong email or password shows "Wrong email or password" and I stay logged out

**U3. Log out**
As a customer, I want to log out, so that nobody else can use my account on this device.
- [ ] A "Log out" button is shown in the header when logged in, and a "Log in" link when not
- [ ] After logging out I am sent to `/`, and opening `/profile` sends me to `/login`

**U4. Profile page**
As a customer, I want a profile page, so that I can see my account details.
- [ ] `/profile` shows my full name and email
- [ ] `/profile` also shows my order history (see O4)
- [ ] If I am not logged in, `/profile` sends me to `/login`

### Orders (O)

**O1. Checkout page**
As a customer, I want to review my cart before I order, so that I know what I am paying.
- [ ] `/checkout` shows the cart items, the total and a delivery form (full name, address, postcode, city)
- [ ] If I am not logged in, `/checkout` sends me to `/login?next=/checkout`
- [ ] If the cart is empty, `/checkout` shows "Your cart is empty" and a link to `/products`

**O2. Place an order**
As a customer, I want to place my order, so that the shop can send me the products.
- [ ] Clicking "Place order" with a valid form saves the order with its items, clears the cart and sends me to `/orders/[id]`
- [ ] The prices saved in the order come from the database, not from the browser
- [ ] If a delivery field is empty, the order is not saved and the form shows "Please fill in all fields"

**O3. Order confirmation**
As a customer, I want to see a confirmation of my order, so that I know it went through.
- [ ] `/orders/[id]` shows the order number, date, delivery details, items and total
- [ ] If the order belongs to another customer or does not exist, the page shows the 404 page

**O4. Order history**
As a customer, I want to see my earlier orders, so that I can remember what I bought.
- [ ] The order history on `/profile` lists my orders, newest first, with number, date, total and status
- [ ] Each order links to `/orders/[id]`
- [ ] If I have no orders, it shows "No orders yet"

## The API

Pages read the database directly through `lib/db.ts`. The API exists for what writes data and for what a Client Component needs from the server.

| Method | Route | Takes | Who may call it | Status codes |
| --- | --- | --- | --- | --- |
| GET | `/api/products?ids=1,2,3` | Comma-separated product ids | Everyone | 200 list of products; 400 if `ids` is missing or not numbers |
| POST | `/api/auth/register` | `{ email, password, fullName }` | Visitor | 201 account created and logged in; 400 invalid input (password under 8 characters, empty name); 409 email already in use |
| POST | `/api/auth/login` | `{ email, password }` | Visitor | 200 logged in; 401 wrong email or password |
| POST | `/api/auth/logout` | nothing | Customer | 204 logged out |
| POST | `/api/orders` | `{ fullName, address, postcode, city, items: [{ productId, quantity }] }` | Customer | 201 `{ id }`; 400 empty cart, empty field or unknown product; 401 not logged in |

## Touchpoints

| What | Who builds it | Who uses it | The agreement |
| --- | --- | --- | --- |
| Cart in the browser | Products (P4, P5) | Orders (O1, O2) | Saved in `localStorage` under the key `cart` as JSON: `[{ "productId": number, "quantity": number }]`. Products also provides `clearCart()` in `lib/cart.ts` |
| Current user | Users (U2) | Orders (O1, O2, O3, O4), header | `getCurrentUser()` in `lib/auth.ts` returns `{ id, email }` or `null`. Never trust a user id sent from the browser |
| Order history on the profile page | Orders (O4) | Users (U4) | Orders builds the Server Component `components/OrderHistory.tsx` that takes `userId` and Users places it on `/profile` |
| Products table and test data | Day 1 (ticket 01) | Everyone | Tables and test data in `db/setup.sql`, see `docs/ER.md` |
| Header | Day 1 (ticket 01) | Everyone | Shows the logo, category links, the cart count (Products fills it in) and Log in / Log out (Users fills it in) |

## Testing

Integration tests (Vitest, against `npm run dev`) check:
- P1, P2, P3: fetch the pages by URL and check the status and the text shown, including the 404 and the empty states
- P4, P5: manual in the browser, because the cart lives in `localStorage`. The broken-cart case is also checked by hand
- U1, U2, U3: call the register, login and logout Route Handlers and check the status codes, including 409 and 401
- U4, O1, O3, O4: fetch the pages as a logged-out visitor (redirect or 404) and as the test customer
- O2: call `POST /api/orders` as the test customer (201 and the saved total) and without a login (401), and with an empty field (400)

All tests only touch rows they created themselves, named `test-…`, and remove them in `afterAll`.

## Out of scope

Ideas for later (stage 2):
- Admin panel for products and orders
- Real payment
- Stock levels and product variants (color, size)
- Search, sorting, reviews, wishlist
- Saved delivery addresses, password reset, email confirmation
- Order statuses beyond `placed`
- Animations

## Open questions

These were assumed to keep planning moving. Confirm them as a group:
- The cart is saved in the browser (`localStorage`), so visitors can shop without an account
- Products have no stock level and no variants in stage 1
- An order has only the status `placed`
- Which Supabase packages handle login in the Route Handlers (decided in ticket 01, no new library without asking)