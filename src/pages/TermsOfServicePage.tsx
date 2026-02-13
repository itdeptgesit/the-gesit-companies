import { motion } from "framer-motion";
import { FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const TermsOfServicePage = () => {
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
                            <FileText size={24} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-navy-deep">Terms of Service</h1>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="lead text-lg">
                            Welcome to The Gesit Companies website. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>

                        <div className="my-8 h-px bg-slate-100" />

                        <div className="space-y-8">
                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <CheckCircle size={20} className="text-[#BC9C33]" />
                                    Use License
                                </h3>
                                <p className="mb-4">Permission is granted to temporarily download one copy of the materials (information or software) on The Gesit Companies' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Modify or copy the materials</li>
                                    <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
                                    <li>Attempt to decompile or reverse engineer any software contained on The Gesit Companies' website</li>
                                    <li>Remove any copyright or other proprietary notations from the materials</li>
                                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                                </ul>
                                <p className="mt-4">This license shall automatically terminate if you violate any of these restrictions and may be terminated by The Gesit Companies at any time.</p>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <AlertTriangle size={20} className="text-[#BC9C33]" />
                                    Disclaimer
                                </h3>
                                <p className="mb-4">The materials on The Gesit Companies' website are provided on an 'as is' basis. The Gesit Companies makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                                <p>Further, The Gesit Companies does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-navy-deep mb-4">
                                    <XCircle size={20} className="text-[#BC9C33]" />
                                    Limitations
                                </h3>
                                <p>
                                    In no event shall The Gesit Companies or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Gesit Companies' website, even if The Gesit Companies or a The Gesit Companies authorized representative has been notified orally or in writing of the possibility of such damage.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Accuracy of Materials</h3>
                                <p>
                                    The materials appearing on The Gesit Companies' website could include technical, typographical, or photographic errors. The Gesit Companies does not warrant that any of the materials on its website are accurate, complete or current. The Gesit Companies may make changes to the materials contained on its website at any time without notice. However, The Gesit Companies does not make any commitment to update the materials.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Links</h3>
                                <p>
                                    The Gesit Companies has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by The Gesit Companies of the site. Use of any such linked website is at the user's own risk.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Modifications</h3>
                                <p>
                                    The Gesit Companies may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Governing Law</h3>
                                <p>
                                    These terms and conditions are governed by and construed in accordance with the laws of Indonesia and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-navy-deep mb-4">Contact Information</h3>
                                <p>
                                    If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServicePage;
