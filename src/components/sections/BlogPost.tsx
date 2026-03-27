import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import blogs from '@/data/blogs.json'
import NeonButton from '@/components/common/NeonButton'
import SubpageLayout from '@/components/layout/SubpageLayout'

interface ContentBlock {
  type: string
  text?: string
  items?: string[]
  language?: string
}

function renderLinks(text: string): React.ReactNode[] {
  const parts = text.split(/(\[.*?\]\(.*?\))/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (match) {
      return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>
    }
    return part
  })
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return <span key={i}>{renderLinks(part)}</span>
  })
}

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="inline-code">{part.slice(1, -1)}</code>
    }
    return renderBold(part)
  })
}

function ContentRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>
    case 'h3':
      return <h3>{block.text}</h3>
    case 'p':
      return <p>{renderInlineCode(block.text || '')}</p>
    case 'ul':
      return (
        <ul>
          {block.items?.map((item, i) => (
            <li key={i}>{renderInlineCode(item)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol>
          {block.items?.map((item, i) => (
            <li key={i}>{renderInlineCode(item)}</li>
          ))}
        </ol>
      )
    case 'code':
      return (
        <pre>
          <code>{block.text}</code>
        </pre>
      )
    default:
      return null
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const blog = blogs.find((b) => b.slug === slug)

  if (!blog) {
    return (
      <div className="blog-post-page">
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
          <h1>Post Not Found</h1>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/">
            <NeonButton>
              <ArrowLeft size={16} /> Back to Home
            </NeonButton>
          </Link>
        </div>
      </div>
    )
  }

  const content = (blog as { content?: ContentBlock[] }).content

  return (
    <SubpageLayout backTo="/#blog" backLabel="Back to Blog">
      <article className="blog-article">
        <header className="blog-article-header">
          <span className="blog-category-tag">{blog.category}</span>
          <h1 className="blog-article-title">{blog.title}</h1>
          <div className="blog-meta">
            <span><Calendar size={14} /> {blog.date}</span>
            <span><Clock size={14} /> {blog.readTime}</span>
            <span><User size={14} /> Kavya Mittal</span>
          </div>
        </header>

        <div className="blog-body glass-card">
          {content?.map((block, i) => (
            <ContentRenderer key={i} block={block} />
          ))}

          <div className="blog-author-box">
            <div className="author-info">
              <strong>Kavya Mittal</strong>
              <span>Backend & AI Engineer at Salescode.ai</span>
            </div>
          </div>
        </div>
      </article>

      <div className="blog-nav-bottom">
        <Link to="/#blog">
          <NeonButton glow>
            <ArrowLeft size={16} /> Back to All Posts
          </NeonButton>
        </Link>
      </div>
    </SubpageLayout>
  )
}
