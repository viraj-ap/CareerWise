import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Interview } from "@/types";
import { CustomBreadCrumb } from "./CustomBreakCrumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./Headings";
import { Loader, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Props {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

const FormMockInterview = ({ initialData }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const userId = useAuth();

  const title = initialData?.position
    ? initialData?.position
    : "Create a new Mock Interview";

  const breadCrumbPage = initialData?.position
    ? initialData?.position
    : "Create Mock Interview";

  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? {
        title: "Interview updated",
        description: "Your interview has been updated successfully.",
      }
    : {
        title: "Interview created",
        description: "Your interview has been created successfully.",
      };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: Number(initialData.experience),
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumbPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />
      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md "
        >
          {/* role */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- describle your job role"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* experience */}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* tech stack */}
          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormMockInterview;
