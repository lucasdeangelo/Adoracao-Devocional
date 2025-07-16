'use client'
import { useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';

export default function FileUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setStatus('Selecione um arquivo!');
      return;
    }

    // Verifica se é um arquivo .md
    if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
      setStatus('Por favor, selecione um arquivo .md');
      return;
    }

    setIsUploading(true);
    setStatus('Enviando arquivo...');

    try {
      // Usa o nome do arquivo como chave no bucket
      const fileName = file.name;
      
      const { data, error } = await supabaseAdmin.storage
        .from('reflections')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true, // Permite sobrescrever se já existir
          contentType: 'text/markdown'
        });

      if (error) throw error;

      setStatus('Arquivo enviado com sucesso!');
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      // Limpar o arquivo selecionado
      setFile(null);
    } catch (error) {
      setStatus(`Erro: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upload de Arquivo</h2>            
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Arquivo .md</label>
              <input
                type="file"
                accept=".md"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-lg"
                disabled={isUploading}
              />
            </div>

            {status && (
              <div className={`p-3 rounded-lg ${
                status.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {status}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
                disabled={isUploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
                disabled={isUploading || !file}
              >
                {isUploading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}