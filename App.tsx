import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Chat } from '@google/genai';
import { GoogleGenAI, Type } from '@google/genai';
import { ChatMessage, MessageAuthor, Conversation, AITool, User, Mood } from './types';
import { VANDVIK_SYSTEM_PROMPT, INITIAL_SUGGESTION_CHIPS } from './constants';
import { VandvikVisual } from './components/VandvikVisual';
import { Message } from './components/Message';
import { SuggestionChip } from './components/SuggestionChip';
import { SendIcon } from './components/icons/SendIcon';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';
import { VolumeUpIcon } from './components/icons/VolumeUpIcon';
import { VolumeOffIcon } from './components/icons/VolumeOffIcon';
import { FounderStoryModal } from './components/FounderStoryModal';
import { SettingsModal } from './components/SettingsModal';
import { Sidebar } from './components/Sidebar';
import { AIToolModal } from './components/AIToolModal';
import { ConfirmModal } from './components/ConfirmModal';
import { CameraIcon } from './components/icons/CameraIcon';
import { CameraOffIcon } from './components/icons/CameraOffIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import { CameraView } from './components/CameraView';
import { Login } from './components/Login';
import { ProfileModal } from './components/ProfileModal';
import { ImageStudio } from './components/ImageStudio';
import { AboutVandvikModal } from './components/AboutVandvikModal';
import { MenuIcon } from './components/icons/MenuIcon';
import { CloseIcon } from './components/icons/CloseIcon';

// Web Speech API interface for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

// =========================================================================
// SECURITY WARNING: API Key Exposure
// ... (rest of the warning remains the same)
// =========================================================================
const API_KEY = process.env.API_KEY;

interface UserSettings {
    voiceURI: string | undefined;
    rate: number;
    soundEnabled: boolean;
}

type ActiveView = 'chat' | 'imageStudio';

