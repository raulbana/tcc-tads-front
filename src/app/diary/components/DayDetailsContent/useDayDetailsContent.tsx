import moment from "moment";

export const useDayDetailsContent = () => {
  const formatDate = (date: Date) => {
    return moment(date).format("DD [de] MMMM [de] YYYY");
  };

  const getAmountLabel = (amount: string) => {
    const labels = {
      LOW: "Baixo (Até 100ml)",
      MEDIUM: "Médio (100-300ml)",
      HIGH: "Alto (Acima de 300ml)",
    };
    return labels[amount as keyof typeof labels] || amount;
  };

  const getBadgeColor = (level?: string) => {
    switch (level) {
      case "NONE":
        return "bg-green-100 text-green-800";
      case "LOW":
        return "bg-blue-100 text-blue-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelLabel = (level?: string) => {
    const labels = {
      NONE: "Sem vazamento",
      LOW: "Vazamento baixo",
      MEDIUM: "Vazamento médio",
      HIGH: "Vazamento alto"
    };
    return labels[level as keyof typeof labels] || "Sem classificação";
  };

  return {
    formatDate,
    getAmountLabel,
    getBadgeColor,
    getLevelLabel,
  };
};