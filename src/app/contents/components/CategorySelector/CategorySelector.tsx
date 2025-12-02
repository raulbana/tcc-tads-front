"use client";
import React, { useEffect, useState, useMemo } from "react";
import { ContentCategory } from "@/app/types/content";
import contentServices from "../../services/contentServices";
import { useAuth } from "@/app/contexts/AuthContext";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  error?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoriesChange,
  error,
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await contentServices.getCategories();
        setCategories(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const userRole = user?.role?.toUpperCase();
    const isUser = !userRole || userRole === "USER";

    if (isUser) {
      return categories.filter((category) => !category.auditable);
    }

    return categories;
  }, [categories, user?.role]);

  const toggleCategory = (category: ContentCategory) => {
    const categoryName = category.name;
    const isSelected = selectedCategories.includes(categoryName);

    if (isSelected) {
      onCategoriesChange(
        selectedCategories.filter((c) => c !== categoryName)
      );
    } else {
      onCategoriesChange([...selectedCategories, categoryName]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Categorias
        </label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        Categorias
        <span className="text-red-500"> *</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {filteredCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.name);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                isSelected
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CategorySelector;
