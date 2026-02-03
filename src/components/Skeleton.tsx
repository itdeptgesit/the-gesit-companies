import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    variant?: "rect" | "circle" | "text";
}

const Skeleton = ({ className = "", variant = "rect" }: SkeletonProps) => {
    const baseStyles = "bg-slate-200 relative overflow-hidden";
    const variantStyles = {
        rect: "rounded-card-sm",
        circle: "rounded-full",
        text: "rounded-md h-4",
    };

    return (
        <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
        </div>
    );
};

export default Skeleton;
