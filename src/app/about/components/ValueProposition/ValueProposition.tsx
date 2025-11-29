"use client";

import React from 'react';
import { HeartIcon, LockKeyIcon, GraduationCapIcon, SparkleIcon } from '@phosphor-icons/react';

const ValueProposition = () => {
  const values = [
    {
      icon: <HeartIcon size={32} weight="fill" />,
      title: 'Gratuito e Inclusivo',
      description: 'Acesso livre para todas as mulheres que precisam de apoio no tratamento da incontinência urinária.'
    },
    {
      icon: <GraduationCapIcon size={32} weight="fill" />,
      title: 'Baseado em Ciência',
      description: 'Desenvolvido com fisioterapeutas especialistas, seguindo protocolos validados cientificamente.'
    },
    {
      icon: <LockKeyIcon size={32} weight="fill" />,
      title: 'Privado e Seguro',
      description: 'Seus dados são protegidos. Interface discreta para uso sem constrangimento.'
    },
    {
      icon: <SparkleIcon size={32} weight="fill" />,
      title: 'Personalizado para Você',
      description: 'Planos de exercícios adaptados às suas necessidades e nível de condicionamento.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Por que escolher o Daily IU?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Um aplicativo desenvolvido pensando em você, com respeito, ciência e acessibilidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-purple-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-purple-02 rounded-2xl flex items-center justify-center text-purple-03 mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;