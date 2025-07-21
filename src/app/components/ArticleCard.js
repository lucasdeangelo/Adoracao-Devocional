'use client'
import Link from 'next/link';
import clsx from 'clsx';
import useDarkMode from '../hooks/useDarkMode';
import { stripMarkdown } from '../utils/stripMarkdown';

export default function ArticleCard({ title, preview, slug, date, variant = 'list' }) {
  const [darkMode] = useDarkMode();

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const baseClasses = 'rounded-lg shadow transition-all duration-300 flex flex-col h-full group cursor-pointer';

  const variantStyles = {
    headline: darkMode ? 'bg-gray-800 text-white p-8 md:p-12' : 'bg-white text-black p-8 md:p-12',
    main: darkMode ? 'bg-gray-800 text-white p-6 mt-5' : 'bg-white text-black p-6 mt-5',
    list: darkMode ? 'bg-gray-800 text-white p-6 mt-10' : 'bg-white text-black p-6 mt-10'
  };

  const titleClasses = clsx(
    'group-hover:underline',
    variant === 'headline' ? 'text-4xl font-bold mb-2' :
    variant === 'main' ? 'text-2xl font-bold mb-2' :
    'text-xl font-bold mb-1',
    darkMode ? 'text-white' : 'text-black'
  );

  const previewClasses = clsx(
    variant === 'headline' ? (darkMode ? 'text-gray-300' : 'text-gray-700') :
    variant === 'main' ? (darkMode ? 'text-gray-300' : 'text-gray-600') :
    (darkMode ? 'text-gray-400' : 'text-gray-600'),
    variant === 'headline' ? 'text-lg' : variant === 'main' ? 'text-base' : 'text-sm'
  );

  const dateClasses = darkMode ? 'text-gray-400' : 'text-gray-500';
  
  return (
    <Link href={`/articles/${slug}`} passHref>
      <div className={clsx(baseClasses, variantStyles[variant])}>
        <div className="flex-grow">
          <h2 className={titleClasses}>{title}</h2>
          <div className='flex gap-1'>
            <p className="text-sm text-gray-400 mb-2">{formattedDate} </p>             
          </div>
          <p className={clsx(previewClasses, 'line-clamp-3')}>
            {stripMarkdown(preview)}...
          </p>
        </div>
      </div>
    </Link>
  );
}