const App: React.FC = () => {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [synthesisSupported, setSynthesisSupported] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [suggestionChips, setSuggestionChips] = useState<string[]>(INITIAL_SUGGESTION_CHIPS);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [userMood, setUserMood] = useState<Mood>('neutral');
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);
  const [isAboutVandvikModalOpen, setIsAboutVandvikModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);


  const chatRef = useRef<Chat | null>(null);
  const genAiRef = useRef<GoogleGenAI | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevIsLoadingRef = useRef<boolean>(false);

  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId);
  }, [conversations, activeConversationId]);
  
  const isModalOpen = isFounderModalOpen || isAboutVandvikModalOpen || isSettingsModalOpen || isProfileModalOpen || isToolModalOpen || !!chatToDelete;

  // Check for logged-in user on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('vandvik-user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, isLoading]);

  // Track previous loading state to trigger speech correctly
  useEffect(() => {
    prevIsLoadingRef.current = isLoading;
  });

  // Setup APIs on initial load
  useEffect(() => {
    const initializeApis = () => {
      try {
        if (!API_KEY) {
          setError("API key is missing. Please set it in your environment variables.");
          return;
        }
        const ai = new GoogleGenAI({apiKey: API_KEY});
        genAiRef.current = ai;

        // Speech Recognition (Input)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          setSpeechSupported(true);
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');
            setInput(transcript);
          };
          recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setError(`Speech recognition error: ${event.error}`);
            if (isRecording) setIsRecording(false);
          };
          recognition.onend = () => setIsRecording(false);
          recognitionRef.current = recognition;
        } else {
          console.warn("Speech Recognition not supported.");
        }

        // Speech Synthesis (Output)
        if ('speechSynthesis' in window) {
          setSynthesisSupported(true);
          const populateVoiceList = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) return;
            setAvailableVoices(voices);

            const savedSettingsRaw = localStorage.getItem('vandvik-settings');
            let savedSettings: Partial<UserSettings> = {};
            if (savedSettingsRaw) {
              try {
                savedSettings = JSON.parse(savedSettingsRaw);
              } catch (e) {
                console.error("Failed to parse settings, using defaults.", e);
              }
            }

            setSpeechRate(savedSettings.rate || 1);
            setIsSoundEnabled(savedSettings.soundEnabled !== false); // Default to true

            const voice = voices.find(v => v.voiceURI === savedSettings.voiceURI);
            if(voice) {
              setSelectedVoice(voice);
              return;
            }
            
            const preferredVoiceNames = ["Google US English", "Samantha", "Microsoft Zira Desktop - English (United States)"];
            let selected = voices.find(voice => preferredVoiceNames.includes(voice.name)) ||
                           voices.find(voice => voice.lang.startsWith('en-US') && voice.name.toLowerCase().includes('female')) ||
                           voices.find(voice => voice.lang.startsWith('en-US')) ||
                           voices[0];
            setSelectedVoice(selected);
          };
          populateVoiceList();
          if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
          }
        } else {
          console.warn("Speech Synthesis not supported.");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to initialize APIs. Please check your configuration.");
      }
    };
    initializeApis();
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    const settings: UserSettings = {
      voiceURI: selectedVoice?.voiceURI,
      rate: speechRate,
      soundEnabled: isSoundEnabled
    };
    localStorage.setItem('vandvik-settings', JSON.stringify(settings));
  }, [selectedVoice, speechRate, isSoundEnabled]);


  // Load conversations from localStorage on initial load (only if logged in)
  useEffect(() => {
    if (!isLoggedIn) return;
    try {
      const savedConversationsRaw = localStorage.getItem('vandvik-conversations');
      if (savedConversationsRaw) {
        const savedConversations: Conversation[] = JSON.parse(savedConversationsRaw);
        if (savedConversations.length > 0) {
          setConversations(savedConversations);
          setActiveConversationId(savedConversations[0].id); // Select the most recent chat
          setIsInitializing(false);
          return;
        }
      }
      // If no saved conversations, start a new one
      handleNewChat();
    } catch (e) {
      console.error("Failed to load conversations from localStorage", e);
      handleNewChat(); // Start fresh if there's an error
    } finally {
      setIsInitializing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  
  // Re-initialize chatRef when active conversation changes
  useEffect(() => {
    if (!activeConversation || !genAiRef.current) return;
  
    const history = activeConversation.messages
      .filter(msg => msg.text) // Filter out empty placeholder messages
      .map(msg => ({
        role: msg.author === MessageAuthor.USER ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
  
    // Remove the initial Vandvik greeting from history for the API
    if (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }
  
    const newChat = genAiRef.current.chats.create({
      model: 'gemini-2.5-flash',
      config: { 
        systemInstruction: VANDVIK_SYSTEM_PROMPT,
        thinkingConfig: { thinkingBudget: 0 } // Optimize for faster response
      },
      history: history,
    });
    chatRef.current = newChat;
  
  }, [activeConversation]);


  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (!isInitializing && conversations.length > 0 && isLoggedIn) {
      localStorage.setItem('vandvik-conversations', JSON.stringify(conversations));
    }
  }, [conversations, isInitializing, isLoggedIn]);

  // Speak Vandvik's latest message
  useEffect(() => {
    if (prevIsLoadingRef.current && !isLoading && isSpeechEnabled && synthesisSupported && activeConversation) {
      const lastMessage = activeConversation.messages[activeConversation.messages.length - 1];
      if (lastMessage?.author === MessageAuthor.VANDVIK && lastMessage.text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMessage.text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = speechRate;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isLoading, activeConversation, isSpeechEnabled, synthesisSupported, selectedVoice, speechRate]);

  // Simulate mood detection when camera is on
  useEffect(() => {
    let moodInterval: ReturnType<typeof setInterval> | undefined;

    if (isCameraEnabled) {
      const moods: Mood[] = ['happy', 'sad', 'surprised', 'neutral'];
      moodInterval = setInterval(() => {
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setUserMood(randomMood);
      }, 5000); // Change mood every 5 seconds
    }

    return () => {
      if (moodInterval) {
        clearInterval(moodInterval);
      }
    };
  }, [isCameraEnabled]);

  // Hide suggestion chips when scrolling up in chat history
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      // We're at the bottom if we're within a 30px threshold
      const atBottom = scrollHeight - scrollTop - clientHeight < 30;
      setIsScrolledToBottom(atBottom);
    };

    chatContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
    };
  }, []); // Run only once on mount
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('vandvik-user', JSON.stringify(user));
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('vandvik-user');
    localStorage.removeItem('vandvik-conversations');
    setConversations([]);
    setActiveConversationId(null);
    setIsInitializing(true); // Re-trigger initialization state for next login
  };

  const handleAvatarChange = (avatarBase64: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, avatar: avatarBase64 };
    setCurrentUser(updatedUser);
    localStorage.setItem('vandvik-user', JSON.stringify(updatedUser));
  };

  const updateConversation = (convoId: string, updateFn: (conversation: Conversation) => Conversation) => {
    setConversations(prev => prev.map(c => c.id === convoId ? updateFn(c) : c));
  };
  
  const handleNewChat = () => {
    setActiveView('chat');
    cancelSpeech();
    const newConversation: Conversation = {
      id: `convo-${Date.now()}`,
      title: 'New Chat',
      messages: [{
        author: MessageAuthor.VANDVIK,
        text: "Hello! I'm Vandvik, your personal holographic companion. How can I help you today? 😊"
      }]
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setInput('');
    setError(null);
    setSuggestionChips(INITIAL_SUGGESTION_CHIPS);
  };
  
  const handleSelectChat = (id: string) => {
    setActiveView('chat');
    setActiveConversationId(id);
  };

  const handleOpenDeleteConfirmation = (id: string, title: string) => {
    setChatToDelete({ id, title });
  };

  const handleConfirmDelete = () => {
    if (!chatToDelete) return;
    
    const convoId = chatToDelete.id;
    const deletedIndex = conversations.findIndex(c => c.id === convoId);
    const newConversations = conversations.filter(c => c.id !== convoId);
    
    setConversations(newConversations);
    
    if (activeConversationId === convoId) {
      if (newConversations.length > 0) {
        // Set new active chat to the one before, or the first one.
        const newIndex = Math.max(0, deletedIndex - 1);
        setActiveConversationId(newConversations[newIndex].id);
      } else {
        handleNewChat();
      }
    }
    
    setChatToDelete(null);
  };


  const cancelSpeech = () => {
    if (synthesisSupported) window.speechSynthesis.cancel();
  };

  const getDynamicSuggestions = async (lastMessage: string) => {
    if (!genAiRef.current) return;
    try {
      const prompt = `Based on this statement: "${lastMessage}", generate 3 short, relevant, and engaging follow-up suggestions for a user to continue the conversation. Include an emoji in each suggestion.`;
      const result = await genAiRef.current.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['suggestions']
          }
        }
      });
      const responseJson = JSON.parse(result.text);
      if (responseJson.suggestions && responseJson.suggestions.length > 0) {
        setSuggestionChips(responseJson.suggestions);
      }
    } catch (e) {
      console.error("Failed to get dynamic suggestions:", e);
      setSuggestionChips(INITIAL_SUGGESTION_CHIPS);
    }
  };

  const generateTitle = async (convoId: string, firstMessage: string) => {
    if (!genAiRef.current) return;
    try {
      const prompt = `Generate a very short, concise title (3-5 words) for a conversation that starts with this message: "${firstMessage}"`;
      const result = await genAiRef.current.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const title = result.text.trim().replace(/"/g, ''); // Clean up quotes
      if (title) {
        updateConversation(convoId, convo => ({ ...convo, title }));
      }
    } catch(e) {
      console.error("Failed to generate title:", e);
      // Fallback already handled in sendMessage
    }
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading || !activeConversationId) return;
    cancelSpeech();
    if (isRecording) recognitionRef.current?.stop();

    setIsLoading(true);
    setError(null);
    setSuggestionChips([]);

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: prompt };
    
    // Create a placeholder for Vandvik's response
    updateConversation(activeConversationId, convo => ({
      ...convo,
      messages: [...convo.messages, userMessage, { author: MessageAuthor.VANDVIK, text: "" }]
    }));
    
    // Set title for new chats
    const isNewChat = activeConversation?.messages.length === 1; // 1 because greeting is pre-filled
    if (isNewChat) {
      // Set a temporary title first
      updateConversation(activeConversationId, convo => ({ ...convo, title: prompt.substring(0, 40) }));
      // Then generate a better one in the background
      generateTitle(activeConversationId, prompt);
    }

    setInput('');

    if (!chatRef.current) {
      setError("Chat is not initialized.");
      setIsLoading(false);
      return;
    }

    try {
      const moodContext = isCameraEnabled ? `[System Note: The user's current detected mood is ${userMood}.] ` : '';
      const stream = await chatRef.current.sendMessageStream({ message: moodContext + prompt });
      
      let finalResponse = "";
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        finalResponse += chunkText;
        updateConversation(activeConversationId, convo => {
            const newMessages = [...convo.messages];
            newMessages[newMessages.length - 1].text = finalResponse;
            return { ...convo, messages: newMessages };
        });
      }
      await getDynamicSuggestions(finalResponse);
    } catch (e) {
      console.error(e);
      setError("An error occurred while communicating with the AI. Please try again.");
      // Remove the user's message and the failed AI response
      updateConversation(activeConversationId, convo => ({
        ...convo,
        messages: convo.messages.slice(0, -2)
      }));
      setInput(prompt);
      setSuggestionChips(INITIAL_SUGGESTION_CHIPS);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cancelSpeech();
    setInput(e.target.value);
    if(error) setError(null);
  }

  const handleSend = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    sendMessage(input);
  };
  
  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    cancelSpeech();
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  
  const handleVoiceChange = (voiceURI: string) => {
    const voice = availableVoices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
  };

  const handleToolClick = (tool: AITool) => {
    setSelectedTool(tool);
    setIsToolModalOpen(true);
  };

  const handleToggleCamera = () => {
    setIsCameraEnabled(prev => !prev);
  };

  if (isAuthLoading || (isLoggedIn && isInitializing)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <VandvikVisual isThinking={true} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} isSoundEnabled={isSoundEnabled} />;
  }

  return (
    <>
      <style>{`
        .suggestion-chips::-webkit-scrollbar {
            display: none;
        }
        .suggestion-chips {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      <div className="relative h-screen bg-black text-white font-sans antialiased overflow-hidden flex">
        <Sidebar
          isOpen={isSidebarOpen}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleOpenDeleteConfirmation}
          onOpenFounderModal={() => setIsFounderModalOpen(true)}
          onOpenAboutVandvikModal={() => setIsAboutVandvikModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onSelectTool={handleToolClick}
          onLogout={handleLogout}
          user={currentUser}
          activeView={activeView}
          onSetView={setActiveView}
        />
        
        <main className={`relative flex flex-col h-full flex-1 overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[var(--sidebar-open-width)]' : 'ml-[var(--sidebar-closed-width)]'}`}>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              disabled={isModalOpen}
              className="absolute top-4 left-4 z-20 p-2 rounded-full text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            
            {activeView === 'chat' ? (
              <>
                <button
                  onClick={handleNewChat}
                  className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-zinc-800 hover:bg-zinc-700 transition-colors shadow-lg"
                  aria-label="Start a new chat"
                >
                  <PlusIcon />
                  New Chat
                </button>
                
                {/* SCROLLING CHAT AREA */}
                <div ref={chatContainerRef} className="flex-1 w-full overflow-y-auto scroll-smooth pt-20">
                  <div className="w-full max-w-4xl mx-auto px-4">
                    {!activeConversation || activeConversation.messages.length <= 1 ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <VandvikVisual isThinking={false} />
                        <h1 className="text-4xl font-bold mt-6 text-white">What's on the agenda today?</h1>
                      </div>
                    ) : (
                      <div className="space-y-4 pb-4">
                        {activeConversation.messages.map((msg, index) => (
                          <Message 
                            key={index} 
                            message={msg}
                            isStreaming={isLoading && index === activeConversation.messages.length - 1} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* FIXED INPUT AREA */}
                <div className="w-full shrink-0 bg-gradient-to-t from-black via-black to-transparent">
                  <div className="w-full max-w-4xl mx-auto px-4 pb-4">
                      <div className={`
                        transition-all duration-300 ease-in-out
                        ${(isScrolledToBottom && !isLoading && suggestionChips.length > 0) ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 invisible'}
                      `}>
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 suggestion-chips">
                          {suggestionChips.map(chip => (
                            <SuggestionChip key={chip} text={chip} onClick={sendMessage} disabled={isLoading || !!error} />
                          ))}
                        </div>
                      </div>

                      {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}
                    
                      <form onSubmit={handleSend} className="relative flex items-center">
                        <input type="text" value={input} onChange={handleInputChange} placeholder="Ask Vandvik anything..." disabled={isLoading || !!error} className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-3 pl-5 pr-48 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200 disabled:opacity-50" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                            {speechSupported && <button type="button" onClick={handleMicClick} disabled={isLoading || !!error} className={`rounded-full p-2.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-300 hover:bg-zinc-700'}`} aria-label={isRecording ? 'Stop recording' : 'Start recording'}><MicrophoneIcon /></button>}
                            <button type="button" onClick={handleToggleCamera} disabled={isLoading || !!error} className={`rounded-full p-2.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed ${isCameraEnabled ? 'text-cyan-400 hover:bg-zinc-700' : 'text-zinc-300 hover:bg-zinc-700'}`} aria-label={isCameraEnabled ? 'Disable camera' : 'Enable camera'}>{isCameraEnabled ? <CameraIcon /> : <CameraOffIcon />}</button>
                            {synthesisSupported && <button type="button" onClick={() => { if(isSpeechEnabled) cancelSpeech(); setIsSpeechEnabled(p => !p); }} className={`rounded-full p-2.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-white disabled:opacity-50 ${isSpeechEnabled ? 'text-zinc-300 hover:bg-zinc-700' : 'text-zinc-600'}`} aria-label={isSpeechEnabled ? 'Disable voice output' : 'Enable voice output'}>{isSpeechEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}</button>}
                            <button type="submit" disabled={!input.trim() || isLoading || !!error} className="rounded-full p-2.5 bg-zinc-600 text-white hover:bg-zinc-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">
                                <SendIcon />
                            </button>
                        </div>
                      </form>
                  </div>
                </div>
              </>
            ) : (
              <ImageStudio genAi={genAiRef.current} />
            )}
        </main>
      </div>

      {isCameraEnabled && <CameraView onClose={handleToggleCamera} mood={userMood} />}

      <FounderStoryModal isOpen={isFounderModalOpen} onClose={() => setIsFounderModalOpen(false)} />
      <AboutVandvikModal isOpen={isAboutVandvikModalOpen} onClose={() => setIsAboutVandvikModalOpen(false)} />

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onAvatarChange={handleAvatarChange}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        voices={availableVoices}
        selectedVoiceURI={selectedVoice?.voiceURI}
        onVoiceChange={handleVoiceChange}
        speechRate={speechRate}
        onRateChange={handleRateChange}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(prev => !prev)}
      />
      <AIToolModal 
        isOpen={isToolModalOpen}
        onClose={() => setIsToolModalOpen(false)}
        tool={selectedTool}
      />
      <ConfirmModal 
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Chat"
        message={
          <>
            Are you sure you want to delete the chat
            <br />
            <strong className="text-white break-all">"{chatToDelete?.title}"</strong>?
            <br />
            This action cannot be undone.
          </>
        }
      />
    </>
  );
};

export default App;