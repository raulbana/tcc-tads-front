import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CommentFormData, commentSchema } from "./schema/commentSchema";

interface UseCommentFormProps {
  onSubmit: (comment: string) => void;
}

const useCommentForm = ({ onSubmit }: UseCommentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
    mode: "onChange",
  });

  const comment = watch("comment");

  const handleFormSubmit = (data: CommentFormData) => {
    onSubmit(data.comment);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(handleFormSubmit)();
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    setValue,
    comment,
    isValid: isValid && comment.trim().length > 0,
    handleKeyDown,
  };
};

export default useCommentForm;