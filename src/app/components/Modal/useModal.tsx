const useModal = () => {
  const getContainerStyle = () =>
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm";

  const getModalStyle = () =>
    "bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative";

  const getHeaderStyle = () =>
    "flex justify-between items-center border-b border-gray-03 pb-3";

  const getTitleStyle = () => "text-lg text-gray-08 font-semibold";

  const getCloseButtonStyle = () =>
    "text-gray-08 hover:text-purple-04 text-2xl cursor-pointer transition";

  const getBodyStyle = () => "mt-4 text-sm text-gray-08";

  return {
    getContainerStyle,
    getModalStyle,
    getHeaderStyle,
    getTitleStyle,
    getCloseButtonStyle,
    getBodyStyle,
  };
};

export default useModal;
