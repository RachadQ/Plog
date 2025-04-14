export default interface ContactFormData {
    name: string;
    email: string;
    message: string;
    recaptchaResponse?: string;
}