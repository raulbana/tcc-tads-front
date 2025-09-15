const useModal = () => {
  const getContainerStyle = () =>
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4";

  const getModalStyle = (size?: 'small' | 'medium' | 'large' | 'full') => {
    const baseStyle = "bg-white rounded-2xl shadow-lg relative max-h-[90vh] overflow-hidden";
    
    switch (size) {
      case 'small':
        return `${baseStyle} w-full max-w-md p-6`;
      case 'large':
        return `${baseStyle} w-full max-w-6xl p-6`;
      case 'full':
        return `${baseStyle} w-full max-w-7xl p-6`;
      default:
        return `${baseStyle} w-full max-w-lg p-6`;
    }
  };

  const getHeaderStyle = () =>
    "flex justify-between items-center border-b border-gray-03 pb-3";

  const getTitleStyle = () => "text-lg font-semibold";

  const getCloseButtonStyle = () =>
    "text-gray-08 hover:text-purple-04 text-2xl cursor-pointer transition";

  const getBodyStyle = () => "mt-4 text-sm text-gray-08 overflow-y-auto max-h-[calc(90vh-120px)]";

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
