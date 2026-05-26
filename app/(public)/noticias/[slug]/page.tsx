import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { news } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) return { title: "Noticia no encontrada" };
  return { title: article.title, description: article.excerpt };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NoticiaDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/noticias"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a noticias
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header bar */}
          <div className="h-2 bg-[#8B1A1A]" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold bg-red-50 text-[#8B1A1A] px-3 py-1 rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.date)}
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
              {article.excerpt}
            </p>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {article.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
