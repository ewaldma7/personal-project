import { EmailTemplate } from './components/EmailTemplate';
import { Resend } from 'resend';
import * as React from 'react';

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend('re_7cfL9yF3_D1st6au9QqqB9SyxSynkwwrP');

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['ethancwaldman@gmail.com'],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }) as React.ReactElement,
    });

    if (error) {
      console.log(error);
      return;
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

testEmail();

