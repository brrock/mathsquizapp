// components/admin/question-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/upload-button";
import { X } from "lucide-react";

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  imageUrl: z.string().optional(),
  options: z.array(z.string()).min(2, "At least 2 options are required"),
  answer: z.number().min(0, "Please select the correct answer"),
});

interface QuestionFormProps {
  onSuccess?: () => void;
}

export function QuestionForm({ onSuccess }: QuestionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      imageUrl: "",
      options: ["", ""],
      answer: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create question");
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Image (Optional)</FormLabel>
              <FormControl>
                <ImageUpload 
                  value={field.value} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Options</FormLabel>
          {form.watch("options").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`options.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} placeholder={`Option ${index + 1}`} />
                    </FormControl>
                    {index > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newOptions = [...form.watch("options")];
                          newOptions.splice(index, 1);
                          form.setValue("options", newOptions);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const currentOptions = form.watch("options");
              form.setValue("options", [...currentOptions, ""]);
            }}
          >
            Add Option
          </Button>
        </div>

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer</FormLabel>
              <FormControl>
                <select
                  className="w-full p-2 border rounded-md"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                >
                  {form.watch("options").map((option, index) => (
                    <option key={index} value={index}>
                      Option {index + 1}: {option || '(empty)'}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Question
        </Button>
      </form>
    </Form>
  );
}