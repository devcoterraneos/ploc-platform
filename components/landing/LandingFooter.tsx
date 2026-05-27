import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { org } from "@/lib/landing-config";

function SocialIcon({ href, label, path }: { href: string; label: string; path: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B1A1A] hover:text-white flex items-center justify-center transition-colors group"
    >
      <svg className="w-4 h-4 fill-current text-gray-500 group-hover:text-white transition-colors" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );
}

const FACEBOOK_PATH =
  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const INSTAGRAM_PATH =
  "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z";
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const YOUTUBE_PATH =
  "M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z";

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <Image
              src={org.logo}
              alt={org.name}
              width={100}
              height={45}
              className="mb-3"
            />
            <p className="text-sm text-gray-500 leading-relaxed">
              {org.footerDescription}
            </p>
          </div>

          {/* Contact + Social */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {org.email && (
                <a
                  href={`mailto:${org.email}`}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {org.email}
                </a>
              )}
              {org.phone && (
                <a
                  href={`tel:${org.phone}`}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {org.phone}
                </a>
              )}
            </div>

            {/* Social icons */}
            <div className="flex gap-2">
              <SocialIcon href={org.social.facebook} label="Facebook" path={FACEBOOK_PATH} />
              <SocialIcon href={org.social.instagram} label="Instagram" path={INSTAGRAM_PATH} />
              <SocialIcon href={org.social.youtube} label="YouTube" path={YOUTUBE_PATH} />
              <SocialIcon href={org.social.linkedin} label="LinkedIn" path={LINKEDIN_PATH} />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">{org.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
