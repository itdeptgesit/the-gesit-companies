import emailjs from '@emailjs/browser';

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

// EmailJS Configuration from Environment Variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendContactEmail = async (data: ContactFormData) => {
    try {
        // Initialize EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);

        // Send email via EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                from_name: `${data.firstName} ${data.lastName}`,
                reply_to: data.email,
                message: data.message,
            }
        );

        if (response.status === 200) {
            return { success: true, data: response };
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error: any) {
        console.error('Email sending error:', error);
        return { success: false, error: error.text || error.message };
    }
};
