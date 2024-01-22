"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStep,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Textarea } from "./ui/textarea";

type FormData = {
  step: number;
  category: string;
  service: string;
  date: Date;
  hour: string;
  title: string;
  code: string;
  description: string;
  image: any;
  tier: "free" | "gold" | "silver" | "bronze";
};

const catagories = [
  { label: "Electronics & Gadgets", value: "Electronics & Gadgets" },
  { label: "Accessories & parts", value: "Accessories & parts" },
  { label: "Car", value: "Car" },
  { label: "Property", value: "Property" },
  { label: "Tourism", value: "Tourism" },
  { label: "Job", value: "Job" },
] as const;

const firstStepSchema = z.object({
  step: z.literal(1),
  category: z.string({
    required_error: "Please select a language.",
  }),
  tier: z.enum(["free", "gold", "silver", "bronze"], {
    required_error: "Please select a Package",
  }),
});

const secondStepSchema = firstStepSchema.extend({
  step: z.literal(2),
  title: z.string().min(1, "The title must be more then 4 words long"),
  description: z
    .string()
    .min(1, "The description must be more then 100 words long"),
});

const thirdStepSchema = secondStepSchema.extend({
  step: z.literal(3),
});

const fourthStageScheme = secondStepSchema.extend({
  step: z.literal(4),
});

const schema = z.discriminatedUnion("step", [
  firstStepSchema,
  secondStepSchema,
  thirdStepSchema,
  fourthStageScheme,
]);

