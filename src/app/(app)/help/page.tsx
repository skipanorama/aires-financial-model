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
  Target,
  Calendar,
  ArrowUpDown,
  Upload,
  Download,
  Printer,
  Info,
  CheckCircle2
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
      answer: 'Treatment capacity = beds × floor(operatingMinutes / treatmentCycle), where treatmentCycle = treatmentDuration + cleaningTime. The stagger interval determines how frequently new treatments can begin. This gives you the maximum number of treatments possible per day.'
    },
    {
      question: 'How does the thermal capacity calculation work?',
      answer: 'Thermal capacity = floor(maxCapacity × (operatingHours / sessionDuration)). This represents the total number of guest sessions possible in a day, considering how many guests can be accommodated simultaneously and how many sessions fit in the operating hours.'
    },
    {
      question: 'What is the "Greater Of" rent structure?',
      answer: 'The lease uses a "greater of" structure: Effective Rent = MAX(Fixed Rent, Percentage Rent). Fixed Rent is the sum of Base Rent + Additional Rent, both subject to CPI escalation. Percentage Rent is calculated using progressive revenue-based tiers. Whichever side produces a higher number becomes the effective rent for that lease year. This protects the landlord while allowing the tenant to benefit from lower rents in slower years.'
    },
    {
      question: 'How does CPI escalation work?',
      answer: 'Both Base Rent and Additional Rent are subject to CPI (Consumer Price Index) compound escalation. By default, the 2% CPI escalation begins in Year 4 of the lease. The formula is: Escalated Amount = Base Amount × (1 + CPI Rate)^(years of escalation). For example, $250,000 base rent with 2% CPI after 3 years of escalation = $250,000 × 1.02³ ≈ $265,302. Years 1-3 have no escalation.'
    },
    {
      question: 'What is the Lease Year slider and how does it work?',
      answer: 'The Lease Year slider (Years 1-25) on the Costs page lets you model different years of the lease term. It controls CPI escalation — before the CPI start year (default Year 4), rents stay at their base amounts. From Year 4 onward, compound CPI is applied. Use this to project future rent costs and see how the "greater of" determination changes over time.'
    },
    {
      question: 'What is Percentage Rent and how are the tiers calculated?',
      answer: 'Percentage Rent uses progressive tiers similar to income tax brackets. Each tier\'s rate applies only to revenue within that bracket. The default tiers are: 0% on revenue up to $4M, 8% on $4M-$4.5M, 9% on $4.5M-$5M, 10% on $5M-$5.5M, 11% on $5.5M-$6M, and 12% on $6M-$10M. Only the portion of revenue in each bracket is multiplied by that bracket\'s rate. The total percentage rent is the sum across all tiers.'
    },
    {
      question: 'What is Additional Rent?',
      answer: 'Additional Rent is an annual amount covering utilities, common area maintenance (CAM), property taxes, insurance, or other operational costs passed through by the landlord. It is combined with Base Rent to form the Fixed Rent component. Both are subject to CPI escalation starting in the configured lease year. The default is $20,000/year.'
    },
    {
      question: 'How is the "Rent Determination" panel read?',
      answer: 'The Rent Determination panel on the Costs page shows three cards side by side: Fixed Rent (with CPI escalation), Percentage Rent (from tiers), and Effective Annual Rent. The winning side (whichever is higher) gets a green border and a "✓ APPLIES" label. The Effective Annual Rent card shows the final annual amount, weekly equivalent, and effective rent rate as a percentage of revenue.'
    },
    {
      question: 'Why do I see annual equivalents on the pages?',
      answer: 'All weekly revenue and cost figures display an annual equivalent (×52 weeks) in smaller text. This helps you quickly assess the full-year impact of any weekly figure without manual calculation, making it easier to compare against annual lease terms, salaries, and budgets.'
    },
    {
      question: 'How is retail revenue calculated?',
      answer: 'Retail revenue is calculated as a percentage of combined treatment and thermal revenue. The formula is: retailRevenue = (treatmentRevenue + thermalRevenue) × (retailPercentage / 100). The default is 12%. This percentage represents the expected retail attachment rate and is distributed evenly across all 7 days.'
    },
    {
      question: 'What does the combo discount mean?',
      answer: 'The combo discount applies when guests purchase both a treatment and thermal access. The discount amount is subtracted from the thermal price for those guests. There are separate discount amounts for hotel vs non-hotel guests. The combo percentage on each day determines what fraction of thermal guests receive this discount.'
    },
    {
      question: 'How are labor costs calculated?',
      answer: 'Labor costs are calculated per role: (dailyStaffCount × hoursPerShift × hourlyRate) for each day. The weekly total sums all seven days. Each role (attendants, receptionists, supervisors) has its own daily staffing schedule, hourly rate, and shift length. You can set fractional staff counts (e.g., 1.5) to model part-time shifts.'
    },
    {
      question: 'Can I add or remove percentage rent tiers?',
      answer: 'Yes! On the Costs page under "Percentage Rent Tiers," click "Add Tier" to add a new bracket. Each tier has editable min revenue, max revenue, and rate percentage fields. Click the trash icon to remove a tier (minimum 1 tier required). Tiers are progressive — each rate applies only to revenue within that bracket.'
    },
    {
      question: 'Can I save and compare different scenarios?',
      answer: 'Yes! Use the Scenarios page to save your current model configuration with a name and description. You can save multiple scenarios, load them to compare different assumptions, export them as JSON files, and import previously saved scenarios. All scenario data includes the full rent configuration, so different lease assumptions are preserved.'
    },
    {
      question: 'How do I export data to Excel?',
      answer: 'Go to the Reports page and click either "Revenue Report" or "Financial Report" to download a comprehensive Excel file. The Revenue Report focuses on revenue analysis with 5 sheets. The Financial Report includes 6 sheets: Executive Summary, Cost Breakdown, Rent Structure (with CPI detail and tier analysis), Daily Financial Breakdown, Model Configuration, and Utilization & Pricing.'
    },
    {
      question: 'What happens to my data if I clear my browser?',
      answer: 'All model data is stored in browser localStorage. Clearing browser data or using incognito mode will reset to defaults. To preserve your work, use the Settings page to export your data as JSON, or save configurations as Scenarios which can also be exported. You can re-import JSON files at any time.'
    },
    {
      question: 'How do I reset to default values?',
      answer: 'Go to the Settings page and click "Reset to Defaults." This will restore all inputs to their default values including the rent configuration ($250K base rent, $20K additional rent, 2% CPI from Year 4, and the default 6-tier percentage rent table). Your saved scenarios will not be affected.'
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
            The Aeris Financial Model is a comprehensive spa financial simulation tool that helps you model revenue,
            costs, and profitability for spa operations. It provides real-time calculations as you adjust inputs,
            with automatic saving to your browser.
          </p>
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Quick Start Guide
            </h4>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">1.</span>
                <span>Start with the <strong>Dashboard</strong> to see your current financial overview with charts and P&L summary</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">2.</span>
                <span>Configure <strong>Revenue</strong> — set treatment capacity, thermal settings, pricing, and utilization for each day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">3.</span>
                <span>Set up <strong>Costs</strong> — configure the lease rent structure (lease year, CPI, tiers), fixed costs, variable costs, and labor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">4.</span>
                <span>Save <strong>Scenarios</strong> to compare different assumptions (e.g., conservative vs optimistic, Year 1 vs Year 5)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[20px]">5.</span>
                <span>Generate <strong>Reports</strong> — view on-screen, print, or export to Excel for presentations</span>
              </li>
            </ol>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> Key Concepts
            </h4>
            <ul className="text-sm text-amber-800 space-y-1.5">
              <li>• All calculations run in <strong>real-time</strong> as you change inputs</li>
              <li>• Revenue and costs are modeled on a <strong>weekly basis</strong> (7 days) with annual equivalents (×52)</li>
              <li>• The rent structure uses a <strong>&quot;Greater Of&quot;</strong> model: Fixed Rent (with CPI escalation) vs Percentage Rent (progressive tiers)</li>
              <li>• Data is auto-saved to <strong>browser localStorage</strong> — export to JSON for backup</li>
            </ul>
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
            Revenue is modeled across three streams: treatments, thermal/wellness, and retail. Each can be configured independently with day-by-day granularity for maximum accuracy.
          </p>
          
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Waves className="w-4 h-4 text-blue-600" /> Treatment Revenue
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Capacity Settings:</strong> Total beds (default: 9), operating hours (12.25h), treatment duration (60 min), cleaning time (15 min), stagger interval (15 min)</li>
                <li><strong>Guest Mix:</strong> Hotel vs non-hotel guest percentage split (default: 50/50)</li>
                <li><strong>Daily Config:</strong> Set utilization rate (%), hotel price, and non-hotel price for each day of the week independently</li>
                <li><strong>Default Pricing:</strong> $160 weekdays, $180 weekends; utilization ranges from 70% (Mon) to 95% (Sat)</li>
                <li><strong>Formula:</strong> dailyRevenue = capacity × utilization × (hotelMix × hotelPrice + nonHotelMix × nonHotelPrice)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-purple-600" /> Thermal Revenue
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Capacity Settings:</strong> Max concurrent guests (25), operating hours (10h), session duration (3h)</li>
                <li><strong>Combo Discounts:</strong> $25 off for guests who also book treatments (hotel and non-hotel separate)</li>
                <li><strong>Daily Config:</strong> Utilization, hotel prices, non-hotel prices, and combo percentages per day</li>
                <li><strong>Default Pricing:</strong> Hotel: $95-$105, Non-Hotel: $125-$135; combo rates 30-45%</li>
                <li><strong>Formula:</strong> Revenue includes combo discount adjustments for combined treatment+thermal guests</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" /> Retail Revenue
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Revenue Percentage:</strong> Retail sales as a percentage of treatment + thermal revenue (default: 12%)</li>
                <li><strong>Formula:</strong> retailRevenue = (treatmentRevenue + thermalRevenue) × percentage / 100</li>
                <li><strong>Distribution:</strong> Retail revenue is split evenly across all 7 days</li>
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
            Costs are organized into three tabs: Fixed Costs (including the full rent structure), Variable Costs, and Labor Costs. Each is calculated and tracked separately for detailed analysis.
          </p>

          <div className="space-y-3">
            <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/30">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" /> Fixed Costs — Rent Structure
              </h4>
              <p className="text-sm text-gray-600 mb-3">The rent section is the most detailed cost component, featuring a &quot;Greater Of&quot; lease structure with CPI escalation.</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-medium text-gray-800 flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-amber-600" /> Lease Year (1-25)
                  </p>
                  <p>Use the slider to set the current lease year. This controls CPI escalation — before the CPI start year, rents stay at base amounts. Model future years to project rent growth.</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-medium text-gray-800 flex items-center gap-1 mb-1">
                    <DollarSign className="w-3 h-3 text-amber-600" /> Base Rent & Additional Rent
                  </p>
                  <p><strong>Base Rent</strong> ($250,000 default) is the primary annual rent. <strong>Additional Rent</strong> ($20,000 default) covers utilities, CAM, insurance, etc. Both are escalated by CPI.</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-medium text-gray-800 flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-amber-600" /> CPI Escalation
                  </p>
                  <p>Compound annual escalation (default: 2%) applied starting in a configured year (default: Year 4). Formula: Escalated = Base × (1 + rate)^years. The preview panel shows current escalated values.</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-medium text-gray-800 flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3 text-amber-600" /> Percentage Rent Tiers
                  </p>
                  <p>Progressive revenue-based tiers (add/remove as needed). Default: 0% up to $4M, 8% on $4M-$4.5M, 9% on $4.5M-$5M, 10% on $5M-$5.5M, 11% on $5.5M-$6M, 12% on $6M-$10M.</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-medium text-gray-800 flex items-center gap-1 mb-1">
                    <ArrowUpDown className="w-3 h-3 text-amber-600" /> Rent Determination (Greater Of)
                  </p>
                  <p>The final panel shows Fixed Rent vs Percentage Rent side by side, with the higher amount marked as &quot;✓ APPLIES.&quot; The effective annual rent, weekly equivalent, and rent-to-revenue ratio are displayed.</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Other Fixed Costs</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Management Salary:</strong> Annual salary divided by 52 weeks (default: $170,000/yr)</li>
                <li><strong>Overhead:</strong> Weekly fixed overhead costs — insurance, POS, internet, phone, music (default: $8,000/wk)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Variable Costs</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Back Bar:</strong> Product cost per treatment performed (default: $15/treatment)</li>
                <li><strong>Amenities:</strong> Per-guest cost for towels, robes, slippers (default: $10/guest)</li>
                <li><strong>Treatment Labor:</strong> Direct labor cost per treatment, e.g., therapist pay (default: $55/treatment)</li>
                <li><strong>Retail COGS:</strong> Cost of goods sold as a percentage of retail revenue (default: 65%)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Labor Costs</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Attendants:</strong> Daily staff count + hourly rate ($20/hr default), day-by-day scheduling. Weekday: 2, Weekend: 4</li>
                <li><strong>Receptionists:</strong> Daily staff count + hourly rate ($23/hr default). Default: 4 per day</li>
                <li><strong>Supervisors:</strong> Daily staff count + hourly rate ($30/hr default). Weekday: 1, Weekend: 1.5</li>
                <li><strong>Shift Length:</strong> Configurable hours per shift (default: 8h)</li>
                <li><strong>Formula:</strong> dailyCost = staffCount × hoursPerShift × hourlyRate</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            The Dashboard provides a comprehensive real-time financial overview with interactive charts and a detailed P&L table.
          </p>

          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Summary Cards</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Top Row (4 cards):</strong> Weekly Revenue, Weekly Costs, Weekly Profit, Profit Margin — each with annual equivalents</li>
                <li><strong>Second Row (3 cards):</strong> Revenue breakdown by Treatment, Thermal, and Retail with weekly and annual values</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Charts</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Revenue Pie Chart:</strong> Treatment vs Thermal vs Retail revenue split</li>
                <li><strong>Cost Pie Chart:</strong> Fixed vs Variable vs Labor cost distribution</li>
                <li><strong>Daily Revenue Bar Chart:</strong> Stacked bars showing daily revenue by stream (Mon-Sun)</li>
                <li><strong>Revenue Trend Line:</strong> Daily total revenue across the week</li>
                <li><strong>Revenue vs Costs Area Chart:</strong> Visual comparison of daily revenue vs costs</li>
                <li><strong>Cost Distribution Pie:</strong> Detailed breakdown of all cost categories</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Financial Summary Table</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>Comprehensive weekly P&L table with daily columns</li>
                <li>Revenue breakdown (Treatment, Thermal, Retail)</li>
                <li>Cost breakdown by category (Rent, Management, Back Bar, Amenities, etc.)</li>
                <li>Net Profit row with color-coded positive/negative indicators</li>
                <li>Capacity utilization table with treatment and thermal counts per day</li>
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
            Scenarios allow you to save, compare, and manage different financial model configurations. This is essential for testing various assumptions, modeling different lease years, and presenting options to stakeholders.
          </p>

          <div className="bg-indigo-50 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Key Features</h4>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li className="flex items-start gap-2">
                <Save className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Save:</strong> Capture your current model state with a name and description. All inputs including the full rent configuration are preserved.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Load:</strong> Restore a previously saved scenario to the active model. This replaces all current inputs.</span>
              </li>
              <li className="flex items-start gap-2">
                <Download className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Export:</strong> Download a scenario as a JSON file to share or back up</span>
              </li>
              <li className="flex items-start gap-2">
                <Upload className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Import:</strong> Load a scenario from a JSON file (from another device or user)</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Scenario Ideas</h4>
            <ul className="text-sm text-amber-800 space-y-1.5">
              <li>• <strong>Year 1 vs Year 5:</strong> Compare rent costs at different lease stages with CPI escalation</li>
              <li>• <strong>Conservative vs Optimistic:</strong> Low utilization/pricing vs high utilization/pricing</li>
              <li>• <strong>High Season vs Low Season:</strong> Different utilization and pricing patterns</li>
              <li>• <strong>Staffing Models:</strong> Minimal staff vs full staff comparison</li>
              <li>• <strong>Pricing Tests:</strong> Premium pricing with lower utilization vs value pricing with higher volume</li>
            </ul>
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <strong>Tip:</strong> Always save a &ldquo;baseline&rdquo; scenario before making significant changes so you can revert. Use descriptive names like &ldquo;Year 1 Conservative&rdquo; or &ldquo;Year 5 Optimistic.&rdquo;
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
            The Reports page provides detailed financial analysis with collapsible sections, multiple export options, and a print-optimized layout.
          </p>

          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">On-Screen Report Sections</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Executive Summary:</strong> Key metrics (revenue, costs, profit, margin) with summary cards and P&L table</li>
                <li><strong>Daily Revenue Analysis:</strong> Day-by-day breakdown with treatment counts, thermal visits, and revenue by stream</li>
                <li><strong>Cost Breakdown:</strong> Fixed, variable, and labor costs with weekly/annual/% of revenue columns</li>
                <li><strong>Daily Profit & Loss:</strong> Revenue vs costs vs profit per day with margin percentages</li>
                <li><strong>Capacity & Utilization:</strong> Treatment and thermal capacity details with daily utilization tables</li>
                <li><strong>Rent Structure:</strong> Fixed Rent table (CPI escalation detail), Percentage Rent tiers, and &quot;Greater Of&quot; determination with APPLIES indicators</li>
                <li><strong>Model Configuration:</strong> Complete summary of all treatment, thermal, and cost settings</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50/30">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Revenue Excel
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Executive summary</li>
                <li>Daily revenue analysis</li>
                <li>Treatment configuration</li>
                <li>Thermal configuration</li>
                <li>Retail configuration</li>
              </ul>
            </div>

            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
              <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Financial Excel
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Executive P&amp;L summary</li>
                <li>Detailed cost breakdown</li>
                <li>Rent Structure sheet (CPI + tiers)</li>
                <li>Daily financial breakdown</li>
                <li>Complete model config</li>
                <li>Utilization & pricing</li>
              </ul>
            </div>

            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/30">
              <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                <Printer className="w-4 h-4" /> Browser Print
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Print-optimized layout</li>
                <li>All expanded sections</li>
                <li>Page break handling</li>
                <li>Use Expand All first</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: 'Settings & Data',
      icon: <Settings className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            The Settings page provides data management tools for backing up, restoring, and resetting your model.
          </p>

          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Data Management</h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li><strong>Export JSON:</strong> Download all current inputs as a JSON file for backup or sharing</li>
                <li><strong>Import JSON:</strong> Load inputs from a previously exported JSON file (supports both raw and scenario wrapper formats)</li>
                <li><strong>Reset to Defaults:</strong> Restore all inputs to factory defaults (Base Rent: $250K, Additional: $20K, CPI: 2% from Year 4, etc.)</li>
                <li><strong>Storage Info:</strong> See current localStorage usage</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-1 text-sm">⚠️ Important Notes</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Resetting to defaults cannot be undone — export your data first</li>
                <li>• Importing a JSON file replaces all current inputs</li>
                <li>• Clearing browser data (cache/cookies) will erase your saved model and scenarios</li>
                <li>• Scenarios are stored separately and are not affected by Reset to Defaults</li>
              </ul>
            </div>
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
              title="Treatment Capacity (Daily)"
              formula="beds × floor(operatingMinutes / (treatmentDuration + cleaningTime))"
              example="9 beds × floor(735 / 75) = 9 × 9 = 81 treatments/day"
            />
            <FormulaCard
              title="Thermal Capacity (Daily)"
              formula="floor(maxCapacity × (operatingHours / sessionDuration))"
              example="floor(25 × (10 / 3)) = floor(83.3) = 83 visits/day"
            />
            <FormulaCard
              title="Treatment Revenue (Per Day)"
              formula="capacity × utilization × (hotelMix × hotelPrice + nonHotelMix × nonHotelPrice)"
              example="81 × 0.80 × (0.50 × $160 + 0.50 × $160) = $10,368"
            />
            <FormulaCard
              title="Retail Revenue (Weekly)"
              formula="(treatmentRevenue + thermalRevenue) × retailPercentage / 100"
              example="($60K + $40K) × 12% = $12,000/week"
            />
            <FormulaCard
              title="CPI Escalation"
              formula="baseAmount × (1 + cpiRate / 100) ^ escalationYears"
              example="$250,000 × 1.02³ = $265,302 (Year 6, CPI starts Year 4)"
            />
            <FormulaCard
              title="Fixed Rent (Annual)"
              formula="escalatedBaseRent + escalatedAdditionalRent"
              example="$265,302 + $21,224 = $286,526 (in Year 6)"
            />
            <FormulaCard
              title="Percentage Rent (Progressive Tiers)"
              formula="Σ min(revenueInTier, tierRange) × tierPercentage for each tier"
              example="0% on $4M + 8% on $500K = $0 + $40K = $40K total"
            />
            <FormulaCard
              title="Effective Rent"
              formula="MAX(fixedRent, percentageRent)"
              example="MAX($286K fixed, $40K percentage) = $286K/yr"
            />
            <FormulaCard
              title="Labor Cost (Per Day)"
              formula="staffCount × hoursPerShift × hourlyRate"
              example="4 receptionists × 8h × $23/hr = $736/day"
            />
            <FormulaCard
              title="Profit Margin"
              formula="(totalRevenue - totalCosts) / totalRevenue × 100"
              example="($50,000 - $35,000) / $50,000 × 100 = 30%"
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
        <p className="text-sm text-gray-500 mt-1">Learn how to use the Aeris Financial Model effectively</p>
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
              <p className="text-sm text-gray-500">Common questions about the financial model ({faqs.length} topics)</p>
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

      {/* Tips & Best Practices */}
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
            description="Begin with lower utilization rates and increase gradually. It's easier to show upside potential than explain missed targets."
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
            icon={<Calendar className="w-4 h-4 text-amber-600" />}
            title="Model Multiple Lease Years"
            description="Use the lease year slider to see how CPI escalation affects rent. Save scenarios for Year 1, Year 5, and Year 10 to show long-term projections."
          />
          <TipCard
            icon={<ArrowUpDown className="w-4 h-4 text-red-600" />}
            title="Watch the Rent Crossover"
            description="Monitor when Percentage Rent exceeds Fixed Rent. As revenue grows, the 'greater of' determination may shift from fixed to percentage rent."
          />
          <TipCard
            icon={<Save className="w-4 h-4 text-indigo-600" />}
            title="Save Before Changes"
            description="Always save a scenario snapshot before making significant changes. Name them descriptively so you can easily compare later."
          />
          <TipCard
            icon={<FileSpreadsheet className="w-4 h-4 text-teal-600" />}
            title="Export for Stakeholders"
            description="Use the Financial Excel Report for investor presentations — it includes all rent structure details, cost breakdowns, and model configuration."
          />
          <TipCard
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            title="Validate with Actuals"
            description="Once operating, compare model projections to actual performance. Update utilization rates and pricing to match reality for more accurate forecasting."
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
