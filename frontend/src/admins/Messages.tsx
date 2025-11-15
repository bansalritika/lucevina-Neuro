import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Search, Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "unread" | "read";
}

const initialMessages: Message[] = [
  {
    id: "1",
    name: "Jessica Miller",
    email: "jessica.m@email.com",
    subject: "Product inquiry about Radiant Glow Serum",
    message: "Hi, I'm interested in learning more about the Radiant Glow Serum. Is it suitable for sensitive skin?",
    date: "2024-03-15T10:30:00",
    status: "unread"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@email.com",
    subject: "Shipping question",
    message: "When will my order #1234 be shipped? I ordered it 3 days ago.",
    date: "2024-03-14T15:45:00",
    status: "read"
  },
  {
    id: "3",
    name: "Amanda Davis",
    email: "amanda.d@email.com",
    subject: "Product recommendation needed",
    message: "I have combination skin and I'm looking for a good moisturizer. What would you recommend?",
    date: "2024-03-13T09:20:00",
    status: "read"
  }
];

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("messages");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      localStorage.setItem("messages", JSON.stringify(initialMessages));
      setMessages(initialMessages);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = messages.filter(message => message.id !== id);
    setMessages(updated);
    localStorage.setItem("messages", JSON.stringify(updated));
    toast.success("Message deleted successfully");
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const handleMarkAsRead = (id: string) => {
    const updated = messages.map(msg =>
      msg.id === id ? { ...msg, status: "read" as const } : msg
    );
    setMessages(updated);
    localStorage.setItem("messages", JSON.stringify(updated));
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      handleMarkAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin/blogs")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-serif">Messages</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="default">{unreadCount} unread</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                        selectedMessage?.id === message.id ? "bg-accent" : ""
                      } ${message.status === "unread" ? "border-primary/50" : ""}`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1">
                          {message.status === "unread" ? (
                            <Mail className="h-4 w-4 mt-1 text-primary" />
                          ) : (
                            <MailOpen className="h-4 w-4 mt-1 text-muted-foreground" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-medium truncate ${message.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}>
                                {message.name}
                              </p>
                              {message.status === "unread" && (
                                <Badge variant="secondary" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium truncate">{message.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(message.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Message</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this message? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(message.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Message Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                    <p className="text-lg font-medium">{selectedMessage.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                    <p className="text-sm">{new Date(selectedMessage.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                    <p className="text-lg font-medium">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Message</h3>
                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Select a message to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;