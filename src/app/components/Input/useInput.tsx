type InputType = "text" | "date" | "time" | "number";

const useInput = () => {
  const getInputStyle = (error?: boolean, disabled?: boolean) => {
    let base =
      "w-full rounded-lg border-2 px-4 py-2 outline-none transition-colors";
    let border = error
      ? "border-red-500 focus:border-red-600"
      : "border-gray-300 focus:border-purple-04";
    let bg = disabled ? "bg-gray-03 cursor-not-allowed opacity-60" : "bg-white";
    return `${base} ${border} ${bg}`;
  };

  const getLabelStyle = () => "block mb-1 font-medium text-gray-08";

  const getErrorStyle = () => "mt-1 text-sm text-red-500";

  return { getInputStyle, getLabelStyle, getErrorStyle };
};

export default useInput;
