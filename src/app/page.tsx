'use client'

import React from 'react'
import Link from 'next/link'
import {
  Waves,
  BarChart3,
  Calculator,
  GitBranch,
  FileText,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  PieChart,
  Activity
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Interactive Dashboard',
    description: 'Real-time KPI cards, revenue trends, cost breakdowns, and profit analysis at a glance.',
  },
  {
    icon: Calculator,
    title: 'Revenue Simulation',
    description: 'Configure treatment, thermal circuit, and retail revenue with per-day granularity.',
  },
  {
    icon: DollarSign,
    title: 'Cost Management',
    description: 'Progressive tiered rent, fixed costs, variable costs, and detailed labor scheduling.',
  },
  {
    icon: GitBranch,
    title: 'Scenario Planning',
    description: 'Save, compare, and switch between multiple financial scenarios instantly.',
  },
  {
    icon: FileText,
    title: 'Professional Reports',
    description: 'Export comprehensive Excel workbooks and print-ready financial reports.',
  },
  {
    icon: PieChart,
    title: 'Visual Analytics',
    description: 'Charts and graphs for revenue mix, cost distribution, and daily performance.',
  },
]

const metrics = [
  { label: 'Revenue Streams', value: '3', icon: TrendingUp },
  { label: 'Cost Categories', value: '10+', icon: Shield },
  { label: 'Daily Granularity', value: '7 days', icon: Zap },
  { label: 'Export Formats', value: '3', icon: Activity },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-xl">Aeris</span>
            <span className="text-blue-200 text-sm ml-1">Financial Model</span>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="btn bg-white text-primary-800 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-all hover:shadow-xl"
        >
          Launch App
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-100 text-sm font-medium">Professional Financial Simulation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Spa & Wellness
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Financial Intelligence
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-blue-200 leading-relaxed mb-10 max-w-2xl mx-auto">
              Model revenue, costs, and profitability for your spa operation with 
              precision. Configure every variable, simulate scenarios, and make 
              data-driven decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-primary-800 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-semibold text-base shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 px-8 py-3.5 rounded-xl font-semibold text-base transition-all"
              >
                View Documentation
              </Link>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
              >
                <metric.icon className="w-5 h-5 text-blue-300 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-blue-300 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Complete Financial Modeling
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Everything you need to model, analyze, and optimize your spa&apos;s financial performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to model your financials?
          </h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            Start configuring your spa revenue model with real-time calculations and visual analytics.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-primary-800 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-950 py-8 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-300" />
            <span className="text-blue-200 text-sm">Aeris Financial Model</span>
          </div>
          <p className="text-blue-400 text-xs">
            © {new Date().getFullYear()} Aeris. Spa & Wellness Financial Simulation.
          </p>
        </div>
      </footer>
    </div>
  )
}
