"use client";
import React from 'react';
import { UserCirclePlusIcon, ListChecksIcon, ChartBarIcon, TrophyIcon } from '@phosphor-icons/react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCirclePlusIcon size={48} weight="fill" />,
      number: '01',
      title: 'Crie sua conta',
      description: 'Cadastre-se gratuitamente e responda um breve questionário sobre seu quadro.'
    },
    {
      icon: <ListChecksIcon size={48} weight="fill" />,
      number: '02',
      title: 'Receba seu plano',
      description: 'O aplicativo cria um plano de exercícios personalizado para você.'
    },
    {
      icon: <ChartBarIcon size={48} weight="fill" />,
      number: '03',
      title: 'Pratique e registre',
      description: 'Realize os exercícios guiados e registre seus eventos no diário miccional.'
    },
    {
      icon: <TrophyIcon size={48} weight="fill" />,
      number: '04',
      title: 'Acompanhe sua evolução',
      description: 'Veja seu progresso ao longo do tempo e ajuste seu treino conforme necessário.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Como funciona?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comece sua jornada em 4 passos simples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-6">
                <div className="relative w-24 h-24 mx-auto bg-purple-02 rounded-full flex items-center justify-center text-purple-04">
                  {step.icon}
                  <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-purple-04 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;