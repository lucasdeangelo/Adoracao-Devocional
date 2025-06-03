'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import CalendarModal from '../app/components/CalendarModal';

const DAYS_VISIBLE = 7 // Dias inicialmente visíveis
const BUFFER_DAYS = 5 // Dias extras para pré-carregar

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [days, setDays] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completedDates, setCompletedDates] = useState([]);
  const [currentStep, setCurrentStep] = useState('calendar');
  const [answers, setAnswers] = useState({});
  const [contentAvailable, setContentAvailable] = useState(false);
  const loaderRef = useRef(null)
  const observer = useRef(null)
  
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  
  const handleDateSelect = (date) => {
  setSelectedDate(date);
  setCurrentStep('reflection'); // Vá direto para o texto do dia
};

const loadDays = useCallback((direction = 'next') => {
    const newDays = eachDayOfInterval({
      start: direction === 'next' 
        ? addDays(currentDate.current, days.length + 1)
        : subDays(currentDate.current, BUFFER_DAYS),
      end: direction === 'next' 
        ? addDays(currentDate.current, days.length + BUFFER_DAYS)
        : subDays(currentDate.current, 1)
    })
    
    setDays(prev => direction === 'next' 
      ? [...prev, ...newDays] 
      : [...newDays, ...prev]
    )
  }, [currentDate, days.length])

  useEffect(() => {
    // Carrega dias iniciais
    const initialDays = eachDayOfInterval({
      start: subDays(new Date(), DAYS_VISIBLE),
      end: addDays(new Date(), DAYS_VISIBLE)
    })
    setDays(initialDays)
  }, [])

  useEffect(() => {
    // Configura o Intersection Observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadDays('next')
        }
      })
    }, options)

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loadDays])

  const visibleMonth = format(days[Math.floor(days.length / 2)] || new Date(), 'MMMM yyyy', { locale: ptBR })

  
  useEffect(() => {
    // Carregar dados salvos
    const savedData = localStorage.getItem('devocionalProgress')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setCompletedDates(parsedData.completedDates.map(date => new Date(date)))
      setAnswers(parsedData.answers)
    }
  }, [])
  
  useEffect(() => {
    // Salvar dados automaticamente
    const dataToSave = {
      completedDates: completedDates.map(date => date.toISOString()),
      answers
    }
    localStorage.setItem('devocionalProgress', JSON.stringify(dataToSave))
  }, [completedDates, answers])
  
  const handleComplete = () => {
    const alreadyCompleted = completedDates.some(d => isSameDay(d, selectedDate))
  
  if (!alreadyCompleted) {
    setCompletedDates([...completedDates, selectedDate])
  }
  
  setCurrentStep('calendar')

  };

  const handleCompletion = () => {
    if (contentAvailable) {
      handleComplete()
    }
  }
  
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
            setContentAvailable(false) //Bloqueia a conclusão
            return;
          }
  
          const text = await response.text();
          setContent(text);
          setContentAvailable(true) //Permite a conclusão
        } catch (error) {
          setContent('# Erro\n\nNão foi possível carregar a reflexão');
          setContentAvailable(false) //Bloqueia a conclusão
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
            className="p-1.5 rounded-md bg-[#FFCB69] hover:bg-[#FFC352] cursor-pointer"
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
          onClick={handleCompletion}
          className={`w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-bold transition-colors${
            contentAvailable 
              ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!contentAvailable}  
        >
          {contentAvailable ? 'Concluir leitura de hoje' : 'Conclusão indisponível'}
        </button>
      </div>
    );
  };

  // Componente do calendário horizontal
  const Calendar = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">       
        <div className="flex-1 mx-2 overflow-hidden">
          <div className="font-nunito font-bold text-black text-center text-lg mb-2">
            {visibleMonth}
          </div>
          
          <div             
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          >
            {days.map((day, index) => {
            const isCompleted = completedDates.some(d => isSameDay(d, day));
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, selectedDate);
  
            return (
              <div 
                key={day.toISOString()}
                className="min-w-[17%] flex-shrink-0" // Mantém 5 dias visíveis no mobile
              >
                <button
                  onClick={() => setSelectedDate(day)}
                  className={`
                    w-full h-12 md:h-10 lg:h-12
                    flex flex-col items-center justify-center 
                    rounded-lg text-sm transition-all relative
                    ${isTodayDate ? 'font-bold' : 'font-semibold'}
                    ${isSelected && !isTodayDate ? 'bg-gray-200' : 'bg-white'}
                  `}
                  style={{
                    backgroundColor: isTodayDate ? '#FFCB69' : undefined,
                    color: isTodayDate ? 'white' : 'black'
                  }}
                >
                  <span className="font-nunito text-xs">
                    {format(day, 'eee', { locale: ptBR }).slice(0, 3)}
                  </span>
                  <span className="font-poppins text-base md:text-sm lg:text-base">
                    {format(day, 'd')}
                  </span>
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
            </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('reflection')}
        className="w-full py-2 md:py-3 bg-[#FFCB69] hover:bg-[#FFC352] text-white rounded-lg font-bold transition-colors cursor-pointer"
      >
        Começar leitura
      </button>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-screen-md mx-auto">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Bom dia! A paz do Senhor</h1>
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="px-3 py-1 mb-3.5 rounded-xl bg-[#FFCB69] hover:bg-[#FFC352] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {currentStep === 'calendar' && <Calendar />}
      {/* {currentStep === 'questions' && <QuestionStep />} */}
      {currentStep === 'reflection' && <ShowText />}
      
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onDateSelect={handleDateSelect}
        completedDates={completedDates}
      />
    </div>
  );
}