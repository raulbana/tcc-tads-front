import { ButtonType, ButtonSize } from "./Button";

const useButton = () => {
  const getButtonColor = (type: ButtonType) => {
    switch (type) {
      case "PRIMARY":
        return "text-white bg-purple-04 hover:bg-purple-03";
      case "SECONDARY":
        return "text-purple-04 bg-purple-02 hover:bg-purple-03";
      case "TERTIARY":
        return "text-gray-08 bg-white hover:bg-gray-06";
      default:
        return "text-gray-08 bg-white hover:bg-gray-06";
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
