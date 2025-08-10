"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../../components/adminLayout";
import { downloadReflection, uploadReflection } from "../../../../lib/supabase";

export default function EditReflection({ params }) {
  const router = useRouter();
  const { filename } = params;
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const decodedFilename = decodeURIComponent(filename);

  // Carregar conteúdo da reflexão
  useEffect(() => {
    const loadReflection = async () => {
      setIsLoading(true);
      try {
        const data = await downloadReflection(decodedFilename);
        setContent(data || "");
        setStatus("");
      } catch (error) {
        setStatus(`Erro ao carregar: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadReflection();
  }, [decodedFilename]);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("Salvando...");

    try {
      console.log("Tentando salvar:", {
        decodedFilename,
        contentLength: content.length,
      });

      await uploadReflection(decodedFilename, content);

      setStatus("Salvo com sucesso!");
      console.log("Arquivo salvo com sucesso");

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erro completo ao salvar:", error);
      setStatus(`Erro ao salvar: ${error.message}`);
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editando: {filename}</h1>

          <div className="flex space-x-2">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>

        {status && (
          <div
            className={`p-3 mb-4 rounded-lg ${
              status.includes("sucesso")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </div>
        )}

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[70vh] p-4 font-mono text-sm resize-none focus:outline-none"
              placeholder="Escreva sua reflexão em markdown..."
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
