'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/adminLayout';
import { uploadReflection } from '@/lib/supabase';

export default function AddReflection() {
  const router = useRouter();
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    if (!filename) {
      setStatus('Digite um nome para o arquivo');
      return;
    }
    
    if (!filename.endsWith('.md')) {
      setStatus('O nome do arquivo deve terminar com .md');
      return;
    }

    setIsSaving(true);
    setStatus('Salvando...');
    
    try {
      await uploadReflection(filename, content);
      setStatus('Salvo com sucesso! Redirecionando...');
      
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (error) {
      setStatus(`Erro ao salvar: ${error.message}`);
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Nova Reflexão</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

        {status && (
          <div className={`p-3 mb-4 rounded-lg ${
            status.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status}
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-medium">Nome do Arquivo</label>
          <div className="flex">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full p-3 border rounded-l-lg"
              placeholder="exemplo: 2023-10-01.md"
            />
            <div className="bg-gray-100 border-t border-r border-b rounded-r-lg px-4 flex items-center">
              .md
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Use o formato YYYY-MM-DD.md para datas
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[60vh] p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder="Escreva sua reflexão em markdown..."
          />
        </div>
      </div>
    </AdminLayout>
  );
}