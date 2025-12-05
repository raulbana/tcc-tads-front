"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppleLogoIcon, GooglePlayLogoIcon } from "@phosphor-icons/react";
import image from "@/app/assets/about/app_homescreen_image.png";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-purple-50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
              Cuide da sua saúde com{" "}
              <span className="text-black">autonomia e privacidade</span>
            </h1>

            <p className="text-lg md:text-xl text-black mb-8 max-w-2xl mx-auto lg:mx-0">
              O Daily IU é um aplicativo gratuito e acessível que ajuda você a
              gerenciar a incontinência urinária através de exercícios guiados,
              acompanhamento personalizado e conteúdo educativo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                <GooglePlayLogoIcon size={24} weight="fill" />
                <div className="text-left">
                  <div className="text-xs">Disponível no</div>
                  <div className="text-base font-bold">Google Play</div>
                </div>
              </a>

              <a
                href="#"
                className="inline-flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                <AppleLogoIcon size={24} weight="fill" />
                <div className="text-left">
                  <div className="text-xs">Baixar na</div>
                  <div className="text-base font-bold">App Store</div>
                </div>
              </a>
            </div>

            <Link
              href="/authentication/register"
              className="inline-block text-purple-800 font-semibold hover:text-purple-600 transition-colors"
            >
              Ou acesse a versão web →
            </Link>
          </div>

          <div className="relative">
            <div className="relative w-1/2 max-w-md mx-auto">
              <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-7 bg-gray-900 rounded-b-2xl z-10"></div>
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden">
                  <Image
                    src={image}
                    alt="Daily IU App"
                    width={400}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
