"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Phone, Clock, Check, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  sender_name: string;
  sender_phone: string;
  message_content: string;
  is_read: boolean;
  reply_content: string | null;
  reply_sent_at: string | null;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  profileId: string;
}

export function MessageList({ messages, profileId }: MessageListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleOpenMessage = async (message: Message) => {
    setSelectedMessage(message);
    setReplyContent("");

    // Mark as read if unread
    if (!message.is_read) {
      await fetch(`/api/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setIsSending(true);
    try {
      await fetch(`/api/messages/${selectedMessage.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyContent }),
      });

      // Update local state
      setSelectedMessage({
        ...selectedMessage,
        reply_content: replyContent,
        reply_sent_at: new Date().toISOString(),
      });
      setReplyContent("");
    } catch (error) {
      console.error("Reply error:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No messages yet</h3>
        <p className="text-slate-500 mt-1">
          When patients send inquiries through your profile, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {messages.map((message) => (
          <button
            key={message.id}
            onClick={() => handleOpenMessage(message)}
            className="w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-start gap-4"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.is_read
                  ? "bg-slate-100 text-slate-600"
                  : "bg-[#0099F7] text-white"
              }`}
            >
              {message.sender_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-900">
                  {message.sender_name}
                </span>
                {!message.is_read && (
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
              <p className="text-slate-600 text-sm line-clamp-2">
                {message.message_content}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.sender_name}</DialogTitle>
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
                <p className="text-xs text-slate-400 mt-2">
                  {formatDistanceToNow(new Date(selectedMessage.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {/* Reply Section */}
              {selectedMessage.reply_sent_at ? (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-2">
                    <Check className="w-4 h-4" />
                    Reply sent{" "}
                    {formatDistanceToNow(
                      new Date(selectedMessage.reply_sent_at),
                      { addSuffix: true }
                    )}
                  </div>
                  <p className="text-slate-700">
                    {selectedMessage.reply_content}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {replyContent.length}/500 characters
                    </span>
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyContent.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply via SMS
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Reply will be sent to {selectedMessage.sender_phone} via SMS
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
