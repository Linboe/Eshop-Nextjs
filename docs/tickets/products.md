# Products tickets (Person A)

## 02: Browse products
**Owner:** Products   **User stories:** P1   **Blocked by:** 01

### What to build
A visitor opens `/products` and sees every product as a card with image, name, category and price in SEK, as in the design. The page is a Server Component that reads the products through `lib/db.ts`. If there are no products, it shows "No products yet".

### Acceptance criteria
- [ ] `/products` shows every product with image, name, category and price in SEK
- [ ] If the database has no products, the page shows "No products yet" and does not crash (checked by hand)

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass

## 04: Filter by category
**Owner:** Products   **User stories:** P2   **Blocked by:** 02

### What to build
Above the product list there are links for All, Lighting, Furniture, Textiles, Decor and Tableware. Clicking one opens `/products?category=<name>` and the list shows only that category. The active link looks selected. An unknown category shows a friendly message.

### Acceptance criteria
- [ ] `/products?category=lighting` shows only Lighting products
- [ ] The category links on the page (All, Lighting, Furniture, Textiles, Decor, Tableware) change the list
- [ ] `/products?category=unknown` shows "No products in this category" and does not crash

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass

## 05: Open a product
**Owner:** Products   **User stories:** P3   **Blocked by:** 02

### What to build
Clicking a product card opens `/products/[id]`. The page shows the image, name, category, price, description and material as in the design. An id that does not exist, or is not a number, shows the 404 page.

### Acceptance criteria
- [ ] `/products/[id]` shows image, name, category, price, description and material
- [ ] `/products/999999` (a product that does not exist) shows the 404 page

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass

## 07: Add to cart
**Owner:** Products   **User stories:** P4   **Blocked by:** 05

### What to build
The product page has an "Add to cart" button. Clicking it saves the product in the cart and the cart count in the header goes up. The cart lives in `localStorage` under the key `cart` as `[{ "productId": number, "quantity": number }]`. This ticket creates `lib/cart.ts` with the functions the others use: read the cart, add a product, change a quantity, remove a product, clear the cart, and count the items. Broken data in `localStorage` counts as an empty cart. The button and the header count are small Client Components, and the rest of the page stays on the server.

Orders (ticket 11 and 12) use this format and `clearCart()`, so do not change them without telling the team.

### Acceptance criteria
- [ ] Clicking "Add to cart" on a product page adds the product, and the cart count in the header goes up
- [ ] Adding the same product again increases its quantity instead of adding a second row
- [ ] If the saved cart is broken (not valid data), it is treated as an empty cart and nothing crashes

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test checks that the product page contains the "Add to cart" button; the cart itself is checked by hand because it lives in the browser)

## 09: See and edit the cart
**Owner:** Products   **User stories:** P5   **Blocked by:** 07

### What to build
`/cart` shows the items in the cart with image, name, price, quantity and the total. The visitor can increase or decrease the quantity (never below 1) and remove an item, and the total updates. A link leads to `/checkout`. If the cart is empty, the page says so and links to `/products`.

The cart only stores ids and quantities, so the page gets the product details from a new Route Handler: `GET /api/products?ids=1,2,3`. It returns 200 with the products, and 400 if `ids` is missing or not numbers. The list is a Client Component, the rest of the page stays on the server.

### Acceptance criteria
- [ ] `/cart` shows each item with image, name, price, quantity and the total
- [ ] I can increase or decrease the quantity (never below 1) and remove an item, and the total updates
- [ ] If the cart is empty, `/cart` shows "Your cart is empty" and a link to `/products`

### Done when
- [ ] Every criterion passes, checked by hand, and the tests and the build pass
  (the integration test calls `GET /api/products?ids=...`: 200 with the right products, and 400 for missing or bad ids)