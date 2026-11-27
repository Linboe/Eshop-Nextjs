# Users and Orders tickets (Person B)

## 03: Log in
**Owner:** Users   **User stories:** U2   **Blocked by:** 01

### What to build
A customer opens `/login`, enters email and password, and is logged in. The form is a small Client Component that calls `POST /api/auth/login`, and the Route Handler logs in with Supabase Auth and sets the session cookie. After logging in the customer goes to `/profile`, or to the page in `?next=` if there is one (for example `/checkout`).

This ticket also creates `getCurrentUser()` in `lib/auth.ts`. It returns `{ id, email }` for the logged-in user or `null`. Orders uses it, so keep that shape. The header shows a "Log in" link when nobody is logged in. The page `/profile` comes in ticket 10, so until then it shows the 404 page.

### Acceptance criteria
- [ ] `/login` with a correct email and password logs me in and sends me to `/profile`
- [ ] If the page was opened from a protected page (`?next=/checkout`), I am sent back there after logging in
- [ ] A wrong email or password shows "Wrong email or password" and I stay logged out

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test calls `POST /api/auth/login` with the test customer: 200, and with a wrong password: 401)

## 06: Register
**Owner:** Users   **User stories:** U1   **Blocked by:** 03

### What to build
`/register` has full name, email and password. A valid form creates the account in Supabase Auth, saves the name in `profiles`, logs the customer in and sends them to `/profile`. The form calls `POST /api/auth/register`. A password under 8 characters or an empty name gives 400. An email that is already registered gives 409 and the form shows "This email is already in use".

Supabase must let a new account log in straight away, so the email confirmation setting has to be off in the project. Tell the team if it is not.

### Acceptance criteria
- [ ] `/register` has full name, email and password, and a valid form creates the account and logs me in
- [ ] After registering I am sent to `/profile`
- [ ] If the email is already registered, the form shows "This email is already in use" and no second account is made

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test registers `test-…@example.com`: 201, registers it again: 409, and removes the account in `afterAll`)

## 08: Log out
**Owner:** Users   **User stories:** U3   **Blocked by:** 03

### What to build
When a customer is logged in, the header shows a "Log out" button instead of "Log in". Clicking it calls `POST /api/auth/logout`, which ends the session (204), and sends the customer to `/`.

### Acceptance criteria
- [ ] A "Log out" button is shown in the header when logged in, and a "Log in" link when not
- [ ] After logging out I am sent to `/`, and opening `/profile` sends me to `/login`

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test calls `POST /api/auth/logout`: 204; the redirect from `/profile` is checked by hand and in ticket 10's test)

## 10: Profile page
**Owner:** Users   **User stories:** U4   **Blocked by:** 03

### What to build
`/profile` shows the customer's full name and email, in the card from the design. There is a place under it for the order history, which Orders adds in ticket 14. A visitor who is not logged in is sent to `/login`. The page checks the login itself with `getCurrentUser()`.

### Acceptance criteria
- [ ] `/profile` shows my full name and email
- [ ] `/profile` also shows my order history (see O4, built in ticket 14)
- [ ] If I am not logged in, `/profile` sends me to `/login`

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test fetches `/profile` without a login and checks the redirect to `/login`, then logs in as the test customer and checks the email on the page. The order history line is checked in ticket 14)

## 11: Checkout page
**Owner:** Orders   **User stories:** O1   **Blocked by:** 03, 09

### What to build
`/checkout` shows what the customer is about to buy: the cart items and the total, as in the design, and a delivery form with full name, address, postcode and city. The cart comes from `lib/cart.ts` (ticket 07) and the product details from `GET /api/products` (ticket 09). A visitor who is not logged in is sent to `/login?next=/checkout`. An empty cart shows "Your cart is empty" and a link to `/products`. The "Place order" button is added in ticket 12.

### Acceptance criteria
- [ ] `/checkout` shows the cart items, the total and a delivery form (full name, address, postcode, city)
- [ ] If I am not logged in, `/checkout` sends me to `/login?next=/checkout`
- [ ] If the cart is empty, `/checkout` shows "Your cart is empty" and a link to `/products`

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test checks the redirect when logged out and the 200 when logged in as the test customer; the cart content is checked by hand)

## 12: Place an order
**Owner:** Orders   **User stories:** O2   **Blocked by:** 11

### What to build
Clicking "Place order" on `/checkout` sends the form and the cart to `POST /api/orders`. The Route Handler checks the login, checks that every field is filled and that the cart is not empty, reads the prices from the database (never from the browser), and saves the order and its items together, so nothing is half saved. It answers 201 with `{ id }`. The page then clears the cart with `clearCart()` and sends the customer to `/orders/[id]`.

Errors: 401 if not logged in, 400 for an empty cart, an empty field or an unknown product. The form shows "Please fill in all fields" when a field is empty.

### Acceptance criteria
- [ ] Clicking "Place order" with a valid form saves the order with its items, clears the cart and sends me to `/orders/[id]`
- [ ] The prices saved in the order come from the database, not from the browser
- [ ] If a delivery field is empty, the order is not saved and the form shows "Please fill in all fields"

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test, as the test customer, posts an order with a name starting `test-` and checks 201 and the saved total; without a login it checks 401; with an empty field it checks 400. It removes its own order in `afterAll`)

## 13: Order confirmation
**Owner:** Orders   **User stories:** O3   **Blocked by:** 12

### What to build
`/orders/[id]` shows the order number, date, delivery details, the items and the total, as a confirmation. Only the customer who made the order can open it. An order that belongs to someone else, or does not exist, shows the 404 page. A visitor who is not logged in is sent to `/login`.

### Acceptance criteria
- [ ] `/orders/[id]` shows the order number, date, delivery details, items and total
- [ ] If the order belongs to another customer or does not exist, the page shows the 404 page

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test creates an order as the test customer and checks the page shows it, and checks an order id that does not exist gives 404)

## 14: Order history
**Owner:** Orders   **User stories:** O4   **Blocked by:** 10, 12

### What to build
A Server Component `components/OrderHistory.tsx` takes a `userId`, reads that customer's orders through `lib/db.ts` and lists them newest first with number, date, total and status. Each order links to `/orders/[id]`. With no orders it shows "No orders yet". Users places it on `/profile` (ticket 10 left room for it).

### Acceptance criteria
- [ ] The order history on `/profile` lists my orders, newest first, with number, date, total and status
- [ ] Each order links to `/orders/[id]`
- [ ] If I have no orders, it shows "No orders yet"

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test creates an order as the test customer and checks that `/profile` shows its number; "No orders yet" is checked by hand with a freshly registered account)