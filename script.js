import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
   http.get('http://184.169.237.47:3000/products/871230');
   sleep(1);
}
