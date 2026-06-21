'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { TaxonomyTable } from './TaxonomyTable'
import { CreateTaxonomyModal } from './CreateTaxonomyModal'

type TaxonomyData = {
  id: string
  name: string
  slug: string
  is_active: boolean
  _count?: Record<string, number>
}

export function TaxonomyTabs({ 
  articleCategories, 
  documentCategories, 
  tags
}: { 
  articleCategories: Array<TaxonomyData>,
  documentCategories: Array<TaxonomyData>,
  tags: Array<TaxonomyData>
}) {
  return (
    <Tabs defaultValue="article-categories" className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <TabsList>
          <TabsTrigger value="article-categories">Kategori Artikel</TabsTrigger>
          <TabsTrigger value="document-categories">Kategori Dokumen</TabsTrigger>
          <TabsTrigger value="tags">Tag Label</TabsTrigger>
        </TabsList>
        
        {/* Dynamic Buttons for the active tab could be handled with separate components or state,
            but for simplicity we'll render the modal button specific to each tab content inside the tab,
            or just keep it simple and put the button inside the tab content. */}
      </div>
      
      <TabsContent value="article-categories" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Daftar Kategori Artikel</h2>
          <CreateTaxonomyModal type="ARTICLE_CATEGORY" label="Kategori Artikel" />
        </div>
        <TaxonomyTable items={articleCategories} type="ARTICLE_CATEGORY" />
      </TabsContent>

      <TabsContent value="document-categories" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Daftar Kategori Dokumen</h2>
          <CreateTaxonomyModal type="DOCUMENT_CATEGORY" label="Kategori Dokumen" />
        </div>
        <TaxonomyTable items={documentCategories} type="DOCUMENT_CATEGORY" />
      </TabsContent>

      <TabsContent value="tags" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Daftar Tag Label</h2>
          <CreateTaxonomyModal type="TAG" label="Tag" />
        </div>
        <TaxonomyTable items={tags} type="TAG" />
      </TabsContent>
    </Tabs>
  )
}
