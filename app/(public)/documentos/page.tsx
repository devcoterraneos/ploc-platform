import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { documents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Documentos",
  description: "Accede a los documentos oficiales, memorias e informes de la Corporación PLOC.",
};

const categories = [...new Set(documents.map((d) => d.category))];

export default function DocumentosPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-gray-100 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-3">
            Documentos
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Documentos oficiales
          </h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            Memorias, estatutos, informes de transparencia y otros documentos de la
            Corporación PLOC disponibles para descarga.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {categories.map((cat) => (
          <div key={cat} className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{cat}</h2>
            <div className="space-y-3">
              {documents
                .filter((d) => d.category === cat)
                .map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#8B1A1A]/30 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-[#8B1A1A]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-[#8B1A1A] transition-colors">
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-400">{doc.description}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-[#8B1A1A] transition-colors" />
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
