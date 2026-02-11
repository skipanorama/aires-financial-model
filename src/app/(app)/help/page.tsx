'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Calculator,
  Waves,
  Building2,
  ShoppingBag,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  Save,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  ArrowRight,
  Layers,
  Users,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [activeGuide, setActiveGuide] = useState('overview')

  const faqs: FAQItem[] = [
    {
      question: 'How are treatment capacities calculated?',
      answer: 'Treatment capacity = beds x floor(operatingMinutes / treatmentCycle), where treatmentCycle = treatmentDuration + cleaningTime. The stagger interval determines how frequently new treatments can begin. This gives you the maximum number of treatments possible per day.'
    },
    {
      question: 'How does the thermal capacity calculation work?',
      answer: 'Thermal capacity = floor(maxCapacity x (operatingHours / sessionDuration)). This represents the total number of guest sessions possible in a day, considering how many guests can be accommodated simultaneously and how many sessions fit in the operating hours.'
    },
    {
      question: 'What is tiered rent and how is it calculated?',
      answer: 'Tiered rent uses a progressive calculation similar to income tax brackets. Each tier applies its percentage only to the revenue that falls within that tier range. For example, if Tier 1 is 8% on revenue up to $1M and Tier 2 is 10% on revenue from $1M to $2M, then $1.5M in revenue would pay 8% on the first $1M plus 10% on the remaining $500K.'
    },
    {
      question: 'How is retail revenue calculated?',
      answer: 'Retail revenue is calculated as a percentage of combined treatment and thermal revenue. The formula is: retailRevenue = (treatmentRevenue + thermalRevenue) x (retailPercentage / 100). This percentage represents the expected retail attachment rate.'
    },
    {
      question: 'What does the combo discount mean?',
      answer: 'The combo discount applies when guests purchase both a treatment and thermal access. The discount amount is subtracted from the thermal price for those guests. The combo percentage on each day determines what fraction of thermal guests receive this discount.'
    },
    {
      question: 'How are labor costs calculated?',
      answer: 'Labor costs are calculated per role: (dailyStaffCount x hoursPerShift x hourlyRate) for each day. The weekly total sums all seven days. Each role (attendants, receptionists, supervisors) has its own daily staffing schedule and hourly rate.'
    },
    {
      question: 'Can I save and compare different scenarios?',
      answer: 'Yes! Use the Scenarios page to save your current model configuration with a name and description. You can save multiple scenarios, load them to compare different assumptions, export them as JSON files, and import previously saved scenarios.'
    },
    {
      question: 'How do I export data to Excel?',
      answer: 'Go to the Reports page and click either "Revenue Report" or "Financial Report" to download a comprehensive Excel file. The revenue report focuses on revenue analysis, while the financial report includes costs, profit analysis, and complete model configuration.'
    }
  ]

  const guides = [
    {
      id: 'overview',
      title: 'Getting Started',
      icon: <BookOpen className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            The Aires Financial Model is a comprehensive spa financial simulation tool that helps you model revenue, 
            costs, and profitability for spa operations. It provides real-time calculations as you adjust inputs.
          </p>
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Quick Start Guide
            </h4>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">1.</span>
                <span>Start with the <strong>Dashboard</strong> to see your current financial overview</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">2.</span>
                <span>Configure <strong>Revenue</strong> settings - treatment capacity, pricing, and utilization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">3.</span>
                <span>Set up <strong>Costs</strong> - fixed costs, variable costs, and labor scheduling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">4.</span>
                <span>Save <strong>Scenarios</strong> to compare different assumptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">5.</span>
                <span>Generate <strong>Reports</strong> and export to Excel for presentations</span>
              </li>
            </ol>
          </div>
          <p className="text-sm text-gray-500">
            All changes are automatically saved to your browser. You can export your data at any time from the Settings page.
          </p>
        </div>
      )
    },
    {
      id: 'revenue',
      title: 'Revenue Configuration',
      icon: <TrendingUp className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Revenue is modeled across three streams: treatments, thermal/wellness, and retail. Each can be configured independently with day-by-day granularity.
          </p>
          
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Waves className="w-4 h-4 text-blue-600" /> Treatment Revenue
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Capacity Settings:</strong> Beds, operating hours, treatment duration, cleaning time, stagger interval</li>
                <li><strong>Guest Mix:</strong> Hotel vs non-hotel guest percentage split</li>
                <li><strong>Daily Config:</strong> Utilization rate, hotel price, and non-hotel price for each day of the week</li>
                <li><strong>Formula:</strong> dailyRevenue = capacity x utilization x (hotelMix x hotelPrice + nonHotelMix x nonHotelPrice)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-purple-600" /> Thermal Revenue
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Capacity Settings:</strong> Max concurrent guests, operating hours, session duration</li>
                <li><strong>Combo Discounts:</strong> Discounts for guests who also book treatments</li>
                <li><strong>Daily Config:</strong> Utilization, prices, and combo percentages per day</li>
                <li><strong>Formula:</strong> Includes combo discount adjustments for combined treatment+thermal guests</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" /> Retail Revenue
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Revenue Percentage:</strong> Retail sales as a percentage of treatment + thermal revenue</li>
                <li><strong>Formula:</strong> retailRevenue = (treatmentRevenue + thermalRevenue) x percentage / 100</li>
                <li><strong>Presets:</strong> Quick-set buttons for common retail attachment rates</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'costs',
      title: 'Cost Management',
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Costs are organized into three categories: fixed costs, variable costs, and labor costs. Each is calculated and tracked separately for detailed analysis.
          </p>

          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Fixed Costs</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Tiered Rent:</strong> Progressive rent based on annual revenue brackets (add/remove tiers as needed)</li>
                <li><strong>Management Salary:</strong> Annual salary divided by 52 weeks</li>
                <li><strong>Overhead:</strong> Weekly fixed overhead costs (utilities, insurance, etc.)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Variable Costs</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Back Bar:</strong> Product cost per treatment performed</li>
                <li><strong>Amenities:</strong> Per-guest cost for thermal/wellness visitors</li>
                <li><strong>Treatment Labor:</strong> Direct labor cost per treatment (e.g., therapist pay)</li>
                <li><strong>Retail COGS:</strong> Cost of goods sold as a percentage of retail revenue</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Labor Costs</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Attendants:</strong> Daily staff count + hourly rate (day-by-day scheduling)</li>
                <li><strong>Receptionists:</strong> Daily staff count + hourly rate</li>
                <li><strong>Supervisors:</strong> Daily staff count + hourly rate</li>
                <li><strong>Formula:</strong> dailyCost = staffCount x hoursPerShift x hourlyRate</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'scenarios',
      title: 'Scenario Management',
      icon: <Layers className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Scenarios allow you to save, compare, and manage different financial model configurations. This is useful for testing various assumptions and presenting options.
          </p>

          <div className="bg-indigo-50 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Key Features</h4>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li className="flex items-start gap-2">
                <Save className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Save:</strong> Capture your current model state with a name and description</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Load:</strong> Restore a previously saved scenario to the active model</span>
              </li>
              <li className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Export/Import:</strong> Share scenarios as JSON files between users or devices</span>
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <strong>Tip:</strong> Save a &ldquo;baseline&rdquo; scenario before making significant changes so you can always revert back. Use descriptive names like &ldquo;High Season Projection&rdquo; or &ldquo;Conservative Estimate&rdquo;.
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      title: 'Reports & Export',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            The Reports page provides detailed financial analysis and multiple export options for sharing and presentations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-700 mb-2">Revenue Excel Report</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Executive summary</li>
                <li>Daily revenue analysis</li>
                <li>Treatment configuration</li>
                <li>Thermal configuration</li>
                <li>Retail configuration</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-700 mb-2">Financial Excel Report</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Executive P&amp;L summary</li>
                <li>Detailed cost breakdown</li>
                <li>Tiered rent structure</li>
                <li>Daily financial breakdown</li>
                <li>Complete model configuration</li>
                <li>Utilization and pricing</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <strong>Print:</strong> The browser print option formats all visible report sections for clean printed output. Use Expand All to include all sections, or selectively expand only the ones you need.
          </div>
        </div>
      )
    },
    {
      id: 'formulas',
      title: 'Key Formulas',
      icon: <Calculator className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Reference for the core calculation formulas used throughout the model.
          </p>

          <div className="space-y-3">
            <FormulaCard
              title="Treatment Capacity"
              formula="beds x floor(operatingMinutes / (treatmentDuration + cleaningTime))"
              example="9 beds x floor(735 / 75) = 9 x 9 = 81 treatments/day"
            />
            <FormulaCard
              title="Thermal Capacity"
              formula="floor(maxCapacity x (operatingHours / sessionDuration))"
              example="floor(25 x (10 / 3)) = floor(83.3) = 83 visits/day"
            />
            <FormulaCard
              title="Treatment Revenue (per day)"
              formula="capacity x utilization x (hotelMix x hotelPrice + nonHotelMix x nonHotelPrice)"
              example="81 x 0.80 x (0.50 x $160 + 0.50 x $160) = $10,368"
            />
            <FormulaCard
              title="Tiered Rent"
              formula="Sum of: min(revenueInTier, tierRange) x tierPercentage for each tier"
              example="Progressive: 8% on first $1M + 10% on next $1M + 12% on remainder"
            />
            <FormulaCard
              title="Profit Margin"
              formula="(totalRevenue - totalCosts) / totalRevenue x 100"
              example="($50,000 - $35,000) / $50,000 x 100 = 30%"
            />
          </div>
        </div>
      )
    }
  ]

  const activeGuideData = guides.find(g => g.id === activeGuide)

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Help & Documentation</h2>
        <p className="text-sm text-gray-500 mt-1">Learn how to use the Aires Financial Model effectively</p>
      </div>

      {/* Guide Navigation + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Guide Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-2 sticky top-4">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              User Guide
            </div>
            <nav className="space-y-0.5">
              {guides.map(guide => (
                <button
                  key={guide.id}
                  onClick={() => setActiveGuide(guide.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                    activeGuide === guide.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={activeGuide === guide.id ? 'text-primary-600' : 'text-gray-400'}>
                    {guide.icon}
                  </span>
                  {guide.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Guide Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {activeGuideData && (
              <>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                    {activeGuideData.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{activeGuideData.title}</h3>
                </div>
                {activeGuideData.content}
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Frequently Asked Questions</h3>
              <p className="text-sm text-gray-500">Common questions about the financial model</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-medium text-gray-900 text-sm pr-4">{faq.question}</span>
                <span className="text-gray-400 flex-shrink-0">
                  {expandedFAQ === index ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              </button>
              {expandedFAQ === index && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed bg-gray-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts / Tips */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Tips & Best Practices</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TipCard
            icon={<Target className="w-4 h-4 text-blue-600" />}
            title="Start Conservative"
            description="Begin with lower utilization rates and increase gradually. It is easier to show upside potential than explain missed targets."
          />
          <TipCard
            icon={<Clock className="w-4 h-4 text-purple-600" />}
            title="Weekday vs Weekend"
            description="Set different pricing and utilization for weekdays vs weekends. Most spas see higher traffic on Friday through Sunday."
          />
          <TipCard
            icon={<Users className="w-4 h-4 text-green-600" />}
            title="Guest Mix Matters"
            description="Hotel guest percentage significantly impacts revenue. Hotel guests often have different willingness to pay than walk-in guests."
          />
          <TipCard
            icon={<Save className="w-4 h-4 text-amber-600" />}
            title="Save Often"
            description="Create scenario snapshots before major changes. Name them descriptively so you can easily compare later."
          />
        </div>
      </div>
    </div>
  )
}

function FormulaCard({ title, formula, example }: { title: string; formula: string; example: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 text-sm mb-2">{title}</h4>
      <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-xs mb-2 overflow-x-auto">
        {formula}
      </div>
      <div className="text-xs text-gray-500">
        <strong>Example:</strong> {example}
      </div>
    </div>
  )
}

function TipCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <div className="font-medium text-gray-900 text-sm">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
    </div>
  )
}
