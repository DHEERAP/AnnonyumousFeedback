


"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { messageSchema } from "@/schemas/messageSchema";
import { ModeToggle } from "@/components/ThemeIcon";
import { ApiResponse } from "@/types/ApiResponse";
import z from "zod"

type SendMessageForm = z.infer<typeof messageSchema>;

export default function ProfilePage() {
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const { toast } = useToast();
  const params = useParams();
  const username = params.username as string;

  const messageForm = useForm<SendMessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const handleSendMessage = async (data: SendMessageForm) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username, // Changed from userName to username to match backend
        content: data.content,
      });

      if (response.data.success) {
        toast({ title: "Success", description: "Message sent successfully!" });
        messageForm.reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };


  const fetchSuggestions = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResponses([]);

    try {
      const response = await fetch(
        `/api/suggest-messages?topic=${encodeURIComponent(topic)}`
      );
      
      if (!response.body) throw new Error("No response body");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        result += decoder.decode(value, { stream: true });
        
        // Handle streaming data
        const parts = result.split("||");
        result = parts.pop() || "";
        
        for (const part of parts) {
          if (part.trim()) {
            setResponses(prev => [...prev, part.trim()]);
          }
        }
      }

      // Process any remaining data
      if (result.trim()) {
        setResponses(prev => [...prev, result.trim()]);
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    messageForm.setValue("content", suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">
          Send Message to {username}
        </h1>
        <ModeToggle />
      </div>

      {/* Message Form */}
      <FormProvider {...messageForm}>
        <form onSubmit={messageForm.handleSubmit(handleSendMessage)} className="space-y-4">
          <FormField
            control={messageForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Message</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Write your message here..."
                    disabled={messageForm.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={messageForm.formState.isSubmitting}
            className="w-full"
          >
            {messageForm.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </FormProvider>

      {/* Suggestions Section */}
      <div className="mt-8 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter topic for suggestions"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button
            onClick={fetchSuggestions}
            disabled={loading}
            className="min-w-[150px]"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Get Suggestions"
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {responses.map((response, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left h-auto py-2 whitespace-normal"
              onClick={() => handleSuggestionClick(response)}
            >
              {response}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}


