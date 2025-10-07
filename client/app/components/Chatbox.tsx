"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  useAskQuestionMutation,
  useListConversationsQuery,
  useGetConversationQuery,
} from "../services/chatApi";
import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import StatsCards from "./StatsCard";
import QuickQuestions from "./QuickResponse";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Message } from "../@types/types";
import { MessageCircle, Plus, Clock, Search, Archive, ChevronLeft, ChevronRight } from "lucide-react";

function SafeDate({ iso }: { iso: string }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    if (iso) {
      setDate(new Date(iso).toLocaleDateString());
    }
  }, [iso]);

  return <>{date}</>;
}

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const auth = useSelector((state: any) => state.auth);

  const [askQuestion, { isLoading }] = useAskQuestionMutation();
  const { data: conversations } = useListConversationsQuery(20, {
    skip: !auth.user,
  });
  const { data: currentConversation } = useGetConversationQuery(
    conversationId!,
    {
      skip: !conversationId,
    }
  );

  const filteredConversations =
    conversations?.filter((c: any) =>
      (c.title || c.firstMessage || "Untitled")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (currentConversation?.messages) {
      setHistory(
        currentConversation.messages.map((m: any) =>
          m.role === "assistant" && m.columns?.length
            ? {
                role: "assistant",
                payload: {
                  type: "table",
                  text: m.text,
                  columns: m.columns,
                  rows: m.rows,
                },
              }
            : { role: m.role, payload: { type: "text", text: m.text } }
        )
      );
    }
  }, [currentConversation]);

  const send = async () => {
    if (!question.trim() || isLoading) return;
    const q = question.trim();

    setHistory((h) => [
      ...h,
      { role: "user", payload: { type: "text", text: q } },
    ]);
    setQuestion("");

    try {
      const data = await askQuestion({ question: q, conversationId }).unwrap();

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      setHistory((h) => [...h, { role: "assistant", payload: data }]);
    } catch (err) {
      console.log(err);
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          payload: {
            type: "text",
            text: "Error contacting backend. Please try again.",
          },
        },
      ]);
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setHistory([]);
    setQuestion("");
  };

  const formatCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") {
      return value > 999 ? value.toLocaleString() : value.toString();
    }
    return value.toString();
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white/80 backdrop-blur-sm border-r border-gray-200/50 shadow-2xl transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-72" : "w-0"
        }`}
        style={{ overflow: isSidebarOpen ? "visible" : "hidden" }}
      >
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Conversations
            </h2>
            <button
              onClick={startNewConversation}
              className="group p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              title="New Conversation"
            >
              <Plus className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Archive className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">No conversations found</p>
              <p className="text-xs text-gray-400 mt-1">
                Start a new chat to begin
              </p>
            </div>
          ) : (
            filteredConversations.map((c: any) => {
              const title = c.title || c.firstMessage || "Untitled";
              const isActive = c._id === conversationId;

              return (
                <button
                  key={c._id}
                  onClick={() => setConversationId(c._id)}
                  className={`relative group w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl"
                      : "bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg border border-gray-200/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isActive
                          ? "bg-white/20"
                          : "bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200"
                      } transition-colors duration-200`}
                    >
                      <MessageCircle
                        className={`w-4 h-4 ${
                          isActive ? "text-white" : "text-blue-600"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm truncate ${
                          isActive ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {title.length > 35
                          ? `${title.substring(0, 35)}...`
                          : title}
                      </p>

                      <div className="flex items-center gap-1 mt-1">
                        <Clock
                          className={`w-3 h-3 ${
                            isActive ? "text-white/70" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            isActive ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          <SafeDate iso={c.createdAt || c.updatedAt} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Conversation indicator */}
                  {isActive && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-r-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        style={{
          marginLeft: isSidebarOpen ? "288px" : "0px",
          transition: "margin-left 0.3s ease-in-out",
        }}
        title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto p-4 lg:p-6 flex flex-col flex-1 w-full">
          <ChatHeader />
          <StatsCards />

          {!conversationId && history.length === 0 && (
            <QuickQuestions onSelect={(q) => setQuestion(q)} />
          )}

          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ChatMessages
              history={history}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              formatCellValue={formatCellValue}
            />
          </div>

          <ChatInput
            question={question}
            setQuestion={setQuestion}
            send={send}
            isLoading={isLoading}
          />

          {/* Footer */}
          <div className="text-center mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Powered by Netixsol Pvt Ltd
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Real-time scores
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    Historical records
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    AI insights
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}