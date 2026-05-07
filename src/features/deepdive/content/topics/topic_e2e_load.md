# E2E and load testing: Playwright, k6, JMeter, smoke vs soak vs stress

**Playwright (frontend E2E)**

```ts
import { test, expect } from '@playwright/test'

test('user can mark a topic done', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /onboarding-name/i }).fill('Test')
  await page.getByRole('link', { name: /Arrays/i }).click()
  await page.getByRole('button', { name: /Mark done/i }).click()
  await expect(page.getByText('done')).toBeVisible()
})
```

E2E suites should stay small. Aim for the 5 – 15 happy paths that prove the application boots and the critical flows work; rely on integration and unit tests for the rest.

**Load testing with k6**

```js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // ramp up
    { duration: '2m', target: 50 }, // steady
    { duration: '30s', target: 0 }, // ramp down
  ],
  thresholds: { http_req_duration: ['p(95)<500'] },
}

export default function () {
  const res = http.get('https://api.example.com/orders')
  check(res, { 'status 200': (r) => r.status === 200 })
  sleep(1)
}
```

**Test types by intent**

| Type   | Purpose                        | Duration      |
| ------ | ------------------------------ | ------------- |
| Smoke  | Sanity check production path   | 1 – 5 min     |
| Load   | Verify SLO at expected traffic | 10 – 30 min   |
| Stress | Find the breaking point        | until failure |
| Soak   | Catch leaks and degradation    | 4 – 24 hours  |
| Spike  | Sudden surge then drop         | 5 – 15 min    |

**Common pitfalls**

- Treating CI minutes as free. A 90-minute test suite slows everyone; budget time per layer.
- E2E flakiness from animations, timing, and shared state. Use deterministic fixtures and reset state between tests.
- Mocking the system under test. If the only "logic" left after mocking is the test setup, the test is not protecting anything.

---
