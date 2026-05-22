"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Loader2, Trash2, Plus, Download, AlertTriangle} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'categories' | 'data'>('profile')
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [fullName, setFullName] = useState('')
  const [currency, setCurrency] = useState('₦')
  const [monthlyBudget, setMonthlyBudget] = useState(0)

  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIcon, setNewCategoryIcon] = useState('🍔')

  const loadUserSettings = useCallback(async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setFetchingData(false)
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, currency_preference, monthly_budget')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) throw profileError

      if (profileData) {
        setFullName(profileData.full_name || '')
        setCurrency(profileData.currency_preference || '₦')
        setMonthlyBudget(profileData.monthly_budget || 0)
      }

      const { data: catData } = await supabase
        .from('categories')
        .select('id, name, icon')
        .eq('user_id', user.id)

      if (catData) {
        setCategories(catData)
      } else {
        setCategories([
          { id: '1', name: 'Food & Groceries', icon: '🍔' },
          { id: '2', name: 'Transport', icon: '🚗' },
          { id: '3', name: 'Utilities', icon: '💡' }
        ])
      }

    } catch (err: any) {
      console.error("Profile sync error:", err)
      setMessage({ type: 'error', text: err.message || 'Failed to sync database profile.' })
    } finally {
      setFetchingData(false)
    }
  }, [])

  useEffect(() => {
    loadUserSettings()
  }, [loadUserSettings])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Profile Submit Handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No active session.')

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          currency_preference: currency,
          monthly_budget: Number(monthlyBudget),
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setMessage({ type: 'success', text: 'Workspace configurations updated perfectly!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const newCat = { id: crypto.randomUUID(), name: newCategoryName, icon: newCategoryIcon }
      setCategories([...categories, newCat])
      setNewCategoryName('')
      setMessage({ type: 'success', text: 'Category added successfully!' })
    
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to add custom category.' })
    }
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id))
    setMessage({ type: 'success', text: 'Category removed from workspace.' })
  }


  const handleExportData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expenses || [], null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `fundly_ledger_backup.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()

      setMessage({ type: 'success', text: 'Financial ledger exported successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to compile data export package.' })
    }
  }

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="animate-spin text-teal-800" size={32} />
        <span className="ml-2 text-slate-500 font-medium">Retrieving workspace settings...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-800">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-teal-950">Workspace Settings</h1>
        <p className="text-slate-500 mt-1">Personalize your expense tracking workspace and manage data configurations.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-sm transition-all shadow-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button onClick={() => setActiveTab('profile')} className={`pb-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'profile' ? 'border-teal-800 text-teal-800' : 'border-transparent text-slate-500'}`}>Profile & Localization</button>
        <button onClick={() => setActiveTab('categories')} className={`pb-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'categories' ? 'border-teal-800 text-teal-800' : 'border-transparent text-slate-500'}`}>Custom Categories</button>
        <button onClick={() => setActiveTab('data')} className={`pb-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'data' ? 'border-teal-800 text-teal-800' : 'border-transparent text-slate-500'}`}>Data Portability</button>
      </div>

      {/* Tab Body Contents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        
        {/* TAB 1: PROFILE PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Primary Workspace Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700">
                  <option value="₦">Nigerian Naira (₦)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="€">Euro (€)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Monthly Target Budget Limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{currency}</span>
                  <input type="number" value={monthlyBudget} onChange={(e) => setMonthlyBudget(Number(e.target.value))} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" disabled={loading} className="bg-teal-900 hover:bg-teal-950 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50">
                {loading && <Loader2 className="animate-spin" size={16} />} Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-950">Manage Spending Categories</h3>
              <p className="text-slate-500 text-sm">Add or modify custom buckets to keep your structural budget distributions accurate.</p>
            </div>

            <form onSubmit={handleAddCategory} className="flex gap-3 max-w-md">
              <select value={newCategoryIcon} onChange={(e) => setNewCategoryIcon(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-xl">
                <option value="🍔">🍔 Food</option>
                <option value="🚗">🚗 Transport</option>
                <option value="💡">💡 Bills</option>
                <option value="🛍️">🛍️ Shopping</option>
                <option value="🏥">🏥 Health</option>
                <option value="🎓">🎓 School</option>
                <option value="🍿">🍿 Entertainment</option>
              </select>
              <input 
                type="text" 
                placeholder="Category name (e.g. Books)" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700 text-sm"
              />
              <button type="submit" className="bg-teal-900 text-white px-4 py-2 rounded-xl hover:bg-teal-950 text-sm font-medium flex items-center gap-1">
                <Plus size={16} /> Add
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl bg-white p-1.5 rounded-lg border border-slate-100 shadow-xs">{cat.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-950">Data Security & Backups</h3>
              <p className="text-slate-500 text-sm">Download your complete transactional history database records or securely reset your cloud parameters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Export Box */}
              <div className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between items-start space-y-4">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-700 flex items-center gap-2">
                    <Download size={18} className="text-teal-800" /> Export Ledger Data
                  </div>
                  <p className="text-xs text-slate-400">Download all structural expense tracking accounts to a localized computer JSON backup file.</p>
                </div>
                <button onClick={handleExportData} className="w-full sm:w-auto text-sm font-medium border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Generate Backup Download
                </button>
              </div>

              <div className="p-5 border border-rose-100 bg-rose-50/20 rounded-2xl flex flex-col justify-between items-start space-y-4">
                <div className="space-y-1">
                  <div className="font-semibold text-rose-900 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-rose-700" /> Danger Zone
                  </div>
                  <p className="text-xs text-rose-700/60">Purge your account. This operation irreversibly wipes your complete entry history logs instantly.</p>
                </div>
                <button onClick={() => setMessage({ type: 'error', text: 'Destructive clearing procedures require system admin flags.' })} className="w-full sm:w-auto text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Reset Workspace Ledger
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}