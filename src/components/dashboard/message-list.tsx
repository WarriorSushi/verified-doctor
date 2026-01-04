"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Phone, Mail, Clock, Check, Copy, Trash2, Pin, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  sender_name: string;
  sender_phone: string;
  sender_email?: string | null;
  message_content: string;
  is_read: boolean | null;
  reply_content: string | null;
  reply_sent_at: string | null;
  created_at: string | null;
  is_admin_message?: boolean | null;
  is_pinned?: boolean | null;
  admin_sender_name?: string | null;
}

interface MessageListProps {
  messages: Message[];
  profileId: string;
}

export function MessageList({ messages: initialMessages, profileId }: MessageListProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleOpenMessage = async (message: Message) => {
    setSelectedMessage(message);

    // Mark as read if unread
    if (!message.is_read) {
      await fetch(`/api/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
    }
  };

  const markAsReplied = async () => {
    if (!selectedMessage) return;

    try {
      await fetch(`/api/messages/${selectedMessage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replied: true }),
      });

      // Update local state
      setSelectedMessage({
        ...selectedMessage,
        reply_sent_at: new Date().toISOString(),
      });

      // Update messages list
      setMessages(messages.map(m =>
        m.id === selectedMessage.id
          ? { ...m, reply_sent_at: new Date().toISOString() }
          : m
      ));

      toast.success("Marked as replied");
    } catch (error) {
      console.error("Mark replied error:", error);
      toast.error("Failed to mark as replied");
    }
  };

  const handleDeleteMessage = async (messageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setMessages(messages.filter((m) => m.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        toast.success("Message deleted");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No messages yet</h3>
        <p className="text-slate-500 mt-1">
          When patients send inquiries through your profile, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {messages.map((message) => {
          const isAdminMessage = message.is_admin_message;

          return (
            <div
              key={message.id}
              className={`relative group ${isAdminMessage ? "bg-gradient-to-r from-rose-50 to-pink-50" : ""}`}
            >
              <button
                onClick={() => handleOpenMessage(message)}
                className="w-full p-4 text-left hover:bg-slate-50/50 transition-colors flex items-start gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isAdminMessage
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                      : message.is_read
                      ? "bg-slate-100 text-slate-600"
                      : "bg-[#0099F7] text-white"
                  }`}
                >
                  {isAdminMessage ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    message.sender_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`font-semibold ${isAdminMessage ? "text-rose-700" : "text-slate-900"}`}>
                      {message.sender_name}
                    </span>
                    {message.is_pinned && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 rounded flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                    {isAdminMessage && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-rose-500 text-white rounded">
                        Admin
                      </span>
                    )}
                    {!message.is_read && !isAdminMessage && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-[#0099F7] text-white rounded">
                        New
                      </span>
                    )}
                    {message.reply_sent_at && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Replied
                      </span>
                    )}
                  </div>
                  <p className={`text-sm line-clamp-2 ${isAdminMessage ? "text-rose-600" : "text-slate-600"}`}>
                    {message.message_content}
                  </p>
                  {message.created_at && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Delete button - visible on mobile, hover on desktop */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete message?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the message from your inbox. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e: React.MouseEvent) => handleDeleteMessage(message.id, e)}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </div>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <DialogTitle>Message from {selectedMessage?.sender_name}</DialogTitle>
            </div>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              {/* Sender Info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-mono">
                  {selectedMessage.sender_phone}
                </span>
              </div>

              {/* Message */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {selectedMessage.message_content}
                </p>
                {selectedMessage.created_at && (
                  <p className="text-xs text-slate-400 mt-2">
                    {formatDistanceToNow(new Date(selectedMessage.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                )}
              </div>

              {/* Contact Options - Copy to respond privately */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700">Respond privately</h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => copyToClipboard(selectedMessage.sender_phone, "Phone number")}
                  >
                    <Phone className="w-4 h-4 mr-3 text-slate-500" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{selectedMessage.sender_phone}</div>
                      <div className="text-xs text-slate-500">Click to copy phone</div>
                    </div>
                    <Copy className="w-4 h-4 text-slate-400" />
                  </Button>

                  {selectedMessage.sender_email && (
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-3"
                      onClick={() => copyToClipboard(selectedMessage.sender_email!, "Email")}
                    >
                      <Mail className="w-4 h-4 mr-3 text-slate-500" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{selectedMessage.sender_email}</div>
                        <div className="text-xs text-slate-500">Click to copy email</div>
                      </div>
                      <Copy className="w-4 h-4 text-slate-400" />
                    </Button>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Copy the contact details and respond via your preferred method (phone call, WhatsApp, email, etc.)
                </p>

                {/* Mark as replied status */}
                {selectedMessage.reply_sent_at ? (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-700">
                      Marked as replied{" "}
                      {formatDistanceToNow(new Date(selectedMessage.reply_sent_at), { addSuffix: true })}
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={markAsReplied}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Replied
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
