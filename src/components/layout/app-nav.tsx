import { NavLink } from "react-router-dom"
import { cn } from "cn"
import { ClipboardList, MapPin, Receipt, Tags, Utensils } from "lucide-react"

const navItems = [
    { to: '/categories', label: 'Categorias', icon: Tags },
    { to: '/products', label: 'Produtos', icon: Utensils },
    { to: '/spots', label: 'Mesas', icon: MapPin },
    { to: '/guest-checks', label: 'Comandas', icon: Receipt },
    { to: '/orders', label: 'Kanban Pedidos', icon: ClipboardList },
]

export function AppNav() {

    return (
        <nav className="w-full">
            <ul className="overflow-hidden rounded-xl border border-border/70 bg-transparent">
                {navItems.map((item) => (
                    <li key={item.to} className="relative">
                        <NavLink
                            to={item.to}
                            className={({ isActive }) => cn(
                                'relative flex w-full items-center gap-3 px-5 py-5',
                                'font-menu text-lg font-semibold uppercase tracking-tight',
                                'border border-transparent',
                                'transition-colors duration-200',
                                'hover:z-10 hover:text-[#B86A2C]',
                                isActive
                                    ? ['border-[#B86A2C]', 'bg-primary/5', 'text-[#B86A2C]']
                                    : ['text-foreground', 'border-b-border/60']
                            )}
                        >
                            <item.icon className="size-10 text-brand" />
                            <span className="leading-tight">
                                {item.label}
                            </span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
