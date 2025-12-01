"use client";

import React from 'react';
import Link from 'next/link';
import { AppleLogoIcon, GooglePlayLogoIcon } from '@phosphor-icons/react';
import DailyIULogo from '@/app/assets/illustrations/daily-iu-logo.svg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8">
                <DailyIULogo className="w-full h-full" />
              </div>
              <span className="text-3xl font-bold">Daily IU</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Seu aplicativo de apoio no gerenciamento da incontinência urinária. 
              Gratuito, acessível e desenvolvido com especialistas.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <GooglePlayLogoIcon size={20} weight="bold" />
                Google Play
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <AppleLogoIcon size={20} weight="bold" />
                App Store
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Sobre o Daily IU
                </Link>
              </li>
              <li>
                <Link href="/authentication/register" className="text-gray-400 hover:text-white transition-colors">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/authentication/login" className="text-gray-400 hover:text-white transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/support/talkToUs" className="text-gray-400 hover:text-white transition-colors">
                  Fale conosco
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Daily IU. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Desenvolvido em parceria com LAIS - UFPR
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
