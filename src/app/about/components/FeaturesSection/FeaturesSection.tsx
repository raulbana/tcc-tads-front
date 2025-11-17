"use client";
import React from 'react';
import { 
  VideoIcon, 
  NotebookIcon, 
  ChartLineUpIcon, 
  BookOpenIcon,
  DeviceMobileIcon,
  PersonArmsSpreadIcon
} from '@phosphor-icons/react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <VideoIcon size={40} weight="fill" />,
      title: 'Exercícios Guiados',
      description: 'Vídeos instrutivos e ilustrações para realizar os exercícios corretamente em casa.'
    },
    {
      icon: <NotebookIcon size={40} weight="fill" />,
      title: 'Diário Miccional',
      description: 'Registre seus eventos e acompanhe a evolução do seu quadro ao longo do tempo.'
    },
    {
      icon: <ChartLineUpIcon size={40} weight="fill" />,
      title: 'Plano Personalizado',
      description: 'Treinos adaptados ao seu perfil, com progressão gradual e respeitando seus limites.'
    },
    {
      icon: <BookOpenIcon size={40} weight="fill" />,
      title: 'Conteúdo Educativo',
      description: 'Artigos, dicas e informações confiáveis sobre saúde pélvica e bem-estar.'
    },
    {
      icon: <DeviceMobileIcon size={40} weight="fill" />,
      title: 'Web + Mobile',
      description: 'Acesse de qualquer dispositivo: celular, tablet ou computador.'
    },
    {
      icon: <PersonArmsSpreadIcon size={40} weight="fill" />,
      title: 'Acessível',
      description: 'Interface simples, fontes grandes, alto contraste e modo seguro para privacidade.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Recursos que fazem a diferença
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ferramentas práticas para você gerenciar sua saúde com autonomia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-purple-04 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;