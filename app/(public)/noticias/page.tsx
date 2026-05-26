import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { news } from "@/lib/data";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Las últimas noticias e iniciativas de la Corporación PLOC en Puerto Octay.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticiasPage() {
  const published = news.filter((n) => n.isPublished);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-gray-100 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-3">
            Noticias
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Últimas noticias
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {published.map((article) => (
            <Link
              key={article.id}
              href={`/noticias/${article.slug}`}
              className="group flex flex-col sm:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Color bar */}
              <div className="sm:w-2 w-full h-2 sm:h-auto bg-[#8B1A1A] flex-shrink-0" />
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-red-50 text-[#8B1A1A] px-2.5 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.date)}
                  </div>
                </div>
                <h2 className="font-bold text-gray-900 mb-1.5 group-hover:text-[#8B1A1A] transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
