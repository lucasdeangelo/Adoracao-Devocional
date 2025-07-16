"use client";
import { useState, useEffect } from "react";
import { getReflectionsList, deleteReflection } from "../../../lib/supabase";
import AdminLayout from "../../components/adminLayout";
import FileUploadModal from "../../components/FileUploadModal";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [reflections, setReflections] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentReflection, setCurrentReflection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  // Carregar reflexões
  useEffect(() => {
    const fetchReflections = async () => {
      const files = await getReflectionsList();
      setReflections(files || []);
    };

    fetchReflections();
  }, []);

  // Filtrar reflexões por termo de busca
  const filteredReflections = reflections.filter((reflection) => {
    return reflection.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEdit = (reflection) => {
    router.push(`/admin/edit/${encodeURIComponent(reflection.name)}`);
  };

  // No mapeamento das reflexões, atualizar o botão de edição:
  <button
    onClick={() => handleEdit(reflection)}
    className="text-blue-500 hover:text-blue-700 cursor-pointer"
  >
    Editar
  </button>;

  const handleDelete = async (fileName) => {
    if (!confirm("Tem certeza que deseja excluir esta reflexão?")) return;

    try {
      const { error } = await deleteReflection(fileName);

      if (error) throw error;

      setReflections(reflections.filter((r) => r.name !== fileName));
      setStatus("Reflexão excluída com sucesso!");
    } catch (error) {
      setStatus(`Erro ao excluir: ${error.message}`);
    }
  };

  const handleSaveSuccess = () => {
    // Recarrega a lista após salvar
    const fetchReflections = async () => {
      const files = await getReflectionsList();
      setReflections(files || []);
    };

    fetchReflections();
    setStatus("Reflexão salva com sucesso!");
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Todas as Reflexões</h1>
          <div className="flex space-x-3">
            {/* Botão para Upload de Arquivo */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 cursor-pointer"
            >
              Upload de Arquivo
            </button>
            
            {/* Botão para Adicionar Reflexão */}
            <button
              onClick={() => router.push('/admin/add')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            >
              Adicionar Reflexão
            </button>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nome de arquivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white"
          />
        </div>

        {status && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              status.includes("sucesso")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </div>
        )}

        {/* Lista de reflexões */}
        <div className="space-y-4">
          {filteredReflections.length > 0 ? (
            filteredReflections.map((reflection) => (
              <div
                key={reflection.name}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{reflection.name}</h3>
                    <p className="text-sm text-gray-500">
                      Última modificação:{" "}
                      {new Date(reflection.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(reflection)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(reflection.name)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? "Nenhuma reflexão encontrada"
                  : "Nenhuma reflexão cadastrada"}
              </p>
            </div>
          )}
        </div>

        {/* Modal para adicionar/editar */}
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          reflection={currentReflection}
          onSave={handleSaveSuccess}
        />
      </div>
    </AdminLayout>
  );
}
