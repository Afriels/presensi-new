import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
  LayoutDashboard,
  GraduationCap,
  UserSquare2,
  QrCode,
  Menu,
  X,
  Clock,
  FileSpreadsheet
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kelas", href: "/classes", icon: GraduationCap },
  { name: "Guru", href: "/teachers", icon: UserSquare2 },
  { name: "Kode QR", href: "/qr-codes", icon: QrCode },
  { name: "Waktu Presensi", href: "/attendance-times", icon: Clock },
  { name: "Laporan", href: "/reports", icon: FileSpreadsheet },
]

export function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-primary text-white w-64 transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">Hadir Saja Admin</h1>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-6">
            <p className="text-sm text-white/60">© 2025 Hadir Saja</p>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="md:ml-64 min-h-screen bg-gray-50">
        <main className="p-6">
          {/* Content will be rendered here */}
        </main>
      </div>
    </>
  )
}
