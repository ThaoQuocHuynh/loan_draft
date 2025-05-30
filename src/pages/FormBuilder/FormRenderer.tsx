import React from "react";
import type { FormElement } from "./types/FormTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormRendererProps {
  elements: FormElement[];
  onSubmit?: (data: any) => void;
}

const mockFormElements: FormElement[] = [
  {
    id: "element-1",
    type: "text",
    properties: {
      label: "Full Name",
      required: true,
      name: "fullName",
      placeholder: "Enter your full name",
      width: "full",
      gridPosition: {
        x: 0,
        y: 0,
        w: 12,
        h: 1,
      },
    },
  },
  {
    id: "element-2",
    type: "text",
    properties: {
      label: "Email Address",
      required: true,
      name: "email",
      placeholder: "Enter your email address",
      validationType: "email",
      validationMessage: "Please enter a valid email address",
      width: "full",
      gridPosition: {
        x: 6,
        y: 0,
        w: 12,
        h: 1,
      },
    },
  },
  {
    id: "element-3",
    type: "select",
    properties: {
      label: "Account Type",
      required: true,
      name: "accountType",
      options: ["Personal", "Business", "Enterprise"],
      width: "full",
      gridPosition: {
        x: 0,
        y: 1,
        w: 12,
        h: 1,
      },
    },
  },
  {
    id: "element-4",
    type: "divider",
  },
];

const FormRenderer: React.FC<FormRendererProps> = ({ elements, onSubmit }) => {
  // Create a dynamic schema based on the form elements
  const createFormSchema = (elements: FormElement[]) => {
    const schemaFields: Record<string, any> = {};

    elements.forEach((element) => {
      if (!element.properties?.name) return;

      let fieldSchema: any = z.string();

      if (element.properties.required) {
        fieldSchema = fieldSchema.min(1, { message: "This field is required" });
      }

      if (element.properties.validationType === "email") {
        fieldSchema = fieldSchema.email({ message: "Invalid email address" });
      }

      if (element.type === "number") {
        fieldSchema = z.number();
      }

      schemaFields[element.properties.name] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const formSchema = createFormSchema(elements);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const renderElement = (element: FormElement) => {
    if (
      !element.properties?.name &&
      element.type !== "divider" &&
      element.type !== "label"
    ) {
      return null;
    }

    switch (element.type) {
      case "text":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.properties.name!}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{element.properties.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={element.properties.placeholder}
                    readOnly={element.properties.readonly}
                  />
                </FormControl>
                {element.properties.help && (
                  <FormDescription>{element.properties.help}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "textarea":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.properties.name!}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{element.properties.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={element.properties.placeholder}
                  />
                </FormControl>
                {element.properties.help && (
                  <FormDescription>{element.properties.help}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.properties.name!}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{element.properties.label}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      {field.value || element.properties.placeholder}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {element.properties.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {element.properties.help && (
                  <FormDescription>{element.properties.help}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "radio":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.properties.name!}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{element.properties.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {element.properties.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`${element.id}-${option}`}
                        />
                        <label htmlFor={`${element.id}-${option}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {element.properties.help && (
                  <FormDescription>{element.properties.help}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "number":
        return (
          <FormField
            key={element.id}
            control={form.control}
            name={element.properties.name!}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{element.properties.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={element.properties.placeholder}
                    readOnly={element.properties.readonly}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {element.properties.help && (
                  <FormDescription>{element.properties.help}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "divider":
        return <Separator key={element.id} className="my-4" />;

      case "label":
        return (
          <div key={element.id} className="text-sm text-muted-foreground">
            {element.properties.text}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {elements.map(renderElement)}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

function FormRendererWrapper() {
  return <FormRenderer elements={mockFormElements} />;
}

export default FormRendererWrapper;
