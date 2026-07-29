import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 500,
  duration: '15s', // Run for 15 seconds to let connections ramp up
};

export default function () {
  const res = http.get('http://localhost:3000/');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  // Small sleep to simulate normal user behavior but aggressive enough for a load test
  sleep(0.5); 
}
