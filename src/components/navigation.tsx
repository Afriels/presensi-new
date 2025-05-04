import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Siswa", href: "/students" },
  { name: "Pelajaran", href: "/subjects" },
  { name: "Kelas", href: "/classes" },
  { name: "Guru", href: "/teachers" },
  { name: "Absensi", href: "/attendance" },
  { name: "Kode QR", href: "/qr-codes" },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-primary">
      <div className="container">
        <div className="flex h-16 items-center space-x-4 text-white">
          <div className="font-bold">Hadir Saja Admin</div>
          <div className="flex space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
