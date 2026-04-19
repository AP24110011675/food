/**
 * Comprehensive API Test Suite for FoodHub Backend
 * Tests ALL endpoints systematically
 */
const axios = require('axios');

const BASE = 'http://localhost:5001/api';
const UNIQUE = Date.now();

let userToken = '';
let adminToken = '';
let testUserId = '';
let testRestaurantId = '';
let testMenuItemId = '';
let testOrderId = '';
let testCartItemProductId = '';

const results = [];

function log(status, endpoint, detail) {
    const icon = status === 'PASS' ? '✅' : '❌';
    const msg = `${icon} [${status}] ${endpoint} — ${detail}`;
    console.log(msg);
    results.push({ status, endpoint, detail });
}

async function test(name, fn) {
    try {
        await fn();
    } catch (err) {
        const msg = err.response
            ? `${err.response.status} ${JSON.stringify(err.response.data)}`
            : err.message;
        log('FAIL', name, msg);
    }
}

async function run() {
    console.log('\n========================================');
    console.log('   FoodHub API Test Suite');
    console.log('========================================\n');

    // ─── 1. AUTH: Register ───
    await test('POST /auth/register', async () => {
        const res = await axios.post(`${BASE}/auth/register`, {
            name: `TestUser_${UNIQUE}`,
            email: `testuser_${UNIQUE}@test.com`,
            password: 'Test123456',
            phone: '9999999999'
        });
        if (res.status === 201 && res.data.success && res.data.data.token) {
            userToken = res.data.data.token;
            testUserId = res.data.data._id;
            log('PASS', 'POST /auth/register', `User created: ${res.data.data.email}`);
        } else {
            log('FAIL', 'POST /auth/register', `Unexpected response: ${JSON.stringify(res.data)}`);
        }
    });

    // ─── 1b. AUTH: Register Validation (missing fields) ───
    await test('POST /auth/register (validation)', async () => {
        try {
            await axios.post(`${BASE}/auth/register`, { email: 'x@y.com' });
            log('FAIL', 'POST /auth/register (validation)', 'Should have returned 400');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                log('PASS', 'POST /auth/register (validation)', '400 on missing fields');
            } else {
                throw err;
            }
        }
    });

    // ─── 1c. AUTH: Register Duplicate ───
    await test('POST /auth/register (duplicate)', async () => {
        try {
            await axios.post(`${BASE}/auth/register`, {
                name: `TestUser_${UNIQUE}`,
                email: `testuser_${UNIQUE}@test.com`,
                password: 'Test123456'
            });
            log('FAIL', 'POST /auth/register (duplicate)', 'Should have returned 400');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                log('PASS', 'POST /auth/register (duplicate)', '400 on duplicate email');
            } else {
                throw err;
            }
        }
    });

    // ─── 2. AUTH: Login ───
    await test('POST /auth/login', async () => {
        const res = await axios.post(`${BASE}/auth/login`, {
            email: `testuser_${UNIQUE}@test.com`,
            password: 'Test123456'
        });
        if (res.status === 200 && res.data.success && res.data.data.token) {
            userToken = res.data.data.token; // refresh
            log('PASS', 'POST /auth/login', `Token received for ${res.data.data.email}`);
        } else {
            log('FAIL', 'POST /auth/login', `Unexpected: ${JSON.stringify(res.data)}`);
        }
    });

    // ─── 2b. AUTH: Login wrong password ───
    await test('POST /auth/login (wrong pass)', async () => {
        try {
            await axios.post(`${BASE}/auth/login`, {
                email: `testuser_${UNIQUE}@test.com`,
                password: 'WrongPassword'
            });
            log('FAIL', 'POST /auth/login (wrong pass)', 'Should have returned 401');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                log('PASS', 'POST /auth/login (wrong pass)', '401 on wrong password');
            } else {
                throw err;
            }
        }
    });

    // ─── 2c. AUTH: Profile (token verification) ───
    await test('GET /auth/profile', async () => {
        const res = await axios.get(`${BASE}/auth/profile`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        if (res.status === 200 && res.data.success && res.data.data._id) {
            log('PASS', 'GET /auth/profile', `Profile: ${res.data.data.name}`);
        } else {
            log('FAIL', 'GET /auth/profile', `Unexpected: ${JSON.stringify(res.data)}`);
        }
    });

    // ─── 2d. AUTH: Profile without token ───
    await test('GET /auth/profile (no token)', async () => {
        try {
            await axios.get(`${BASE}/auth/profile`);
            log('FAIL', 'GET /auth/profile (no token)', 'Should have returned 401');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                log('PASS', 'GET /auth/profile (no token)', '401 without token');
            } else {
                throw err;
            }
        }
    });

    // ─── 3. RESTAURANTS: Get All ───
    await test('GET /restaurants', async () => {
        const res = await axios.get(`${BASE}/restaurants`);
        if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
            log('PASS', 'GET /restaurants', `Found ${res.data.count} restaurants`);
            if (res.data.data.length > 0) {
                testRestaurantId = res.data.data[0]._id;
            }
        } else {
            log('FAIL', 'GET /restaurants', `Unexpected: ${JSON.stringify(res.data)}`);
        }
    });

    // ─── 4. MENU: Get menu for restaurant ───
    if (testRestaurantId) {
        await test(`GET /menu/${testRestaurantId}`, async () => {
            const res = await axios.get(`${BASE}/menu/${testRestaurantId}`);
            if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
                log('PASS', `GET /menu/:id`, `Found ${res.data.count} menu items for restaurant`);
                if (res.data.data.length > 0) {
                    testMenuItemId = res.data.data[0]._id;
                    testCartItemProductId = res.data.data[0]._id;
                }
            } else {
                log('FAIL', `GET /menu/:id`, `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });
    } else {
        log('FAIL', 'GET /menu/:id', 'No restaurant ID available to test');
    }

    // ─── 5. CART: Add item ───
    if (testCartItemProductId) {
        await test('POST /cart/add', async () => {
            const res = await axios.post(`${BASE}/cart/add`, {
                name: 'Test Item',
                qty: 2,
                image: 'test.jpg',
                price: 250,
                product: testCartItemProductId
            }, { headers: { Authorization: `Bearer ${userToken}` } });
            if (res.status === 201 && res.data.success) {
                log('PASS', 'POST /cart/add', `Item added to cart, total items: ${res.data.data.cartItems.length}`);
            } else {
                log('FAIL', 'POST /cart/add', `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });
    } else {
        log('FAIL', 'POST /cart/add', 'No menu item ID available to test');
    }

    // ─── 5b. CART: Add validation ───
    await test('POST /cart/add (validation)', async () => {
        try {
            await axios.post(`${BASE}/cart/add`, { name: 'x' }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            log('FAIL', 'POST /cart/add (validation)', 'Should have returned 400');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                log('PASS', 'POST /cart/add (validation)', '400 on missing fields');
            } else {
                throw err;
            }
        }
    });

    // ─── 6. CART: Get ───
    await test('GET /cart', async () => {
        const res = await axios.get(`${BASE}/cart`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        if (res.status === 200 && res.data.success) {
            log('PASS', 'GET /cart', `Cart items: ${res.data.data.cartItems.length}`);
        } else {
            log('FAIL', 'GET /cart', `Unexpected: ${JSON.stringify(res.data)}`);
        }
    });

    // ─── 7. CART: Remove item ───
    if (testCartItemProductId) {
        await test('DELETE /cart/:id', async () => {
            const res = await axios.delete(`${BASE}/cart/${testCartItemProductId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            if (res.status === 200 && res.data.success) {
                log('PASS', 'DELETE /cart/:id', `Item removed, items left: ${res.data.data.cartItems.length}`);
            } else {
                log('FAIL', 'DELETE /cart/:id', `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });
    }

    // ─── 8. ORDERS: Create order ───
    if (testMenuItemId) {
        await test('POST /orders', async () => {
            const res = await axios.post(`${BASE}/orders`, {
                items: [{
                    name: 'Test Food',
                    qty: 1,
                    image: 'test.jpg',
                    price: 300,
                    product: testMenuItemId
                }],
                shippingAddress: {
                    address: '123 Test St',
                    city: 'TestCity',
                    postalCode: '500001',
                    country: 'India'
                },
                paymentMethod: 'COD',
                totalAmount: 300
            }, { headers: { Authorization: `Bearer ${userToken}` } });
            if (res.status === 201 && res.data.success) {
                testOrderId = res.data.data._id;
                log('PASS', 'POST /orders', `Order created: ${testOrderId}`);
            } else {
                log('FAIL', 'POST /orders', `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });
    } else {
        log('FAIL', 'POST /orders', 'No menu item available to create order');
    }

    // ─── 8b. ORDERS: Create order validation ───
    await test('POST /orders (validation)', async () => {
        try {
            await axios.post(`${BASE}/orders`, { items: [] }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            log('FAIL', 'POST /orders (validation)', 'Should have returned 400');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                log('PASS', 'POST /orders (validation)', '400 on empty items');
            } else {
                throw err;
            }
        }
    });

    // ─── 9. ORDERS: Get user orders ───
    await test('GET /orders', async () => {
        const res = await axios.get(`${BASE}/orders`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
            log('PASS', 'GET /orders', `User has ${res.data.count} orders`);
        } else {
            log('FAIL', 'GET /orders', `Unexpected: ${JSON.stringify(res.data)}`);
        }
    });

    // ─── 10. ADMIN: Login as admin (create if needed) ───
    await test('ADMIN LOGIN', async () => {
        // Try logging in as admin
        try {
            const res = await axios.post(`${BASE}/auth/login`, {
                email: 'admin@foodhub.com',
                password: 'Admin1234!'
            });
            if (res.data.success && res.data.data.token) {
                adminToken = res.data.data.token;
                log('PASS', 'ADMIN LOGIN', `Admin token obtained (role: ${res.data.data.role})`);
                return;
            }
        } catch (e) {
            // Admin login failed
        }

        // If no admin exists
        log('FAIL', 'ADMIN LOGIN', 'No admin account found. Create one with: node create_admin.js');
    });

    // ─── 11. ADMIN: Dashboard ───
    if (adminToken) {
        await test('GET /admin/dashboard', async () => {
            const res = await axios.get(`${BASE}/admin/dashboard`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (res.status === 200 && res.data.success && res.data.data.totalOrders !== undefined) {
                const d = res.data.data;
                log('PASS', 'GET /admin/dashboard', `Orders: ${d.totalOrders}, Revenue: ₹${d.totalRevenue}, Users: ${d.totalUsers}, Pending: ${d.pendingOrders}`);
            } else {
                log('FAIL', 'GET /admin/dashboard', `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });
    } else {
        log('FAIL', 'GET /admin/dashboard', 'Skipped — no admin token');
    }

    // ─── 12. ADMIN: Get all orders ───
    if (adminToken) {
        await test('GET /admin/orders', async () => {
            const res = await axios.get(`${BASE}/admin/orders`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
                log('PASS', 'GET /admin/orders', `Total admin orders: ${res.data.count}`);
                // Use first order for update/delete tests if testOrderId not set
                if (!testOrderId && res.data.data.length > 0) {
                    testOrderId = res.data.data[0]._id;
                }
            } else {
                log('FAIL', 'GET /admin/orders', `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });
    } else {
        log('FAIL', 'GET /admin/orders', 'Skipped — no admin token');
    }

    // ─── 13. ADMIN: Update order status ───
    if (adminToken && testOrderId) {
        await test('PUT /admin/order/:id', async () => {
            const res = await axios.put(`${BASE}/admin/order/${testOrderId}`, {
                status: 'Confirmed'
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            if (res.status === 200 && res.data.success && res.data.data.status === 'Confirmed') {
                log('PASS', 'PUT /admin/order/:id', `Order ${testOrderId} → Confirmed`);
            } else {
                log('FAIL', 'PUT /admin/order/:id', `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });

        // ─── 13b. ADMIN: Update order validation ───
        await test('PUT /admin/order/:id (validation)', async () => {
            try {
                await axios.put(`${BASE}/admin/order/${testOrderId}`, {
                    status: 'InvalidStatus'
                }, { headers: { Authorization: `Bearer ${adminToken}` } });
                log('FAIL', 'PUT /admin/order/:id (validation)', 'Should have returned 400');
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    log('PASS', 'PUT /admin/order/:id (validation)', '400 on invalid status');
                } else {
                    throw err;
                }
            }
        });
    } else {
        log('FAIL', 'PUT /admin/order/:id', 'Skipped — no admin token or order ID');
    }

    // ─── 14. ADMIN: Delete order ───
    if (adminToken && testOrderId) {
        await test('DELETE /admin/order/:id', async () => {
            const res = await axios.delete(`${BASE}/admin/order/${testOrderId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (res.status === 200 && res.data.success) {
                log('PASS', 'DELETE /admin/order/:id', `Order ${testOrderId} deleted`);
            } else {
                log('FAIL', 'DELETE /admin/order/:id', `Unexpected: ${JSON.stringify(res.data)}`);
            }
        });
    } else {
        log('FAIL', 'DELETE /admin/order/:id', 'Skipped — no admin token or order ID');
    }

    // ─── 14b. ADMIN: Dashboard (unauthorized) ───
    await test('GET /admin/dashboard (unauthorized)', async () => {
        try {
            await axios.get(`${BASE}/admin/dashboard`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            log('FAIL', 'GET /admin/dashboard (unauthorized)', 'Should have returned 401');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                log('PASS', 'GET /admin/dashboard (unauthorized)', '401 for non-admin user');
            } else {
                throw err;
            }
        }
    });

    // ─── SUMMARY ───
    console.log('\n========================================');
    console.log('   TEST SUMMARY');
    console.log('========================================');
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    console.log(`\n   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total:  ${results.length}`);

    if (failed > 0) {
        console.log('\n   Failed tests:');
        results.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`     ❌ ${r.endpoint}: ${r.detail}`);
        });
    }

    console.log('\n========================================\n');

    // Cleanup: delete test user (requires admin)
    if (adminToken && testUserId) {
        try {
            await axios.delete(`${BASE}/admin/users/${testUserId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`🧹 Cleanup: Deleted test user ${testUserId}`);
        } catch (e) {
            console.log('🧹 Cleanup: Could not delete test user (non-critical)');
        }
    }

    process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
