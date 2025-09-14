
import React from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { UserIcon } from './icons/UserIcon';
import { TypingIndicator } from './TypingIndicator';

interface MessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

const AuthorIcon: React.FC<{ author: MessageAuthor; isStreaming?: boolean }> = ({ author, isStreaming }) => {
  const isVandvik = author === MessageAuthor.VANDVIK;
  return (
    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold relative ${isVandvik ? 'bg-white text-black' : 'bg-zinc-700'}`}>
      {isVandvik && isStreaming && <div className="absolute top-0 left-0 w-full h-full rounded-full bg-cyan-400 animate-ping opacity-75"></div>}
      <div className="relative flex items-center justify-center w-full h-full">
        {isVandvik ? 'V' : <UserIcon />}
      </div>
    </div>
  );
};

// This component will parse and render basic markdown for lists.
const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    let inList = false; // Simplified state
    let paragraphBuffer: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        const key = `list-${elements.length}`;
        // Always render as an ordered (numbered) list
        elements.push(<ol key={key} className="list-decimal list-inside space-y-1 my-2 pl-4">{listItems}</ol>);
        listItems = [];
      }
      inList = false;
    };

    const flushParagraph = () => {
      if (paragraphBuffer.length > 0) {
        // We filter out paragraphs that are only whitespace.
        if (paragraphBuffer.join('').trim()) {
           elements.push(<p key={`p-${elements.length}`} className="whitespace-pre-wrap">{paragraphBuffer.join('\n')}</p>);
        }
        paragraphBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      // Matches lines like: 1. item,  1. item, etc.
      const orderedMatch = line.match(/^\s*\d+\.\s+(.*)/);
      // Matches lines like: * item, - item, etc.
      const unorderedMatch = line.match(/^\s*([*-])\s+(.*)/);
      
      const isListItem = orderedMatch || unorderedMatch;

      if (isListItem) {
        flushParagraph();
        inList = true;
        const textContent = orderedMatch ? orderedMatch[1] : (unorderedMatch ? unorderedMatch[2] : '');
        listItems.push(<li key={index}>{textContent}</li>);
      } else if (line.trim() === '' && inList) {
        // This is a blank line within a list. We'll treat it as a continuation.
        return;
      } else {
        flushList();
        paragraphBuffer.push(line);
      }
    });

    flushParagraph();
    flushList(); // Flush any remaining list or paragraph

    // If after all parsing, there's only one paragraph element, return it directly to avoid extra divs.
    if (elements.length === 1 && (elements[0] as React.ReactElement).type === 'p') {
      return elements[0];
    }
    
    return <>{elements}</>;
};


export const Message: React.FC<MessageProps> = ({ message, isStreaming = false }) => {
  const isVandvik = message.author === MessageAuthor.VANDVIK;
  const wrapperClasses = `flex items-start gap-3 max-w-xl ${isVandvik ? '' : 'ml-auto flex-row-reverse'}`;
  const bubbleClasses = `py-3 px-4 rounded-2xl ${isVandvik ? 'bg-zinc-800 rounded-tl-none' : 'bg-zinc-700 rounded-tr-none'}`;
  
  // If Vandvik is "thinking" but hasn't sent any text yet, show a typing indicator.
  if (isVandvik && !message.text && isStreaming) {
    return (
       <div className={wrapperClasses}>
         <AuthorIcon author={message.author} isStreaming={true} />
         <div className={bubbleClasses}>
           <TypingIndicator />
         </div>
       </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <AuthorIcon author={message.author} isStreaming={isVandvik && isStreaming} />
      <div className={bubbleClasses}>
        {isVandvik && !isStreaming ? (
            <FormattedContent text={message.text} />
        ) : (
            <p className="whitespace-pre-wrap">
              {message.text}
              {isStreaming && <span className="inline-block w-2 h-5 bg-white animate-pulse ml-1 align-bottom" />}
            </p>
        )}
      </div>
    </div>
  );
};
