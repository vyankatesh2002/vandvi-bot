import React from 'react';
import { Conversation, AITool, User } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { AI_TOOLS } from '../constants';
import { WandIcon } from './icons/WandIcon';
import { SidebarCloseIcon } from './icons/SidebarCloseIcon';
import { SidebarOpenIcon } from './icons/SidebarOpenIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ImageIcon } from './icons/ImageIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, title: string) => void;
  onOpenFounderModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenProfileModal: () => void;
  onSelectTool: (tool: AITool) => void;
  onLogout: () => void;
  user: User | null;
  activeView: 'chat' | 'imageStudio';
  onSetView: (view: 'chat' | 'imageStudio') => void;
}

const AIToolItem: React.FC<{ tool: AITool, isCollapsed: boolean, onSelect: (tool: AITool) => void }> = ({ tool, isCollapsed, onSelect }) => (
    <button 
        onClick={() => onSelect(tool)}
        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-white"
        title={isCollapsed ? `${tool.name} by ${tool.author}` : undefined}
    >
        <div className="p-1 bg-zinc-700 rounded-full flex-shrink-0">
            <WandIcon className="w-4 h-4" />
        </div>
        {!isCollapsed && (
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{tool.name}</p>
                <p className="text-xs text-zinc-500 truncate">{tool.description}</p>
            </div>
        )}
    </button>
);


export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onOpenFounderModal,
  onOpenSettingsModal,
  onOpenProfileModal,
  onSelectTool,
  onLogout,
  user,
  activeView,
  onSetView,
}) => {
  return (
    <aside className={`fixed top-0 left-0 h-full bg-zinc-900 flex flex-col text-white transition-all duration-300 ease-in-out z-30 ${isOpen ? 'w-80' : 'w-20'}`}>
        <div className="h-full flex flex-col">
            {/* Header: New Chat and Toggle */}
            <div className="flex-shrink-0 p-2 border-b border-zinc-800">
                {isOpen ? (
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onNewChat}
                            className="flex-1 flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        >
                            <PlusIcon />
                            New Chat
                        </button>
                        <button 
                            onClick={onToggle}
                            className="p-2 rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-white ml-2"
                            aria-label="Collapse sidebar"
                            title="Collapse sidebar"
                        >
                            <SidebarCloseIcon />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                         <button 
                            onClick={onToggle}
                            className="w-full p-2 rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            aria-label="Expand sidebar"
                            title="Expand sidebar"
                        >
                            <SidebarOpenIcon />
                        </button>
                         <button
                            onClick={onNewChat}
                            className="w-full p-2 rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            aria-label="New Chat"
                            title="New Chat"
                        >
                            <PlusIcon />
                        </button>
                    </div>
                )}
            </div>
            
            {/* Scrollable Main Content: Explore and History */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2">
                {/* Explore Tools Section */}
                <div>
                    <div className={`flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 ${isOpen ? 'px-3' : 'justify-center'}`}>
                        <SparklesIcon className="w-4 h-4" />
                        {isOpen && <span>Explore</span>}
                    </div>
                    <div className="space-y-1">
                        <button
                            onClick={() => onSetView('imageStudio')}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeView === 'imageStudio' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                            title={!isOpen ? 'Image Studio' : undefined}
                        >
                            <div className={`p-1.5 rounded-full flex-shrink-0 flex items-center justify-center ${activeView === 'imageStudio' ? 'bg-zinc-600' : 'bg-zinc-700'}`}>
                                <ImageIcon />
                            </div>
                            {isOpen && (
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate">Image Studio</p>
                                    <p className="text-xs text-zinc-500 truncate">Create with AI</p>
                                </div>
                            )}
                        </button>
                        {AI_TOOLS.map(tool => <AIToolItem key={tool.name} tool={tool} isCollapsed={!isOpen} onSelect={onSelectTool} />)}
                    </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-zinc-800" />
                
                {/* Chat History Section */}
                <div>
                    <p className={`text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 sticky top-0 bg-zinc-900 py-1 ${isOpen ? 'px-3' : 'text-center'}`}>
                        {isOpen ? 'History' : 'Chats'}
                    </p>
                    <nav className="space-y-1 pr-1">
                    {conversations.map(convo => (
                        <div key={convo.id} className="group relative" title={!isOpen ? convo.title : undefined}>
                            <button
                                onClick={() => onSelectChat(convo.id)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${!isOpen ? 'justify-center': ''} ${
                                activeConversationId === convo.id && activeView === 'chat'
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
                                <ChatBubbleIcon />
                                {isOpen && <span className="truncate flex-1">{convo.title}</span>}
                            </button>
                            {isOpen && (
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(convo.id, convo.title);
                                    }}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-500 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 hover:text-white transition-opacity"
                                    aria-label={`Delete chat: ${convo.title}`}
                                >
                                    <TrashIcon />
                                </button>
                            )}
                        </div>
                    ))}
                    </nav>
                </div>
            </div>

            {/* Footer: User Profile, Settings, and Founder Info */}
            <div className="flex-shrink-0 border-t border-zinc-800 p-2 space-y-1">
                <button
                    onClick={onOpenFounderModal}
                    title="About The Founder"
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors ${!isOpen ? 'justify-center' : ''}`}
                >
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-zinc-700 text-white">
                        VJ
                    </div>
                    {isOpen && <span className="truncate">About The Founder</span>}
                </button>

                 <div className={`w-full flex items-center gap-1 ${isOpen ? '' : 'flex-col'}`}>
                     <button
                        onClick={onOpenSettingsModal}
                        title="Settings"
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors ${!isOpen ? 'justify-center' : ''}`}
                    >
                        <SettingsIcon/>
                        {isOpen && 'Settings'}
                    </button>
                    <button
                        onClick={onLogout}
                        title="Logout"
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors ${!isOpen ? 'justify-center' : ''}`}
                    >
                        <LogoutIcon />
                        {isOpen && 'Logout'}
                    </button>
                 </div>
                
                 <button
                    onClick={onOpenProfileModal}
                    title="Your Profile"
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors border-t border-zinc-800 mt-1 pt-3 ${!isOpen ? 'justify-center' : ''}`}
                >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="User profile" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <UserCircleIcon/>
                    )}
                    {isOpen && <span className="truncate">{user?.name || 'User'}</span>}
                </button>
            </div>
        </div>
    </aside>
  );
};