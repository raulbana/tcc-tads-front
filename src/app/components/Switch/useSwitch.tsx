import { SwitchType, SwitchSize } from "./Switch";

const useSwitch = () => {
  const getSwitchColor = (type: SwitchType, checked: boolean) => {
    switch (type) {
      case "PRIMARY":
        return checked ? "bg-purple-04 hover:bg-purple-03" : "bg-gray-07";
      case "SECONDARY":
        return checked ? "bg-purple-02 hover:bg-purple-03" : "bg-gray-07";
      case "TERTIARY":
        return checked ? "bg-gray-08 hover:bg-gray-06" : "bg-gray-07";
      default:
        return "bg-gray-07";
    }
  };

  const getSwitchSize = (size: SwitchSize, knob: boolean = false) => {
    if (knob) {
      switch (size) {
        case "SMALL":
          return "w-3 h-3";
        case "MEDIUM":
          return "w-4 h-4";
        case "LARGE":
          return "w-6 h-6";
        default:
          return "w-4 h-4";
      }
    }

    switch (size) {
      case "SMALL":
        return "w-8 h-4";
      case "MEDIUM":
        return "w-10 h-6";
      case "LARGE":
        return "w-14 h-8";
      default:
        return "w-10 h-6";
    }
  };

  const getTextSize = (size: SwitchSize) => {
    switch (size) {
      case "SMALL":
        return "text-gray-08 text-sm";
      case "MEDIUM":
        return "text-gray-08 text-base";
      case "LARGE":
        return "text-gray-08 text-lg";
      default:
        return "text-gray-08 text-base";
    }
  };
  return { getSwitchColor, getSwitchSize, getTextSize };
};

export default useSwitch;
