import { downloadArticle } from '../../../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  if (!slug) return notFound();

  const fileName = `${slug}.md`;

  try {
    const content = await downloadArticle(fileName);

    if (!content) {
      return notFound();
    }

    const titleMatch = content.match(/^#\s(.+)/m);
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');

    return (
      <div className="container mx-auto px-4 py-4 max-w-3xl">
        <Header/>
        
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
          ← Voltar para o início
        </Link>

        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl  font-bold mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl  font-bold mb-4" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg  font-bold mb-4" {...props} />,
              a: ({ node, ...props }) => <h3 className="text-lg  font-bold mb-4 cursor-pointer hover:underline" {...props} />,
              p: ({ node, ...props }) => <p className=" my-6 leading-relaxed" {...props} />, 
              ul: ({ node, ...props }) => <ul className=" list-disc font-medium mb-4 ml-4" {...props} />,
              li: ({ node, ...props }) => <li className=" list-decimal font-medium mb-4 ml-4" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#FFCB69] pl-4   my-4 " {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar artigo:', error);
    return notFound();
  }
}
