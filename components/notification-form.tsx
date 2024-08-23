"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums } from "@prisma/client";
import { Plus } from "lucide-react";
import {
  ControllerRenderProps,
  UseControllerReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/client";
import { Skeleton } from "./ui/skeleton";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";

const FormSchema = z.object({
  type: z.nativeEnum($Enums.NotificationType),
  releaseNumber: z.string().optional(),
  comeFromPersonId: z.number().optional(),
});

export function NotificationCreateForm() {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();

  const create = api.notifications.create.useMutation({
    onSuccess: () => {
      console.log("okokok");
      toast.success("Notification created");
    },
    onError: (error) => {
      alert(error.message);
    },
    onSettled: async () => {
      await utils.notifications.invalidate();
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      releaseNumber: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    create.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create notification</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Notification</DialogTitle>
          <DialogDescription>
            Make changes to your notification here. Click create when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="type"
                render={renderFormItemNotificationType}
              />
              {form.watch("type") === $Enums.NotificationType.PlatformUpdate ? (
                <FormField
                  control={form.control}
                  name="releaseNumber"
                  render={renderFormItemReleaseNumber}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="comeFromPersonId"
                  render={({ field }) => <FormItemPersonSelect {...field} />}
                />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function renderFormItemNotificationType({
  field: { value, onChange },
}: UseControllerReturn<z.infer<typeof FormSchema>, "type">) {
  return (
    <FormItem className="grid grid-cols-4 items-center gap-4">
      <FormLabel className="text-right">Type</FormLabel>
      <Select value={value} onValueChange={onChange}>
        <FormControl>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a notification type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value={$Enums.NotificationType.AccessGranted}>
            Access Granted
          </SelectItem>
          <SelectItem value={$Enums.NotificationType.CommentTag}>
            Comment Tag
          </SelectItem>
          <SelectItem value={$Enums.NotificationType.JoinWorkspace}>
            Join Workspace
          </SelectItem>
          <SelectItem value={$Enums.NotificationType.PlatformUpdate}>
            Platform Update
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

function renderFormItemReleaseNumber({
  field,
}: UseControllerReturn<z.infer<typeof FormSchema>, "releaseNumber">) {
  return (
    <FormItem className="grid grid-cols-4 items-center gap-4">
      <FormLabel className="text-right">Release number</FormLabel>
      <FormControl>
        <Input placeholder="release number" className="col-span-3" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

function FormItemPersonSelect({
  value,
  onChange,
}: ControllerRenderProps<z.infer<typeof FormSchema>, "comeFromPersonId">) {
  const people = api.people.getMany.useQuery();

  function onChangeValue(value: string) {
    onChange(parseInt(value, 10));
  }

  return (
    <FormItem className="grid grid-cols-4 items-center gap-x-4">
      <FormLabel className="text-right">Person</FormLabel>
      <Select value={value?.toString()} onValueChange={onChangeValue}>
        <FormControl>
          <SelectTrigger className="col-span-3" disabled={people.isLoading}>
            {people.isLoading ? (
              <Skeleton className="w-full h-2" />
            ) : (
              <SelectValue placeholder="Select a person" />
            )}
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {people.data?.data.map((p) => (
            <SelectItem value={p.id.toString()} key={p.id.toString()}>
              {p.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage className="col-span-4 text-right" />
    </FormItem>
  );
}
