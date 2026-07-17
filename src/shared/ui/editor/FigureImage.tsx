'use client'

// Custom Tiptap node: gambar dengan figcaption yang bisa diketik (ala Medium).
// - Editing: React NodeView → <figure><img/><figcaption(editable)/></figure>,
//   placeholder tampil selama caption kosong (class `is-caption-empty` + CSS di globals.css).
// - Serialisasi/parse: renderHTML/parseHTML → HTML `<figure data-type="figure-image">…`
//   agar tersimpan & bisa dibaca ulang (edit) + dirender publik oleh `prose`.
// Sisip via: editor.chain().insertContent({ type: 'figureImage', attrs: { src } }).run()

import { Node, mergeAttributes } from '@tiptap/core'
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { cn } from '@/shared/lib/utils'

export const CAPTION_PLACEHOLDER = 'Ketik keterangan gambar (opsional)'

function FigureImageView({ node, editor, getPos, selected }: NodeViewProps) {
  const captionEmpty = node.content.size === 0
  // Klik gambar → pilih node secara eksplisit (NodeSelection) → ring emerald muncul & bisa dihapus (Delete).
  const selectFigure = () => {
    const pos = getPos()
    if (typeof pos === 'number') editor.chain().focus().setNodeSelection(pos).run()
  }
  return (
    <NodeViewWrapper as="figure" data-type="figure-image" className="my-6">
      {/* Caption diedit dengan mengklik area teks di bawah gambar. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={node.attrs.src ?? ''}
        alt={node.attrs.alt ?? ''}
        draggable={false}
        onClick={selectFigure}
        className={cn(
          'mx-auto max-w-full cursor-pointer',
          selected && 'ring-[3px] ring-primary ring-offset-2 ring-offset-background',
        )}
      />
      <NodeViewContent<'figcaption'>
        as="figcaption"
        data-placeholder={CAPTION_PLACEHOLDER}
        className={cn(
          'mt-2 text-center text-sm text-muted-foreground focus:outline-none',
          captionEmpty && 'is-caption-empty',
        )}
      />
    </NodeViewWrapper>
  )
}

export const FigureImage = Node.create({
  name: 'figureImage',
  group: 'block',
  content: 'inline*',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="figure-image"]',
        contentElement: 'figcaption',
        getAttrs: (el) => {
          const img = (el as HTMLElement).querySelector('img')
          return { src: img?.getAttribute('src') || null, alt: img?.getAttribute('alt') || null }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-type': 'figure-image' }),
      ['img', { src: node.attrs.src, alt: node.attrs.alt ?? '' }],
      ['figcaption', {}, 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureImageView)
  },
})
