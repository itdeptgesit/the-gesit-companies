import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

const MaintenancePage = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-navy-deep relative overflow-hidden font-display">
            {/* Elegant Top Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-navy-deep via-[#BC9C33] to-navy-deep opacity-100" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                {/* Logo Section */}
                <div className="mb-14">
                    <img src="/logo gesit.png" alt="The Gesit Companies" className="h-16 md:h-20 object-contain mx-auto mb-8 drop-shadow-sm" />
                    <div className="h-px w-16 bg-slate-200 mx-auto" />
                </div>

                {/* Main Content */}
                <div className="mb-16 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-navy-deep">
                        Under Maintenance
                    </h1>

                    <p className="text-slate-500 text-lg leading-relaxed font-normal max-w-lg mx-auto">
                        We are currently performing scheduled maintenance to ensure the best experience for our visitors. Our website will be back online shortly.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                    <a
                        href="mailto:contact@gesit.co.id"
                        className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-[#BC9C33]/50 hover:shadow-lg hover:shadow-[#BC9C33]/5 transition-all duration-300"
                    >
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email Inquiry</span>
                            <span className="text-navy-deep font-semibold text-sm group-hover:text-[#BC9C33] transition-colors">contact@gesit.co.id</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:bg-[#BC9C33]/10 group-hover:text-[#BC9C33] transition-colors">
                            <Mail size={16} />
                        </div>
                    </a>

                    <a
                        href="tel:+62213101601"
                        className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-[#BC9C33]/50 hover:shadow-lg hover:shadow-[#BC9C33]/5 transition-all duration-300"
                    >
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Office Line</span>
                            <span className="text-navy-deep font-semibold text-sm group-hover:text-[#BC9C33] transition-colors">+62 21 3101 601</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:bg-[#BC9C33]/10 group-hover:text-[#BC9C33] transition-colors">
                            <Phone size={16} />
                        </div>
                    </a>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-8 lg:bottom-12 inset-x-0 text-center px-6 opacity-40">
                <p className="text-[10px] text-navy-deep uppercase tracking-[0.3em] font-bold">
                    &copy; {currentYear} The Gesit Companies.
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
