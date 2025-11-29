import React from 'react';
const Credibility = () => {
  return (
    <section className="py-16 md:py-24 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Parceria com instituições de excelência
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            O Daily IU foi desenvolvido em colaboração com especialistas e instituições 
            de ensino e pesquisa reconhecidas
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Liga Acadêmica de Inovação em Saúde
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>LAIS - UFPR</strong>
              </p>
              <p className="text-gray-600">
                Universidade Federal do Paraná
              </p>
            </div>

            <div className="w-32 h-32 relative">
              <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 text-sm">Logo LAIS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credibility;