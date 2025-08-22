'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, [rehypePrism, { ignoreMissing: true }]]}
      components={{
        // Custom code block rendering
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          if (!inline && language) {
            return (
              <div className="code-block">
                <div className="code-block-header">
                  <span className="text-neutral-400 text-sm font-medium">
                    {language}
                  </span>
                </div>
                <SyntaxHighlighter
                  language={language}
                  style={tomorrow}
                  className="code-block-content"
                  showLineNumbers
                  wrapLines
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          }
          
          return (
            <code className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-1 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        
        // Custom heading rendering
        h1: ({ children, ...props }) => (
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4 mt-6" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3 mt-5" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2 mt-4" {...props}>
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-2 mt-3" {...props}>
            {children}
          </h4>
        ),
        h5: ({ children, ...props }) => (
          <h5 className="text-base font-semibold text-neutral-800 dark:text-neutral-100 mb-2 mt-3" {...props}>
            {children}
          </h5>
        ),
        h6: ({ children, ...props }) => (
          <h6 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mb-2 mt-3" {...props}>
            {children}
          </h6>
        ),
        
        // Custom paragraph rendering
        p: ({ children, ...props }) => (
          <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed" {...props}>
            {children}
          </p>
        ),
        
        // Custom list rendering
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-neutral-700 dark:text-neutral-300" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-neutral-700 dark:text-neutral-300" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="text-neutral-700 dark:text-neutral-300" {...props}>
            {children}
          </li>
        ),
        
        // Custom blockquote rendering
        blockquote: ({ children, ...props }) => (
          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-neutral-600 dark:text-neutral-400 bg-primary-50 dark:bg-primary-900/20 py-2 rounded-r my-4" {...props}>
            {children}
          </blockquote>
        ),
        
        // Custom link rendering
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline transition-colors duration-200"
            {...props}
          >
            {children}
          </a>
        ),
        
        // Custom table rendering
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-neutral-200 dark:border-neutral-700 rounded-lg" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-neutral-50 dark:bg-neutral-800" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }) => (
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700" {...props}>
            {children}
          </tbody>
        ),
        tr: ({ children, ...props }) => (
          <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200" {...props}>
            {children}
          </tr>
        ),
        th: ({ children, ...props }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700" {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300" {...props}>
            {children}
          </td>
        ),
        
        // Custom horizontal rule rendering
        hr: ({ ...props }) => (
          <hr className="border-neutral-200 dark:border-neutral-700 my-6" {...props} />
        ),
        
        // Custom image rendering
        img: ({ src, alt, ...props }) => (
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded-lg border border-neutral-200 dark:border-neutral-700 my-4"
            {...props}
          />
        ),
        
        // Custom strong rendering
        strong: ({ children, ...props }) => (
          <strong className="font-semibold text-neutral-900 dark:text-white" {...props}>
            {children}
          </strong>
        ),
        
        // Custom emphasis rendering
        em: ({ children, ...props }) => (
          <em className="italic text-neutral-800 dark:text-neutral-200" {...props}>
            {children}
          </em>
        ),
        
        // Custom strikethrough rendering
        del: ({ children, ...props }) => (
          <del className="line-through text-neutral-500 dark:text-neutral-500" {...props}>
            {children}
          </del>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}