import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Funções específicas para o bucket de reflexões e artigos
export const reflectionsBucket = "reflections";
export const articlesBucket = 'articles';

export const getReflectionsList = async () => {
  const { data, error } = await supabase.storage.from(reflectionsBucket).list();

  if (error) {
    console.error("Error listing reflections:", error);
    return [];
  }

  // Filtrar apenas arquivos .md
  return data.filter((file) => file.name.endsWith(".md"));
};

export const uploadReflection = async (fileName, content) => {
  try {
    // Criar um Blob com o conteúdo
    const fileContent = new Blob([content], { type: "text/markdown" });

    // Obter a extensão correta
    const finalFileName = fileName.endsWith(".md")
      ? fileName
      : `${fileName}.md`;

    // Fazer o upload
    const { data, error } = await supabaseAdmin.storage
      .from(reflectionsBucket)
      .upload(finalFileName, fileContent, {
        cacheControl: "3600",
        upsert: true,
        contentType: "text/markdown",
      });

    if (error) {
      console.error("Erro detalhado no upload:", {
        fileName,
        error,
        operation: "upsert",
      });
      throw new Error(`Falha no upload: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Erro no uploadReflection:", error);
    throw error;
  }
};

export const downloadReflection = async (fileName) => {
  const { data, error } = await supabase.storage
    .from(reflectionsBucket)
    .download(fileName);

  if (error) {
    console.error("Error downloading reflection:", error);
    return null;
  }

  return await data.text();
};

export const deleteReflection = async (fileName) => {
  const { data, error } = await supabaseAdmin.storage
    .from(reflectionsBucket)
    .remove([fileName]);

  return { data, error };
};

export const uploadArticle = async (fileName, content, metadata = {}) => {
  const fileContent = new Blob([content], { type: 'text/markdown' });
  
  const { data, error } = await supabaseAdmin.storage
    .from(articlesBucket)
    .upload(fileName, fileContent, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'text/markdown',
      metadata: metadata
    });

  if (error) throw error;
  return data;
};

export const getArticlesList = async () => {
  const { data, error } = await supabaseAdmin.storage
    .from(articlesBucket)
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (error) {
    console.error('Error listing articles:', error);
    return [];
  }

  return data.filter(file => file.name.endsWith('.md'));
};

export const downloadArticle = async (fileName) => {
  const { data, error } = await supabaseAdmin.storage
    .from(articlesBucket)
    .download(fileName);

  if (error) {
    console.error('Error downloading article:', error);
    return null;
  }

  return await data.text();
};

export const getArticleMetadata = async (fileName) => {
  const { data, error } = await supabaseAdmin.storage
    .from(articlesBucket)
    .getPublicUrl(fileName, {
      download: true
    });

  if (error) {
    console.error('Error getting article metadata:', error);
    return null;
  }

  return data;
};