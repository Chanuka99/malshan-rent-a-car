'use client'

import { useState } from 'react'
import { Plus, Trash2, Tag, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addBrandAction, deleteBrandAction, addModelAction, deleteModelAction } from '@/app/actions/admin'
import type { Brand, Model } from '@/types/supabase'

export function AdminBrandsTab({ brands, models }: { brands: Brand[], models: Model[] }) {
  const [newBrand, setNewBrand] = useState('')
  const [newModel, setNewModel] = useState('')
  const [selectedBrandForModel, setSelectedBrandForModel] = useState<string>('')

  const [loadingBrand, setLoadingBrand] = useState(false)
  const [loadingModel, setLoadingModel] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddBrand(e: React.FormEvent) {
    e.preventDefault()
    if (!newBrand.trim()) return
    setLoadingBrand(true)
    setError(null)
    const result = await addBrandAction(newBrand.trim())
    if (result.error) setError(result.error)
    else setNewBrand('')
    setLoadingBrand(false)
  }

  async function handleAddModel(e: React.FormEvent) {
    e.preventDefault()
    if (!newModel.trim() || !selectedBrandForModel) return
    setLoadingModel(true)
    setError(null)
    const result = await addModelAction(selectedBrandForModel, newModel.trim())
    if (result.error) setError(result.error)
    else setNewModel('')
    setLoadingModel(false)
  }

  async function handleDeleteBrand(id: string) {
    if (!confirm('Are you sure you want to delete this brand? All its models will be deleted as well.')) return
    const result = await deleteBrandAction(id)
    if (result.error) alert(result.error)
  }

  async function handleDeleteModel(id: string) {
    if (!confirm('Are you sure you want to delete this model?')) return
    const result = await deleteModelAction(id)
    if (result.error) alert(result.error)
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brands Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Tag size={18} className="text-brand" /> Manage Brands
            </h2>
            <form onSubmit={handleAddBrand} className="mt-4 flex gap-2">
              <Input
                placeholder="e.g. Toyota"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                disabled={loadingBrand}
              />
              <Button type="submit" disabled={!newBrand.trim() || loadingBrand} className="bg-brand hover:bg-brand-dark">
                <Plus size={16} /> Add
              </Button>
            </form>
          </div>
          <div className="p-0 max-h-[400px] overflow-y-auto">
            {brands.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No brands created yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {brands.map((brand) => (
                  <li key={brand.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <span className="font-medium text-gray-900">{brand.name}</span>
                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Models Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <LayoutTemplate size={18} className="text-brand" /> Manage Models
            </h2>
            <form onSubmit={handleAddModel} className="mt-4 flex flex-col sm:flex-row gap-2">
              <select
                className="flex h-9 w-full sm:w-1/3 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedBrandForModel}
                onChange={(e) => setSelectedBrandForModel(e.target.value)}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <Input
                placeholder="e.g. Camry"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                disabled={loadingModel || !selectedBrandForModel}
                className="flex-1"
              />
              <Button type="submit" disabled={!newModel.trim() || !selectedBrandForModel || loadingModel} className="bg-brand hover:bg-brand-dark">
                <Plus size={16} /> Add
              </Button>
            </form>
          </div>
          <div className="p-0 max-h-[400px] overflow-y-auto">
            {models.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No models created yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {brands.map(brand => {
                  const brandModels = models.filter(m => m.brand_id === brand.id)
                  if (brandModels.length === 0) return null
                  return (
                    <div key={brand.id}>
                      <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-y border-gray-100 first:border-t-0">
                        {brand.name}
                      </div>
                      {brandModels.map(model => (
                        <li key={model.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <span className="font-medium text-gray-900 pl-4">{model.name}</span>
                          <button
                            onClick={() => handleDeleteModel(model.id)}
                            className="text-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </div>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
