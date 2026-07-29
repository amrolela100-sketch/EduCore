import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 100 },  // Ramp-up to 100 VUs
    { duration: "20s", target: 500 },  // Ramp-up to 500 VUs
    { duration: "20s", target: 1000 }, // Spike to 1000 VUs
    { duration: "10s", target: 0 },    // Ramp-down to 0
  ],
  thresholds: {
    http_req_failed: ["rate<0.50"], // HTTP errors should be tracked
    http_req_duration: ["p(95)<2000"], // 95% of requests should complete under 2s
  },
};

const BASE_URL = "http://localhost:3000";

export default function () {
  // 1. Test Landing Page
  const resHome = http.get(`${BASE_URL}/`);
  check(resHome, {
    "Home status is 200": (r) => r.status === 200,
  });

  sleep(0.5);

  // 2. Test Login Page
  const resLogin = http.get(`${BASE_URL}/login`);
  check(resLogin, {
    "Login status is 200": (r) => r.status === 200,
  });

  sleep(0.5);

  // 3. Test Protected API Route (Simulating Rate Limit & Protection under high load)
  const payload = JSON.stringify({
    jobPostingId: "sample-job-id",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const resApply = http.post(`${BASE_URL}/api/apply`, payload, params);
  check(resApply, {
    "Apply handled (200 or 401 or 429 Rate Limited)": (r) =>
      [200, 401, 429].includes(r.status),
  });

  sleep(1);
}
