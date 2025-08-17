"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  href: string;
  className?: string;
  icon?: React.ReactNode;
}

const NavLink: React.FC<NavLink> = ({
  name,
  href,
  icon,
  className,
  ...props
}) => {
  const pathname = usePathname();
  const isActive =
    pathname.endsWith(href) || (href.includes(pathname) && pathname !== "/");
  const newClassName = `${
    isActive ? "border-b border-priamry text-primary" : ""
  } ${className}`;
  return (
    <span className="w-full sm:w-fit" {...props}>
      <Link
        className={`flex gap-1 py-2 px-3 font-serif border-b border-transparent hover:text-primary hover:border-primary duration-300 transition ${newClassName} items-center justify-center`}
        href={href}
      >
        {icon}
        {name}
      </Link>
    </span>
  );
};

export default NavLink;
