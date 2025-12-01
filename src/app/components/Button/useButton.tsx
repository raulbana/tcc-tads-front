import { ButtonType, ButtonSize } from "./Button";

const useButton = () => {
  const getButtonColor = (type: ButtonType, disabled: boolean) => {
    switch (type) {
      case "PRIMARY":
        if (disabled) {
          return "text-white bg-purple-03 hover:cursor-not-allowed";
        }
        return "text-white bg-purple-04 hover:bg-purple-03";
      case "SECONDARY":
        if (disabled) {
          return "text-purple-03 bg-purple-02 hover:cursor-not-allowed";
        }
        return "text-purple-04 bg-purple-02 hover:bg-purple-03";
      case "TERTIARY":
        if (disabled) {
          return "text-gray-04 border-gray-04 border-1 bg-gray-01 hover:cursor-not-allowed";
        }
        return "text-gray-08 border-gray-08 border-1 bg-gray-01 hover:bg-gray-06";
      default:
        if (disabled) {
          return "text-white bg-purple-03 hover:cursor-not-allowed";
        }
        return "text-white bg-purple-04 hover:bg-purple-03";
    }
  };

  const getButtonSize = (size: ButtonSize) => {
    switch (size) {
      case "SMALL":
        return "text-xs py-2 px-3";
      case "MEDIUM":
        return "text-base py-3 px-4";
      case "LARGE":
        return "text-lg py-4 px-8";
      default:
        return "text-base  py-3 px-4";
    }
  };

  return { getButtonColor, getButtonSize };
};

export default useButton;
