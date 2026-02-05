import { motion } from "framer-motion";
import { Shield, Eye, Lock, FileText } from "lucide-react";

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <div className="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-card border border-slate-100 shadow-sm p-8 md:p-12"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-[#BA9B32]/10 flex items-center justify-center text-[#BA9B32]">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-navy-deep">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="lead text-lg">
                            At The Gesit Companies, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                        </p>

                        <div className="my-8 h-px bg-slate-100" />

                        <div className="space-y-8">
                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <Eye size={20} className="text-[#BA9B32]" />
                                    Information We Collect
                                </h3>
                                <p className="mb-4">We may collect information about you in a variety of ways. The information we may collect on the website includes:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you contact us through our website.</li>
                                    <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the website, such as your IP address, browser type, operating system, access times, and the pages you have viewed.</li>
                                    <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the website.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <Lock size={20} className="text-[#BA9B32]" />
                                    Use of Your Information
                                </h3>
                                <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the website to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Create and manage your account</li>
                                    <li>Process your transactions and send you related information</li>
                                    <li>Email you regarding your account or order</li>
                                    <li>Fulfill and manage purchases, orders, payments, and other transactions</li>
                                    <li>Generate a personal profile about you to make future visits to the website more personalized</li>
                                    <li>Increase the efficiency and operation of the website</li>
                                    <li>Monitor and analyze usage and trends to improve your experience with the website</li>
                                    <li>Notify you of updates to the website</li>
                                    <li>Perform other business activities as needed</li>
                                    <li>Request feedback and contact you about your use of the website</li>
                                    <li>Resolve disputes and troubleshoot problems</li>
                                    <li>Respond to product and customer service requests</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <FileText size={20} className="text-[#BA9B32]" />
                                    Disclosure of Your Information
                                </h3>
                                <p className="mb-4">We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                                    <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                                    <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Security of Your Information</h3>
                                <p>
                                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Contact Us</h3>
                                <p>
                                    If you have questions or comments about this Privacy Policy, please contact us at:
                                </p>
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mt-4">
                                    <p className="font-bold text-navy-deep mb-2">The Gesit Companies</p>
                                    <p className="text-sm">Email: contact@gesit.co.id</p>
                                    <p className="text-sm">Phone: +62 21 3101601</p>
                                    <p className="text-sm">Address: The City Tower, 27th Floor, Jl. M.H. Thamrin No 81, Jakarta Pusat, 10310</p>
                                </div>
                            </section>

                            <section>
                                <p className="text-sm text-slate-400 mt-8">
                                    Last updated: February 2026
                                </p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
