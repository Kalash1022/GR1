import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { messagesApi, usersApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { Send, User as UserIcon, ArrowLeft, LoaderCircle, Check, CheckCheck } from 'lucide-react'
import type { Message, User } from '../types'

export default function ChatPage() {
  const { userId } = useParams() // Optional: active conversation partner ID
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  
  const [content, setContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversation list
  const { data: conversations, isLoading: listLoading, refetch: refetchList } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await messagesApi.getConversationList()
      return data as { partner: Pick<User, 'id' | 'name' | 'avatar'>, lastMessage: Message, unreadCount: number }[]
    },
    refetchInterval: 5000 // Poll every 5s for new messages (simple realtime)
  })

  // Fetch active conversation messages
  const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data } = await messagesApi.getConversation(userId)
      // If there are unread messages from this sender, mark them as read
      const hasUnread = data.some((m: Message) => m.senderId === userId && !m.isRead)
      if (hasUnread) {
        await messagesApi.markAsRead(userId)
        refetchList()
      }
      return data as Message[]
    },
    enabled: !!userId,
    refetchInterval: 3000 // Poll active chat more frequently
  })

  // Fetch target user info if starting a new chat
  const { data: targetUser } = useQuery({
    queryKey: ['user-info', userId],
    queryFn: async () => {
      if (!userId) return null
      // We don't have a public GET /users/:id yet, so we try to find it from conversations first
      const existing = conversations?.find(c => c.partner.id === userId)?.partner
      if (existing) return existing
      
      // Fallback: If it's a new chat, we might just show "Người dùng" until they reply.
      // (Ideally backend should provide an endpoint, but this is a workaround).
      return { id: userId, name: 'Đang tải...', avatar: '' }
    },
    enabled: !!userId && !!conversations,
  })

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: () => messagesApi.send({ receiverId: userId!, content }),
    onSuccess: () => {
      setContent('')
      refetchMessages()
      refetchList()
    }
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !userId) return
    sendMutation.mutate()
  }

  return (
    <div className="mx-auto max-w-6xl animate-slide-up h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
      <div className="glass-card flex h-full overflow-hidden rounded-xl">
        
        {/* Sidebar - Conversation List */}
        <div className={`w-full md:w-1/3 border-r border-outline-variant/30 flex flex-col ${userId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-outline-variant/30 bg-surface/50">
            <h2 className="font-bold text-lg text-on-surface">Tin nhắn</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {listLoading ? (
              <div className="flex justify-center py-10">
                <LoaderCircle className="animate-spin text-primary" />
              </div>
            ) : conversations?.length === 0 ? (
              <div className="p-6 text-center text-on-surface-variant text-sm">
                Bạn chưa có cuộc trò chuyện nào.
              </div>
            ) : (
              conversations?.map((conv) => {
                const isActive = conv.partner.id === userId
                const isMe = conv.lastMessage.senderId === currentUser?.id
                return (
                  <button
                    key={conv.partner.id}
                    onClick={() => navigate(`/chat/${conv.partner.id}`)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-outline-variant/10 ${
                      isActive ? 'bg-primary/10' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {conv.partner.avatar ? (
                      <img src={conv.partner.avatar} alt={conv.partner.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary font-bold shrink-0">
                        {conv.partner.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`font-bold truncate ${conv.unreadCount > 0 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {conv.partner.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant shrink-0">
                          {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                          {isMe ? 'Bạn: ' : ''}{conv.lastMessage.content}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-surface/30 ${!userId ? 'hidden md:flex' : 'flex'}`}>
          {!userId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant">
              <UserIcon size={48} className="text-outline mb-4 opacity-50" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-outline-variant/30 flex items-center px-4 gap-3 bg-surface/50">
                <button 
                  onClick={() => navigate('/chat')}
                  className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary"
                >
                  <ArrowLeft size={20} />
                </button>
                {targetUser?.avatar ? (
                  <img src={targetUser.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary font-bold">
                    {targetUser?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-on-surface">{targetUser?.name?.replace('Đang tải...', 'Người dùng')}</span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex justify-center py-10">
                    <LoaderCircle className="animate-spin text-primary" />
                  </div>
                ) : (
                  messages?.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                            isMe 
                              ? 'bg-primary text-on-primary rounded-br-sm' 
                              : 'bg-surface-container-high text-on-surface rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-on-surface-variant">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            msg.isRead ? <CheckCheck size={12} className="text-primary" /> : <Check size={12} className="text-on-surface-variant" />
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-surface/50 border-t border-outline-variant/30">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 input-field rounded-full px-5 py-2.5"
                    disabled={sendMutation.isPending}
                  />
                  <button
                    type="submit"
                    disabled={!content.trim() || sendMutation.isPending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {sendMutation.isPending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
