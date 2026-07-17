'use client'

// Custom Tiptap node: video YouTube (iframe embed) dengan figcaption yang bisa diketik.
// Sejalan dengan FigureImage. src = URL embed (dihitung dari URL YouTube via
// getEmbedUrlFromYoutubeUrl saat insert). Lihat [[FigureImage]].

import { Node, mergeAttributes } from '@tiptap/core'
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { cn } from '@/shared/lib/utils'

export const VIDEO_CAPTION_PLACEHOLDER = 'Ketik keterangan video (opsional)'

const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'

function FigureVideoView({ node, editor, getPos, selected }: NodeViewProps) {
  const captionEmpty = node.content.size === 0
  // Klik video → pilih node (border) dulu, jangan langsung play.
  const selectFigure = () => {
    const pos = getPos()
    if (typeof pos === 'number') editor.chain().focus().setNodeSelection(pos).run()
  }
  return (
    <NodeViewWrapper as="figure" data-type="figure-video" className="my-6">
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden',
          selected && 'ring-[3px] ring-primary ring-offset-2 ring-offset-background',
        )}
        contentEditable={false}
      >
        <iframe
          src={node.attrs.src ?? ''}
          title="Video YouTube"
          className="absolute inset-0 h-full w-full"
          allow={IFRAME_ALLOW}
          allowFullScreen
        />
        {/* Overlay saat belum terpilih: klik memilih node (border), bukan play.
            Saat terpilih, overlay hilang → iframe interaktif (klik play → main). */}
        {!selected && (
          <button
            type="button"
            aria-label="Pilih video"
            onClick={selectFigure}
            className="absolute inset-0 z-10 cursor-pointer"
          />
        )}
      </div>
      <NodeViewContent<'figcaption'>
        as="figcaption"
        data-placeholder={VIDEO_CAPTION_PLACEHOLDER}
        className={cn(
          'mt-2 text-center text-sm text-muted-foreground focus:outline-none',
          captionEmpty && 'is-caption-empty',
        )}
      />
    </NodeViewWrapper>
  )
}

export const FigureVideo = Node.create({
  name: 'figureVideo',
  group: 'block',
  content: 'inline*',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="figure-video"]',
        contentElement: 'figcaption',
        getAttrs: (el) => {
          const iframe = (el as HTMLElement).querySelector('iframe')
          return { src: iframe?.getAttribute('src') || null }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-type': 'figure-video' }),
      [
        'div',
        { 'data-youtube-video': '' },
        [
          'iframe',
          {
            src: node.attrs.src,
            frameborder: '0',
            allow: IFRAME_ALLOW,
            allowfullscreen: 'true',
          },
        ],
      ],
      ['figcaption', {}, 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureVideoView)
  },
})
