"use client";

import { $Enums, Person } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Bell, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { NotificationCreateForm } from "~/components/notification-form";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/client";

const typeColors: Record<$Enums.NotificationType, string> = {
  [$Enums.NotificationType.PlatformUpdate]: "text-blue-500",
  [$Enums.NotificationType.CommentTag]: "text-green-500",
  [$Enums.NotificationType.AccessGranted]: "text-yellow-500",
  [$Enums.NotificationType.JoinWorkspace]: "text-purple-500",
};

const typeLabels: Record<$Enums.NotificationType, string> = {
  [$Enums.NotificationType.PlatformUpdate]: "Platform update",
  [$Enums.NotificationType.CommentTag]: "Comment Tag",
  [$Enums.NotificationType.AccessGranted]: "Access granted",
  [$Enums.NotificationType.JoinWorkspace]: "Join workspace",
};

export function NotificationPanel() {
  const notification = api.notifications.getMany.useQuery();

  if (notification.isLoading || notification.data === undefined) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  const unreadCount = notification.data.data.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <NotificationCreateForm />
        </div>
        <ScrollArea className="h-[300px]">
          {notification.isFetching && <LoadingBar />}
          {notification.data.data.map((n) => (
            <NotificationItem key={n.id.toString()} {...n} />
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NotificationProps {
  id: number;
  read: boolean;
  type: $Enums.NotificationType;
  comeFrom: Person | null;
}

function NotificationItem({ read, type, comeFrom, id }: NotificationProps) {
  const queryClient = useQueryClient();
  const queryKey = getQueryKey(api.notifications.getMany, undefined, "query");

  const markAsRead = api.notifications.markAsRead.useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const snapshot = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (notification: any) => {
        return {
          ...notification,
          data: notification.data.map((n: any) => {
            if (n.id === id) {
              return { ...n, read: true };
            }
            return { ...n };
          }),
        };
      });

      return () => {
        queryClient.setQueryData(queryKey, snapshot);
      };
    },
    onError: (error, variables, rollback) => {
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey });
    },
  });

  function onMardAsRead() {
    if (read) {
      return;
    }
    markAsRead.mutate(id);
  }

  return (
    <ActionWrapper type={type}>
      <div
        className={`flex items-start space-x-4 p-4 border border-border  ${
          read ? "bg-background" : "bg-muted"
        } hover:bg-accent cursor-pointer transition-colors duration-200`}
        onClick={onMardAsRead}
      >
        <div className="flex-shrink-0">
          {comeFrom ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={comeFrom.avatarUrl} alt="User avatar" />
              <AvatarFallback>{comeFrom.displayName[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-9 w-9 rounded-full flex items-center justify-center bg-blue-500">
              <RefreshCw className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <p className={`text-xs font-medium ${typeColors[type]}`}>
            {typeLabels[type]}
          </p>
          <p
            className={`text-sm ${
              read ? "text-muted-foreground" : "font-medium"
            }`}
          >
            {renderNotificationContent(type, comeFrom)}
          </p>
        </div>
      </div>
    </ActionWrapper>
  );
}

function ActionWrapper({
  children,
  type,
}: {
  children: ReactNode;
  type: $Enums.NotificationType;
}) {
  if (type === $Enums.NotificationType.PlatformUpdate) {
    return <div onClick={() => alert("1.2.3")}>{children}</div>;
  }

  if (type === $Enums.NotificationType.CommentTag) {
    return <Link href="/comments">{children}</Link>;
  }

  if (type === $Enums.NotificationType.AccessGranted) {
    return <Link href="/chats">{children}</Link>;
  }

  if (type === $Enums.NotificationType.JoinWorkspace) {
    return <Link href="/workspace">{children}</Link>;
  }

  return children;
}

function renderNotificationContent(
  type: $Enums.NotificationType,
  comeFome: Person | null
) {
  if (type === $Enums.NotificationType.PlatformUpdate) {
    return "New features - see what’s new";
  }

  if (type === $Enums.NotificationType.CommentTag) {
    return `${comeFome?.displayName} tagged you in a comment`;
  }

  if (type === $Enums.NotificationType.AccessGranted) {
    return `${comeFome?.displayName} shared a chat with you`;
  }

  if (type === $Enums.NotificationType.JoinWorkspace) {
    return `${comeFome?.displayName} joined your workspace`;
  }

  return "Ops! new type of notification.";
}

function LoadingBar() {
  return (
    <div className="h-0.5 w-full bg-primary absolute inset-x-0 top-0">
      <div className="animate-progress w-full h-full bg-secondary origin-left-right"></div>
    </div>
  );
}
