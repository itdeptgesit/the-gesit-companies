import { motion } from "framer-motion";

/**
 * MaintenancePage - A refined maintenance screen for The Gesit Companies.
 * Adheres strictly to the main website's typography:
 * - Headlines: Georgia / Lora (font-display)
 * - Body: Source Sans Pro (font-body)
 */
const MaintenancePage = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-[#103065] relative overflow-hidden">
            {/* Elegant Accent Borders */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-[#103065]" />
            <div className="absolute top-1.5 inset-x-0 h-0.5 bg-[#BC9C33]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                {/* Logo Section */}
                <div className="mb-14">
                    <motion.img 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        src="/logo-gesit.png" 
                        alt="The Gesit Companies" 
                        className="h-20 md:h-24 object-contain mx-auto mb-8 pointer-events-none select-none" 
                    />
                    <div className="h-[1.5px] w-16 bg-[#BC9C33]/40 mx-auto" />
                </div>

                {/* Main Content */}
                <div className="space-y-8 mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-[#103065] tracking-tight leading-tight">
                        Under Maintenance
                    </h1>

                    <div className="max-w-lg mx-auto">
                        <p className="text-[#64748b] text-base md:text-lg lg:text-xl leading-relaxed font-body font-normal opacity-90">
                            We are currently performing scheduled maintenance to ensure the best experience for our visitors. Our website will be back online shortly.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Sticky Footer */}
            <div className="absolute bottom-10 inset-x-0 text-center px-6">
                <p className="text-[10px] text-[#103065]/30 uppercase tracking-[0.5em] font-bold font-body">
                    &copy; {currentYear} THE GESIT COMPANIES.
                </p>
            </div>

            {/* Ambient Brand Colors in Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#BC9C33]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-[#103065]/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default MaintenancePage;
