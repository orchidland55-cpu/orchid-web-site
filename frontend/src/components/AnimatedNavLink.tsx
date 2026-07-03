import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { ReactNode } from "react";

interface AnimatedNavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

const AnimatedNavLink = ({ to, children, className = "" }: AnimatedNavLinkProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-1 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive ? "text-primary" : "text-foreground hover:text-primary"
        } ${className}`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <motion.div
              layoutId="nav-underline"
              className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

export default AnimatedNavLink;