import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, LineChart, LayoutDashboard, Blocks, Zap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Secure Authentication",
    description: "Enterprise-grade security built on Node.js. Your data integrity and user trust are our highest priority.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "AI Sentiment Analysis",
    description: "Leverage Python-powered artificial intelligence to analyze news and detect real-time market sentiment.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Dynamic Dashboards",
    description: "Sleek, responsive interfaces crafted with React. Visualize complex financial data through beautiful charts.",
    icon: LayoutDashboard,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Modular Architecture",
    description: "Designed for scale. Easily extend and customize the platform with new tools as your application evolves.",
    icon: Blocks,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Real-time Analytics",
    description: "Process and analyze market trends instantly. Make smarter, data-driven decisions faster than ever.",
    icon: LineChart,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "Seamless Integration",
    description: "Flexible API-first design ensures you can connect with external financial services and third-party tools.",
    icon: Users,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-linear-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(147,51,234,0) 70%)" }} />
             
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">AuraFinance</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
              AuraFinance is a cutting-edge, open-source platform crafted to deliver advanced, AI-powered financial tools and actionable insights.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                At AuraFinance, our mission is to empower individuals and businesses with <strong className="text-slate-900 dark:text-white font-semibold">cutting-edge financial technology solutions</strong>. We believe in democratizing access to powerful tools and insights, enabling smarter financial decisions for everyone.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                We're dedicated to building robust, secure, and user-friendly applications that transform complex financial data into clear, actionable intelligence.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 dark:opacity-40" />
              <div className="relative bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Why Choose Us?</h3>
                <ul className="space-y-4">
                  {[
                    "State-of-the-art AI algorithms for deep market insights",
                    "Interactive and engaging data visualizations",
                    "Top-tier security standards to protect sensitive data",
                    "Modular architecture for effortless extension"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mt-0.5 mr-3">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Unlock Powerful Features</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to build the next generation of financial applications, right out of the box.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to revolutionize your financial applications?</h2>
          <p className="text-xl text-slate-300 mb-10">
            Join the AuraFinance community and start building your vision for the future of finance today.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-shadow">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
