import { motion } from "framer-motion";
import { Cookie, Shield, Settings, Info } from "lucide-react";

const CookiePolicyPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <div className="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-card border border-slate-100 shadow-sm p-8 md:p-12"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-[#BC9C33]/10 flex items-center justify-center text-[#BC9C33]">
                            <Cookie size={24} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-navy-deep">Cookie Policy</h1>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="lead text-lg">
                            This Cookie Policy explains how The Gesit Companies ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website at gesit.co.id. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                        </p>

                        <div className="my-8 h-px bg-slate-100" />

                        <div className="space-y-8">
                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <Info size={20} className="text-[#BC9C33]" />
                                    What are cookies?
                                </h3>
                                <p>
                                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                                </p>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <Shield size={20} className="text-[#BC9C33]" />
                                    Why do we use cookies?
                                </h3>
                                <p className="mb-4">We use cookies for several reasons:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Essential Cookies:</strong> These are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas (Admin Dashboard).</li>
                                    <li><strong>Analytics Cookies:</strong> We use Google Analytics to collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <Settings size={20} className="text-[#BC9C33]" />
                                    How can I control cookies?
                                </h3>
                                <p className="mb-4">
                                    You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent banner that appears when you first visit our website.
                                </p>
                                <p className="mb-4">
                                    Additionally, you can set or amend your web browser controls to accept or refuse cookies. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
                                </p>
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                    <p className="font-bold text-navy-deep text-sm mb-2">Reset your preference</p>
                                    <p className="text-sm mb-4">If you wish to change your choice regarding cookies on this website, you can clear your browser's local storage or use the button below to reset the consent banner.</p>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('cookie_consent');
                                            window.location.reload();
                                        }}
                                        className="px-6 py-2 bg-navy-deep text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#BC9C33] transition-colors"
                                    >
                                        Reset Cookie Consent
                                    </button>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Updates to this policy</h3>
                                <p>
                                    We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                                </p>
                                <p className="mt-4 text-sm text-slate-400">
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

export default CookiePolicyPage;
