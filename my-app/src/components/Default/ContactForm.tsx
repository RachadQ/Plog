import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import ContactFormData from '@/interface/ContactFormData';
import axios from 'axios';
import { useAuth } from './AuthProvider';




const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    recaptchaResponse: '',
  });
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const [rateLimited, setRateLimited] = useState<boolean>(false); // Track if rate limit is exceeded
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const {  apiUrl} = useAuth();


  // Google reCAPTCHA site key
  const recaptchaSiteKey: string = 'your-site-key-here'; // Replace with your actual Google reCAPTCHA site key

  // Handle CAPTCHA response
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(value !== null);
    setFormData((prevState) => ({
      ...prevState,
      recaptchaResponse: value || '',
    }));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If rate limit is exceeded, show CAPTCHA challenge
    if (rateLimited && !captchaVerified) {
      setErrorMessage('Please verify that you are human.');
      return;
    }

    // Prepare the form data to send
    const dataToSend: ContactFormData = {
      ...formData,
      recaptchaResponse: captchaVerified ? formData.recaptchaResponse : '', // Send the CAPTCHA response token
    };

    try {
      const response = await axios.post(`${apiUrl}/contact`, dataToSend);
      if (response.status === 200) {
        setSuccessMessage('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          message: '',
          recaptchaResponse: '',
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        // Handle rate limit exceeded (status 429)
        setRateLimited(true);
        setErrorMessage('Rate limit exceeded. Please verify with CAPTCHA.');
      } else {
        setErrorMessage('Error sending message. Please try again later.');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Your Name"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Your Email"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        placeholder="Your Message"
        required
        rows={5}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {rateLimited && (
        <div className="flex justify-center">
          <ReCAPTCHA sitekey={recaptchaSiteKey} onChange={handleCaptchaChange} />
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Send Message
      </button>
    </form>
    {errorMessage && <p className="mt-4 text-red-600 text-sm">{errorMessage}</p>}
    {successMessage && <p className="mt-4 text-green-600 text-sm">{successMessage}</p>}
  </div>
  );
};

export default ContactForm;
