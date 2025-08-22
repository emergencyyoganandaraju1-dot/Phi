'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Globe, 
  Brain, 
  Shield, 
  Sparkles,
  MessageCircle,
  Search,
  Code,
  BookOpen,
  Users,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  const [showChat, setShowChat] = useState(false);

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Real-time Web Search",
      description: "Get up-to-date information from the web with automatic citations and sources."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Advanced AI Intelligence",
      description: "Powered by cutting-edge language models for intelligent, contextual responses."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Code Generation",
      description: "Generate, explain, and debug code with syntax highlighting and copy functionality."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Comprehensive Answers",
      description: "Get detailed, well-researched responses with multiple perspectives and sources."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your conversations are private and secure. No data mining or tracking."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Smart Citations",
      description: "Every answer includes proper citations and links to source materials."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "< 2s", label: "Response Time" },
    { number: "24/7", label: "Availability" },
    { number: "∞", label: "Free Usage" }
  ];

  if (showChat) {
    return <ChatInterface />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-base via-white to-primary-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl shadow-2xl mb-6">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">Curie</span>
              <br />
              <span className="text-neutral-800">by PhiAI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-neutral-600 mb-8 leading-relaxed"
            >
              Experience the future of AI conversation. Get intelligent, web-sourced answers 
              with real-time citations and advanced reasoning capabilities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => setShowChat(true)}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
              >
                Start Chatting Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-4 h-4 bg-primary-400 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 w-6 h-6 bg-secondary-400 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-20 w-3 h-3 bg-orange-400 rounded-full opacity-20"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose <span className="gradient-text">Curie</span>?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Built with cutting-edge technology and designed for the modern user experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-hover p-8 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl mb-6 group-hover:from-primary-200 group-hover:to-secondary-200 transition-all duration-300">
                  <div className="text-primary-600 group-hover:text-primary-700 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-neutral-600 mb-8">
              Join thousands of users who are already discovering the power of AI-powered conversations
            </p>
            <button
              onClick={() => setShowChat(true)}
              className="btn-primary text-xl px-10 py-5 flex items-center gap-3 mx-auto group"
            >
              <Zap className="w-6 h-6" />
              Start Your First Chat
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}