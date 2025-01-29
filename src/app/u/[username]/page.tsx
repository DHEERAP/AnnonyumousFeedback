// 'use client';

// import React, { useState } from 'react';
// import axios, { AxiosError } from 'axios';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { CardHeader, CardContent, Card } from '@/components/ui/card';
// import { useCompletion } from 'ai/react';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/components/ui/use-toast';
// import * as z from 'zod';
// import { ApiResponse } from '@/types/ApiResponse';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { messageSchema } from '@/schemas/messageSchema';

// const specialChar = '||';

// const parseStringMessages = (messageString: string): string[] => {
//   return messageString.split(specialChar);
// };

// const initialMessageString =
//   "What's your favorite movie?||Do you have any pets?||What's your dream job?";

// export default function SendMessage() {
//   const params = useParams<{ username: string }>();
//   const username = params.username;

//   const {
//     complete,
//     completion,
//     isLoading: isSuggestLoading,
//     error,
//   } = useCompletion({
//     api: '/api/suggest-messages',
//     initialCompletion: initialMessageString,
//   });

//   const form = useForm<z.infer<typeof messageSchema>>({
//     resolver: zodResolver(messageSchema),
//   });

//   const messageContent = form.watch('content');

//   const handleMessageClick = (message: string) => {
//     form.setValue('content', message);
//   };

//   const [isLoading, setIsLoading] = useState(false);



//   const onSubmit = async (data: z.infer<typeof messageSchema>) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post<ApiResponse>('/api/send-message', {
//         ...data,
//         username,
//       });

//       toast({
//         title: response.data.message,
//         variant: 'default',
//       });
//       form.reset({ ...form.getValues(), content: '' });
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: 'Error',
//         description:
//           axiosError.response?.data.message ?? 'Failed to sent message',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSuggestedMessages = async () => {
//     try {
//       complete('');
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       // Handle error appropriately
//     }
//   };

//   return (
//     <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
//       <h1 className="text-4xl font-bold mb-6 text-center">
//         Public Profile Link
//       </h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Send Anonymous Message to @{username}</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Write your anonymous message here"
//                     className="resize-none"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex justify-center">
//             {isLoading ? (
//               <Button disabled>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Please wait
//               </Button>
//             ) : (
//               <Button type="submit" disabled={isLoading || !messageContent}>
//                 Send It
//               </Button>
//             )}
//           </div>
//         </form>
//       </Form>

//       <div className="space-y-4 my-8">
//         <div className="space-y-2">
//           <Button
//             onClick={fetchSuggestedMessages}
//             className="my-4"
//             disabled={isSuggestLoading}
//           >
//             Suggest Messages
//           </Button>
//           <p>Click on any message below to select it.</p>
//         </div>
//         <Card>
//           <CardHeader>
//             <h3 className="text-xl font-semibold">Messages</h3>
//           </CardHeader>
//           <CardContent className="flex flex-col space-y-4">
//             {error ? (
//               <p className="text-red-500">{error.message}</p>
//             ) : (
//               parseStringMessages(completion).map((message, index) => (
//                 <Button
//                   key={index}
//                   variant="outline"
//                   className="mb-2"
//                   onClick={() => handleMessageClick(message)}
//                 >
//                   {message}
//                 </Button>
//               ))
//             )}
//           </CardContent>
//         </Card>
//       </div>
//       <Separator className="my-6" />
//       <div className="text-center">
//         <div className="mb-4">Get Your Message Board</div>
//         <Link href={'/sign-up'}>
//           <Button>Create Your Account</Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

































// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useForm, FormProvider } from "react-hook-form";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { useToast } from "@/components/ui/use-toast";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import { messageSchema } from "@/schemas/messageSchema";
// import  { ModeToggle } from "@/components/ThemeIcon";
// import { ApiResponse } from "@/types/ApiResponse";
// import { AxiosError } from 'axios';


// type SendMessageForm = z.infer<typeof messageSchema>;

// export default function ProfilePage() {
//   const [responses, setResponses] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [topic, setTopic] = useState<string>("");
//   const { toast } = useToast();
//   const router = useRouter();
//   const params = useParams();
//   const { userName } = params;

//   const form = useForm<SendMessageForm>({
//     resolver: zodResolver(messageSchema),
//     defaultValues: {
//       content: "",
//     },
//   });

 

//   const onSubmit = async (data: SendMessageForm) => {
//     try {
//       const response = await axios.post("/api/send-message", {
//         userName,
//         content: data.content,
//       });

//       if (response.data.success) {
//         toast({
//           title: "Success",
//           description: "Message sent successfully!",
//         });
//         form.reset();
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to send the message.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred while sending the message.",
//         variant: "destructive",
//       });
//     }
//   };



//   const fetchStreamingResponse = async () => {
//     setLoading(true);
//     setResponses([]);

//     try {
//       const response = await fetch(`/api/suggest-messages?topic=${encodeURIComponent(topic)}`, { method: "GET" });
//       const reader = response.body?.getReader();
//       const decoder = new TextDecoder();

//       if (reader) {
//         let result = "";
//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           const chunk = decoder.decode(value, { stream: true });
//           result += chunk;
//           const jsonResponse = JSON.parse(result);
//           const message = jsonResponse.message;
//           const splitResponses = message.split("||").map((res: string) => res.trim());
//           for (const res of splitResponses) {
//             if (res) {
//               setResponses((prev) => [...prev, res]);
//               await new Promise((resolve) => setTimeout(resolve, 500));
//             }
//           }
//         }
//       }

//       toast({
//         title: "Success",
//         description: "Responses received successfully!",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch responses.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     form.setValue("content", suggestion);
//   };

//   return (
//     <>
//       <div className="max-w-4xl mx-auto mt-10">
//         <h1 className="text-3xl font-bold text-center text-black">
//           Welcome, send messages to {userName}
//         </h1>

       

//         {/* Write Message Section */}
//         <div className="mt-8">
//           <FormProvider {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <FormField
//                 name="content"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Write a Message</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="Type your message here..."
//                         disabled={form.formState.isSubmitting}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 type="submit"
//                 className="bg-black text-white hover:bg-gray-800 mt-4"
//                 disabled={form.formState.isSubmitting}
//               >
//                 {form.formState.isSubmitting ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   "Send"
//                 )}
//               </Button>
//             </form>


            
//           </FormProvider>
//               {/* Topic Input Section */}
       
//               <FormProvider {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4">
//               <FormField
//                 name="content"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Enter a Topic</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="Type a topic here..."
//                         value={topic}
//                         onChange={(e) => setTopic(e.target.value)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//             </form>
//           </FormProvider>
      
//         </div>

//         {/* Suggested Messages Section */}
//         <div className="mt-8">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">Get AI Suggested Messages</h2>
         
//             <Button
//               onClick={fetchStreamingResponse}
//               className="bg-black text-white hover:bg-gray-800"
//               disabled={loading}
//             >
//               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Get Suggestions"}
//             </Button>
//           </div>
//           <div className="suggestions-container mt-4">
//             {responses.length === 0 && !loading && (
//               <p className="text-gray-500 text-center">No suggestions yet.</p>
//             )}
//             {responses.map((response, index) => (
//               <Button
//                 key={index}
//                 className="mt-2 w-full text-left bg-white text-black border-spacing-1 border-black hover:bg-gray-200"
//                 onClick={() => handleSuggestionClick(response)}
//               >
//                 {response}
//               </Button>
//             ))}
//             <div className="absolute bottom-4 right-4">
//         <ModeToggle/>
//       </div>
//           </div>
//         </div>
//       </div>
      
//     </>
//   );
// }









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


