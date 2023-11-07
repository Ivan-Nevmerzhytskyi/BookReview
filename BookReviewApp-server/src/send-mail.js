import 'dotenv/config';
import { emailService } from './services/emailService.js';

emailService.send({
  email: 'nevmerzhytskyi.ivan@gmail.com',
  subject: 'Test subject',
  html: '<b>Test message<b>',
});
