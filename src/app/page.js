'use client'
import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval, isToday, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completedDates, setCompletedDates] = useState([]);
  const [currentStep, setCurrentStep] = useState('calendar');
  const [answers, setAnswers] = useState({});
  
  // Gerar dias da semana atual
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: addDays(currentWeekStart, 6)
  });

  // Navegação entre semanas
  const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));

  const handleComplete = () => {
    if (!completedDates.some(d => isSameDay(d, selectedDate))) {
      setCompletedDates([...completedDates, selectedDate]);
    }
    setCurrentStep('calendar');
  };
  
  const formattedDate = format(selectedDate, "EEEE dd/MM/yyyy", { 
    locale: ptBR 
  });

  // Componente de Perguntas
  // const QuestionStep = () => {
  //   const questions = [
  //     "Qual motivo me faria levantar da cama e por quê?",
  //     "Uma Motivação pra hoje",
  //     "Uma murmuração para esquecer",
  //   ];
  //   return (
  //     <div className="bg-white p-6 rounded-xl shadow-sm">
  //       <div className='mb-10 flex items-center gap-4'>
  //         <button
  //           onClick={() => setCurrentStep('calendar')}
  //           className="p-1.5 rounded-md bg-[#FFCB69] cursor-pointer"
  //           style={{ color: '#FFFFFF' }}
  //         >
  //           <ChevronLeftIcon className="w-5 h-5" />
  //         </button>

  //         <h3 className="font-nunito font-bold text-xl text-black">
  //         {formattedDate.split(' ').map((word, index) => (
  //           <span key={index}>
  //             {index === 0 ? 
  //               word.charAt(0).toUpperCase() + word.slice(1) + ' - ' : 
  //               word
  //             }
  //             {index === 0}
  //           </span>
  //         ))}
  //       </h3>
  //       </div>
  //       {questions.map((question, index) => (
  //         <div key={index} className="mb-6">
  //           <label className="block text-gray-700 mb-2 font-medium">{question}</label>
  //           <textarea
  //             onChange={(e) => setAnswers({...answers, [index]: e.target.value})}
  //             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yelllow-500 focus:border-transparent"
  //             rows="2"
  //             placeholder="Escreva sua resposta..."
  //           />
  //         </div>
  //       ))}

  //       <button
  //         onClick={() => setCurrentStep('reflection')}
  //         className="w-full bg-[#FFCB69] text-white py-3 rounded-lg font-bold transition-colors cursor-pointer"
  //       >
  //         Avançar
  //       </button>
  //     </div>
  //   );
  // };

   // Componente de Reflexão
   const ShowText = () => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchReflection = async () => {
        try {
          const dateString = format(selectedDate, 'yyyy-MM-dd');
          const response = await fetch(`/reflections/${dateString}.md`)

  
          if (!response.ok) {
            setContent('# Reflexão do Dia\n\nVolte amanhã para uma nova reflexão! 🙏');
            return;
          }
  
          const text = await response.text();
          setContent(text);
        } catch (error) {
          setContent('# Erro\n\nNão foi possível carregar a reflexão');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchReflection();
    });
  

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className='mb-10 flex items-center gap-4'>
          <button
            onClick={() => setCurrentStep('calendar')}
            className="p-1.5 rounded-md bg-[#FFCB69] cursor-pointer"
            style={{ color: '#FFFFFF' }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <h3 className="font-nunito font-bold text-xl text-black">
          {formattedDate.split(' ').map((word, index) => (
            <span key={index}>
              {index === 0 ? 
                word.charAt(0).toUpperCase() + word.slice(1) + ' - ' : 
                word
              }
              {index === 0}
            </span>
          ))}
          </h3>
        </div>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : (
          <ReactMarkdown
            
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl text-black font-bold mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl text-black font-bold mb-4" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg text-black font-bold mb-4" {...props} />,
              p: ({ node, ...props }) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />, 
              ul: ({ node, ...props }) => <h1 className="text-gray-700 font-medium mb-4" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#FFCB69] pl-4 bg-gray-50  my-4 text-gray-600" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
        
        <button
          onClick={handleComplete}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Concluir leitura de hoje
        </button>
      </div>
    );
  };

  // Componente do calendário horizontal
  const Calendar = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevWeek}
          className="p-1.5 rounded-md bg-[#FFCB69] cursor-pointer"
          style={{ color: '#FFFFFF' }}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center gap-2">
          <div className="font-nunito font-bold text-black text-lg">
            {format(currentWeekStart, 'MMMM yyyy', { locale: ptBR })}
          </div>

          <div className="flex gap-2">
            {weekDays.map((day, index) => {
              const isCompleted = completedDates.some(d => isSameDay(d, day));
              const isTodayDate = isToday(day);
              const isSelected = isSameDay(day, selectedDate);
              
              return (
                <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  w-12 h-12 flex flex-col items-center justify-center rounded-lg text-sm transition-all relative
                  ${isTodayDate ? 'font-bold' : 'font-semibold'}
                  ${isSelected && !isTodayDate ? 'bg-gray-200' : 'bg-white'}
                `}
                style={{
                  backgroundColor: isTodayDate ? '#FFCB69' : undefined,
                  color: isTodayDate ? 'white' : 'black'
                }}
              >
                <span className="font-nunito">
                  {format(day, 'eee', { locale: ptBR }).slice(0, 3)}
                </span>
                <span className="font-poppins text-base">
                  {format(day, 'd')}
                </span>
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                )}
              </button>
              );
            })}
  
          </div>
        </div>

        <button
          onClick={handleNextWeek}
          className="p-1.5 rounded-md bg-[#FFCB69] cursor-pointer"
          style={{ color: '#FFFFFF' }}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => setCurrentStep('reflection')}
        className="w-full py-3 rounded-lg font-bold text-white hover:bg-yellow-600 transition-colors cursor-pointer"
        style={{ backgroundColor: '#FFCB69' }}
      >
        Começar leitura
      </button>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Bom dia! A paz do Senhor</h1>
      
      {currentStep === 'calendar' && <Calendar />}
      {/* {currentStep === 'questions' && <QuestionStep />} */}
      {currentStep === 'reflection' && <ShowText />}
    </div>
  );
}