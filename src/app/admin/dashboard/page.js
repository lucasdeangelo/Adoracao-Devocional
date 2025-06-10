'use client'
import AdminLayout from '../../components/adminLayout';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase'

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !selectedDate) {
        setStatus('Selecione a data e o arquivo!')
        return
      }
    try {
        const { data, error } = await supabase.storage
        .from('reflections')
        .upload(`${selectedDate}.md`, file, {
          contentType: 'text/markdown',
          upsert: true,
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY}`
          }      
        })

      if (error) throw error
      
      setStatus('✅ Arquivo salvo com sucesso!')
      setFile(null)
      setSelectedDate('')
    } catch (error) {
      setStatus(`❌ Erro: ${error.message}`)
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl text-black font-bold mb-6">Upload de Texto Diário</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-black mb-2 font-bold text-Nunito">Data da Reflexão</label>
            <input
              type="date"
              required
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-gray-700 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-black font-bold">Arquivo .md</label>
            <input
              type="file"
              required
              accept=".md"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-gray-700 p-3 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full  font-bold cursor-pointer bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Salvar Reflexão
          </button>

          {status && <p className="mt-4 p-3 text-black bg-gray-200 rounded-lg">{status}</p>}
        </form>
      </div>
    </AdminLayout>
  );
}