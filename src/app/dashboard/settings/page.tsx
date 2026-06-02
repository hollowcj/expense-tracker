"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Loader2, Trash2, Plus, Download, AlertTriangle, X} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'categories' | 'data'>('profile')
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)

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

      // UPDATED: Now just sets the data directly (or an empty array)
      // without injecting hardcoded defaults.
      setCategories(catData || [])

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
    if (!newCategoryName.trim() || loading) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to add categories.')

      const { data, error } = await supabase
        .from('categories')
        .insert([{ 
          name: newCategoryName.trim(), 
          icon: newCategoryIcon,
          user_id: user.id 
        }])
        .select()
        .single()

      if (error) throw error

      setCategories([...categories, data])
      setNewCategoryName('')
      setMessage({ type: 'success', text: 'Category added to database!' })
    
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to add custom category.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      if (id.length > 1) {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)
        
        if (error) throw error
      }

      setCategories(categories.filter(c => c.id !== id))
      setMessage({ type: 'success', text: 'Category removed from workspace.' })
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to delete category from database.' })
    }
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

  const handleResetLedger = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No active authentication session found.')

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Workspace ledger cleared successfully! Your records have been completely reset.' })
      setShowResetModal(false)
    } catch (err: any) {
      console.error("Purge failure:", err)
      setMessage({ type: 'error', text: err.message || 'Failed to securely purge workspace data.' })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 p-6">
        <Loader2 className="animate-spin text-teal-800" size={32} />
        <span className="ml-2 mt-2 text-slate-500 text-sm font-medium text-center">Retrieving workspace settings...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-teal-950">Workspace Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Personalize your expense tracking workspace and manage data configurations.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-sm transition-all shadow-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs list: Swaps to full width columns on mobile viewport profiles */}
      <div className="flex flex-col sm:flex-row border-b border-slate-200 gap-2 sm:gap-6">
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`pb-2.5 sm:pb-3 text-left sm:text-center text-sm font-medium border-b-2 transition-all ${activeTab === 'profile' ? 'border-teal-800 text-teal-800' : 'border-transparent text-slate-500'}`}
        >
          Profile & Localization
        </button>
        <button 
          onClick={() => setActiveTab('categories')} 
          className={`pb-2.5 sm:pb-3 text-left sm:text-center text-sm font-medium border-b-2 transition-all ${activeTab === 'categories' ? 'border-teal-800 text-teal-800' : 'border-transparent text-slate-500'}`}
        >
          Custom Categories
        </button>
        <button 
          onClick={() => setActiveTab('data')} 
          className={`pb-2.5 sm:pb-3 text-left sm:text-center text-sm font-medium border-b-2 transition-all ${activeTab === 'data' ? 'border-teal-800 text-teal-800' : 'border-transparent text-slate-500'}`}
        >
          Data Portability
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Primary Workspace Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-20 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white">
                  <option value="₦">Nigerian Naira (₦)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="€">Euro (€)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Monthly Target Budget Limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">{currency}</span>
                  <input type="number" value={monthlyBudget} onChange={(e) => setMonthlyBudget(Number(e.target.value))} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" disabled={loading} className="w-full sm:w-auto justify-center bg-teal-900 hover:bg-teal-950 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50 text-sm">
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

            <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <select value={newCategoryIcon} onChange={(e) => setNewCategoryIcon(e.target.value)} className="px-3 h-10 rounded-xl border border-slate-20 focus:outline-none text-base bg-white">
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
                className="flex-1 h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700 text-sm"
              />
              <button type="submit" disabled={loading} className="h-10 bg-teal-900 text-white px-5 rounded-xl hover:bg-teal-950 text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50 shrink-0">
                <Plus size={16} /> Add Category
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl bg-white p-1.5 rounded-lg border border-slate-100 shadow-xs shrink-0">{cat.icon}</span>
                    <span className="text-sm font-medium text-slate-700 truncate">{cat.name}</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors ml-2 shrink-0">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-700 flex items-center gap-2 text-sm sm:text-base">
                    <Download size={18} className="text-teal-800 shrink-0" /> Export Ledger Data
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">Download all structural expense tracking accounts to a localized computer JSON backup file.</p>
                </div>
                <button onClick={handleExportData} className="w-full text-sm font-medium border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Generate Backup Download
                </button>
              </div>

              <div className="p-5 border border-rose-100 bg-rose-50/20 rounded-2xl flex flex-col justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-rose-900 flex items-center gap-2 text-sm sm:text-base">
                    <AlertTriangle size={18} className="text-rose-700 shrink-0" /> Danger Zone
                  </div>
                  <p className="text-xs text-rose-700/60 leading-normal">Purge your account. This operation irreversibly wipes your complete entry history logs instantly.</p>
                </div>
                <button onClick={() => setShowResetModal(true)} className="w-full text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Reset Workspace Ledger
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-6 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            
            <button 
              onClick={() => !loading && setShowResetModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl shrink-0">
                <AlertTriangle size={22} className="text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Reset Workspace Ledger?</h3>
                <p className="text-sm text-slate-500 leading-normal">
                  Are you absolutely sure? This action will permanently remove all logs from your expense records. This configuration cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors order-2 sm:order-1 disabled:opacity-50"
              >
                Cancel, Keep Data
              </button>
              <button
                type="button"
                onClick={handleResetLedger}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Purging records...
                  </>
                ) : (
                  'Yes, Delete Everything'
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}