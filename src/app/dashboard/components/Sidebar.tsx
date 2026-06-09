"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdReceipt, MdBarChart } from "react-icons/md";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: MdDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: MdReceipt },
  { label: "Reports", href: "/dashboard/reports", icon: MdBarChart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#009438]/10 text-[#009438]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className="text-lg" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
