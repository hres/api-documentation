
import http from 'k6/http';
import {check} from 'k6';
import {Rate} from 'k6/metrics';

const key = __ENV.USER_KEY;
const method = __ENV.METHOD || 'GET';
const url = `https://food-nutrition.canada.ca/api/canadian-nutrient-file/refuseamount?id=20`;
const payload = JSON.parse(`{}`);
const parameters = JSON.parse(`{"headers":{"user-key":"${key}"}}`);

const myFailRate = new Rate('failed requests');

export const options = {
  thresholds: {
    'failed requests': [
      {
        threshold: 'rate<0.1',
        abortOnFail: true,
        delayAbortEval: '10s'
      }
    ]
  }
};

export default function() {
  const response = http.request(
    method,
    url,
    payload,
    parameters
  );

  myFailRate.add(response.status !== 200);

  check(response, {
    'status 200': r => r.status === 200,
    // ...other checks
  });
}
