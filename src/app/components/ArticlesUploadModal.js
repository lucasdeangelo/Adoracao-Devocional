'use client'
import { useState } from 'react';
import { uploadArticle } from '@/lib/supabase';

export default function ArticleUploadModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      setStatus('Preencha o título e o conteúdo!');
      return;
    }

    setIsUploading(true);
    setStatus('Salvando artigo...');

    try {
      // Cria um slug a partir do título
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      
      const fileName = `${slug}.md`;
      const fullContent = `# ${title}\n\n${content}`;
      
      await uploadArticle(fileName, fullContent, {
        title,
        slug
      });

      setStatus('Artigo salvo com sucesso!');
      if (onSuccess) onSuccess();
      
      // Limpa o formulário
      setTitle('');
      setContent('');
    } catch (error) {
      setStatus(`Erro: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Adicionar Artigo</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Conteúdo (Markdown)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            {status && (
              <div className={`p-3 rounded-lg ${
                status.includes('sucesso') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100'
              }`}>
                {status}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={isUploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? 'Salvando...' : 'Salvar Artigo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}