export const FormExample = () => {
  const maxSteps = 4;

  const form = useForm<FormData>({
    mode: "all",
    shouldFocusError: false,
    resolver: zodResolver(schema),
    defaultValues: {
      step: 1,
    },
  });

  const step = form.watch("step");
  const phoneState = form.watch("title");

  // Watch for changes in the 'image' field
  let imageFile = form.watch("image");
  let imageURL: any = [];

  for (const key in imageFile) {
    if (imageFile.hasOwnProperty(key)) {
      const url = URL.createObjectURL(imageFile[key]);
      imageURL.push(url);
    }
  }

  function onSubmit(values: FormData) {
    toast({
      title: "Form data:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  const removeImage = (index: number) => {
    const newImageFile = [...imageFile];
    newImageFile.splice(index, 1);
    console.log(newImageFile);
    console.log(imageFile);

    form.setValue("image", newImageFile);
  };

  const prevStep = () => {
    if (step > 1) {
      form.setValue("step", step - 1, { shouldValidate: true });
    }
  };

  const nextStep = () => {
    if (step < maxSteps) {
      form.setValue("step", step + 1, { shouldValidate: true });
    }
  };

  return (
    <div className="w-full relative">
      <Form {...form}>
        <form
          className="space-y-10 py-20 px-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormStep step={1} currentStep={step} onPrevStepClick={prevStep}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categories</FormLabel>
                  {form.watch("category") && (
                    <FormDescription className="flex items-center align-middle gap-2 font-medium border border-[#EAEAEA] rounded-[50px] py-2 px-2 max-w-[320px] text-xl mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                      >
                        <circle
                          cx="13"
                          cy="13"
                          r="12"
                          fill="#A6CF98"
                          stroke="#A6CF98"
                          stroke-width="2"
                        />
                        <path
                          d="M6 14L10 18L20 8"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>

                      {form.watch("category")}
                    </FormDescription>
                  )}

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="flex justify-start ">
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? catagories.find(
                                (category) => category.value === field.value
                              )?.label
                            : "Select Categories"}
                          {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                        />
                        <CommandEmpty>No Categories</CommandEmpty>
                        <CommandGroup>
                          {catagories.map((category) => (
                            <CommandItem
                              value={category.label}
                              key={category.value}
                              onSelect={() => {
                                form.setValue("category", category.value);
                              }}
                            >
                              {category.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  category.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className=" font-semibold">
                    Choose package
                  </FormLabel>
                  <FormMessage />
                  {form.watch("category")?.toLowerCase() === "car" && (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4 justify-between flex-wrap pt-2"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="free" className="sr-only" />
                          </FormControl>
                          <div className="justify-end bg-stone-50 flex max-w-[170px] flex-col pl-6 pr-4 py-7 rounded-lg border-2 border-muted items-start hover:border-blue-700">
                            <Image
                              src="/free.png"
                              width={30}
                              height={30}
                              loading="lazy"
                              alt="Product Image"
                            />
                            <header className="text-black text-base font-medium self-stretch">
                              Free
                            </header>
                            <div
                              className="text-neutral-400 text-xs self-stretch"
                              role="description"
                              aria-label="Product Price"
                            >
                              Try free then go for packages
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      {/* <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="gold" className="sr-only" />
                          </FormControl>

                          <div className="justify-end bg-stone-50 flex max-w-[170px] flex-col pl-6 pr-4 py-7 rounded-lg border-2 border-muted items-start hover:border-blue-700">
                            <Image
                              src="/gold.png"
                              width={30}
                              height={30}
                              loading="lazy"
                              alt="Product Image"
                            />
                            <header className="text-black text-base font-medium self-stretch">
                              Gold
                            </header>
                            <div
                              className="text-neutral-400 text-xs self-stretch"
                              role="description"
                              aria-label="Product Price"
                            >
                              Only $50/month; Cheapest
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="silver"
                              className="sr-only"
                            />
                          </FormControl>

                          <div className="justify-end bg-stone-50 flex max-w-[170px] flex-col pl-6 pr-4 py-7 rounded-lg border-2 border-muted items-start hover:border-blue-700">
                            <Image
                              src="/silver.png"
                              width={30}
                              height={30}
                              loading="lazy"
                              alt="Product Image"
                            />
                            <header className="text-black text-base font-medium self-stretch">
                              Silver
                            </header>
                            <div
                              className="text-neutral-400 text-xs self-stretch"
                              role="description"
                              aria-label="Product Price"
                            >
                              Only $29/month; Most used
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="bronze"
                              className="sr-only"
                            />
                          </FormControl>

                          <div className="justify-end bg-stone-50 flex max-w-[170px] flex-col pl-6 pr-4 py-7 rounded-lg border-2 border-muted items-start hover:border-blue-700">
                            <Image
                              src="/bronze.png"
                              width={30}
                              height={30}
                              loading="lazy"
                              alt="Product Image"
                            />
                            <header className="text-black text-base font-medium self-stretch">
                              Bronze
                            </header>
                            <div
                              className="text-neutral-400 text-xs self-stretch"
                              role="description"
                              aria-label="Product Price"
                            >
                              Only $17/month; Most affordable
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem> */}
                    </RadioGroup>
                  )}
                </FormItem>
              )}
            />
          </FormStep>
          {
            // Step 2
            form.watch("tier") === "free" && (
              <FormStep step={2} currentStep={step} onPrevStepClick={prevStep}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Product Title</Label>
                      <FormControl>
                        <Input placeholder="Add a title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Title should be more than 4 words
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Description</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product details like Color: Red, Size: XXL"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Write at least 100 words
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div>
                  <div className="items-stretch bg-yellow-500 bg-opacity-0 flex gap-4 pl-8 pr-6 py-6 rounded-xl border-[1.5px] border-dashed border-yellow-500 max-md:flex-wrap max-md:px-5">
                    <Image
                      alt="Sticky image"
                      width={30}
                      height={30}
                      loading="lazy"
                      src="/paper-clip.png"
                      className="aspect-square object-contain object-center w-6 overflow-hidden self-center shrink-0 max-w-full my-auto"
                    />
                    <div className="text-amber-500 text-sm font-medium self-center grow shrink basis-auto my-auto max-md:max-w-full">
                      <label htmlFor="file-input">
                        Upload Image/ Videos/ Files
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        aria-label="Input file"
                        className="hidden"
                        multiple
                        {...form.register("image")}
                      />
                    </div>
                    <label
                      htmlFor="file-input"
                      className="text-white text-sm font-medium whitespace-nowrap justify-center items-stretch bg-amber-500 px-5 py-2.5 rounded-3xl"
                    >
                      Select
                    </label>
                  </div>
                </div>
                {/* <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
              </FormStep>
            )
          }
          <FormStep step={3} currentStep={step} onPrevStepClick={prevStep}>
            {/* <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
        
                  </FormControl>
                </FormItem>
              )}
            /> */}
            {imageURL.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-10">
                {imageURL.map((url: any, index: number) => (
                  <div key={index} className="relative">
                    <Image
                      width={1200}
                      height={1200}
                      alt=""
                      src={url}
                      className="h-20 w-28 object-cover rounded-md overflow-hidden"
                    />
                    <button
                      type="button"
                      className="absolute -right-2 -top-2"
                      onClick={() => removeImage(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="23"
                        viewBox="0 0 22 23"
                        fill="none"
                      >
                        <g filter="url(#filter0_d_17_4609)">
                          <circle cx="9" cy="8" r="7" fill="black" />
                        </g>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9 16C13.4183 16 17 12.4183 17 8C17 3.58172 13.4183 0 9 0C4.58172 0 1 3.58172 1 8C1 12.4183 4.58172 16 9 16ZM7.70711 5.29289C7.31658 4.90237 6.68342 4.90237 6.29289 5.29289C5.90237 5.68342 5.90237 6.31658 6.29289 6.70711L7.58579 8L6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L9 9.41421L10.2929 10.7071C10.6834 11.0976 11.3166 11.0976 11.7071 10.7071C12.0976 10.3166 12.0976 9.68342 11.7071 9.29289L10.4142 8L11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L9 6.58579L7.70711 5.29289Z"
                          fill="white"
                        />
                        <defs>
                          <filter
                            id="filter0_d_17_4609"
                            x="0"
                            y="1"
                            width="22"
                            height="22"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dx="2" dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_17_4609"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_17_4609"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-start items-start gap-8 my-8">
              <p className="font-bold">
                Category:{" "}
                <span className="font-normal">{form.watch("category")}</span>
              </p>
              <p className="font-bold">
                Package:{" "}
                <span className="font-normal">
                  {form.watch("tier")} Package
                </span>
              </p>
            </div>
            <div className="flex justify-between align-middle items-center bg-slate-50 px-4 py-4 rounded-md">
              <div className="flex align-middle items-center gap-4">
                <Image
                  src="/free.png"
                  width={30}
                  height={30}
                  loading="lazy"
                  alt="Product Image"
                />
                <h3 className="text-black text-base font-medium self-stretch">
                  Free
                </h3>
              </div>
              <p>Free</p>
            </div>
            <div>
              <h2 className="font-bold text-xl ">{form.watch("title")}</h2>
              <div className="text-base  mt-4 font-bold flex gap-4 align-top">
                Description:
                <p className="text-neutral-400">{form.watch("description")}</p>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl ">{form.watch("title")}</h2>
              <div className="text-base  mt-4 font-bold flex gap-4 align-top">
                Location:
                <p className="text-neutral-400">{form.watch("description")}</p>
              </div>
            </div>
          </FormStep>
          <FormStep step={4} currentStep={step} onPrevStepClick={prevStep} />
          <Button
            key={step === maxSteps ? "submit-btn" : "next-step-btn"}
            type={step === maxSteps ? "submit" : "button"}
            className="w-full"
            variant={step === maxSteps ? "default" : "secondary"}
            disabled={!form.formState.isValid}
            onClick={step === maxSteps ? undefined : nextStep}
          >
            {step === maxSteps ? "Submit" : "Next"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
