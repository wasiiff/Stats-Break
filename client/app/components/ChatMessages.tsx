"use client";
import { BarChart3, User, Bot, TrendingUp, Activity } from "lucide-react";
import { Message } from "../@types/types";

export interface ChatMessagesProps {
  history: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  formatCellValue: (value: unknown) => string;
}

export default function ChatMessages({
  history,
  isLoading,
  messagesEndRef,
  formatCellValue,
}: ChatMessagesProps) {
  const renderMessage = (m: Message, i: number) => {
    if (
      m.role === "user" &&
      typeof m.payload === "object" &&
      m.payload.type === "text"
    ) {
      return (
        <div key={i} className="flex justify-end mb-6 group">
          <div className="relative max-w-xs lg:max-w-2xl">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-4 rounded-3xl rounded-br-lg shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium leading-relaxed">
                  {m.payload.text}
                </p>
              </div>
            </div>
            {/* Message tail */}
            <div className="absolute -bottom-2 -right-1 w-4 h-4 bg-indigo-700 transform rotate-45 rounded-sm"></div>
          </div>
        </div>
      );
    }

    // Enhanced Assistant text reply
    if (
      m.role === "assistant" &&
      typeof m.payload === "object" &&
      m.payload.type === "text"
    ) {
      return (
        <div key={i} className="flex justify-start mb-6 group">
          <div className="relative max-w-xs lg:max-w-2xl">
            <div className="bg-white text-gray-800 px-6 py-4 rounded-3xl rounded-bl-lg shadow-xl border border-gray-100 group-hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm leading-relaxed">{m.payload.text}</p>
              </div>
            </div>
            {/* Message tail */}
            <div className="absolute -bottom-2 -left-1 w-4 h-4 bg-white border-l border-b border-gray-100 transform rotate-45 rounded-sm"></div>
          </div>
        </div>
      );
    }

    // Enhanced Assistant table reply
    if (
      m.role === "assistant" &&
      typeof m.payload === "object" &&
      m.payload.type === "table"
    ) {
      const filteredColumns = m.payload.columns.filter(
        (c) =>
          c &&
          c.toLowerCase() !== "_id" &&
          !c.toLowerCase().startsWith("unnamed")
      );

      const columnIndexes = m.payload.columns
        .map((c, index) =>
          c &&
          c.toLowerCase() !== "_id" &&
          !c.toLowerCase().startsWith("unnamed")
            ? index
            : null
        )
        .filter((i) => i !== null) as number[];

      const filteredRows = m.payload.rows.map((row) =>
        columnIndexes.map((i) => row[i])
      );

      return (
        <div key={i} className="flex justify-start mb-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-full overflow-hidden group hover:shadow-3xl transition-shadow duration-500">
            {m.payload.text && (
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {m.payload.text}
                  </p>
                  <div className="flex-1"></div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            )}

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded-b-3xl">
  <table className="min-w-full text-sm">

                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50">
                    {filteredColumns.map((c, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-200"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group/row`}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-medium group-hover/row:text-gray-900 transition-colors duration-200"
                        >
                          {formatCellValue(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-medium">
                  {filteredRows.length} record
                  {filteredRows.length !== 1 ? "s" : ""} displayed
                </p>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    Live Data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative mb-8">
      {/* Container glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-2xl"></div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50">
        <div className="max-h-[70vh] lg:max-h-[75vh] overflow-y-auto p-6 custom-scrollbar flex flex-col">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-full">
                    <BarChart3 className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ready to explore cricket stats!
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    Ask me anything about cricket statistics, player records,
                    team rankings, or live match updates.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Live data
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    AI powered
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    Real insights
                  </span>
                </div>
              </div>
            </div>
          ) : (
            history.map((m, i) => renderMessage(m, i))
          )}

          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="relative max-w-xs">
                <div className="bg-white px-6 py-4 rounded-3xl rounded-bl-lg shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse">
                      <Bot className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium ml-3">
                        Analyzing cricket data...
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -left-1 w-4 h-4 bg-white border-l border-b border-gray-100 transform rotate-45 rounded-sm"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
