import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import Logo from "./Logo";

const footerLinks = {
  enlaces: [
    { href: "/proyectos", label: "Proyectos" },
    { href: "/impacto", label: "Impacto" },
    { href: "/transparencia", label: "Transparencia" },
    { href: "/noticias", label: "Noticias" },
    { href: "/contacto", label: "Contacto" },
  ],
  sobrePloc: [
    { href: "/nosotros", label: "Quiénes somos" },
    { href: "/nosotros#equipo", label: "Equipo" },
    { href: "/nosotros#alianzas", label: "Alianzas" },
    { href: "/documentos", label: "Documentos" },
    { href: "/nosotros#trabaja", label: "Trabaja con nosotros" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo size="md" className="mb-4" />
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Conectamos personas, ideas y recursos para impulsar proyectos que
              fortalecen la vida local del sur de Chile.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
              Enlaces
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.enlaces.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sobre PLOC */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
              Sobre PLOC
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.sobrePloc.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8B1A1A] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500">
                  Puerto Octay, Región de Los Lagos, Chile
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#8B1A1A] flex-shrink-0" />
                <a
                  href="mailto:contacto@corporacionploc.org"
                  className="text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors break-all"
                >
                  contacto@corporacionploc.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8B1A1A] flex-shrink-0" />
                <a
                  href="tel:+56997335142"
                  className="text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors"
                >
                  (56) 9 9733 5142
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-5">
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
                Síguenos
              </h5>
              <div className="flex gap-2.5">
                {[
                  {
                    href: "https://www.facebook.com/corporacionPLOC",
                    label: "Facebook",
                    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                  },
                  {
                    href: "https://www.instagram.com/corporacion_ploc",
                    label: "Instagram",
                    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                  },
                  {
                    href: "#",
                    label: "YouTube",
                    path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
                  },
                  {
                    href: "#",
                    label: "LinkedIn",
                    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
                  },
                ].map(({ href, label, path }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#8B1A1A] hover:text-white flex items-center justify-center transition-colors text-gray-600 group"
                    aria-label={label}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Corporación PLOC Puerto Octay — Todos los derechos reservados.
          </p>
          <div className="flex gap-5">
            <Link href="/politica-privacidad" className="text-xs text-gray-400 hover:text-[#8B1A1A] transition-colors">
              Política de privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-gray-400 hover:text-[#8B1A1A] transition-colors">
              Términos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
