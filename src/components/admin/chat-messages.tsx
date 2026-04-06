'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Bot, User, RefreshCw, MessagesSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatSessionWithLastMessage {
  id: string
  sessionId: string
  createdAt: string
  updatedAt: string
  lastMessage: {
    id: string
    role: string
    content: string
    createdAt: string
  } | null
}

interface ChatMessage {
  id: string
  sessionId: string
  role: string
  content: string
  createdAt: string
}

export default function ChatMessages() {
  const [sessions, setSessions] = useState<ChatSessionWithLastMessage[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sessionTitle, setSessionTitle] = useState('')

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chat-sessions')
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoadingSessions(false)
    }
  }, [])

  const fetchMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/admin/chat-sessions/${sessionId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleSelectSession = (session: ChatSessionWithLastMessage) => {
    setSelectedSession(session.sessionId)
    setSessionTitle(session.sessionId.substring(0, 12))
    fetchMessages(session.sessionId)
  }

  if (loadingSessions) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl col-span-2" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={fetchSessions} className="self-start">
        <RefreshCw className="w-4 h-4 ml-2" />
        تحديث المحادثات
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Sessions List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessagesSquare className="w-4 h-4" />
              المحادثات ({sessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-2">
                {sessions.map((session) => (
                  <button
                    key={session.sessionId}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full text-right p-3 rounded-lg transition-colors ${
                      selectedSession === session.sessionId
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-mono truncate" dir="ltr">
                          {session.sessionId.substring(0, 16)}...
                        </p>
                        {session.lastMessage && (
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {session.lastMessage.role === 'user' ? '👤 ' : '🤖 '}
                            {session.lastMessage.content.substring(0, 50)}
                            {session.lastMessage.content.length > 50 ? '...' : ''}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(session.updatedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </button>
                ))}
                {sessions.length === 0 && (
                  <p className="text-center text-gray-400 py-8 text-sm">لا توجد محادثات</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {selectedSession ? `محادثة: ${sessionTitle}...` : 'اختر محادثة'}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-4">
            {selectedSession ? (
              loadingMessages ? (
                <div className="space-y-3 py-8">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className={`h-16 rounded-lg ${i % 2 === 0 ? 'w-3/4 mr-auto' : 'w-2/3 ml-auto'}`} />
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <ScrollArea className="h-[460px]">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {msg.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white rounded-tr-sm'
                              : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-[460px] text-gray-400">
                  <p>لا توجد رسائل في هذه المحادثة</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-[460px] text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>اختر محادثة لعرض الرسائل</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
