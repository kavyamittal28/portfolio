import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import NeonButton from '@/components/common/NeonButton'

interface SubpageLayoutProps {
  children: React.ReactNode
  backTo: string
  backLabel: string
}

export default function SubpageLayout({ children, backTo, backLabel }: SubpageLayoutProps) {
  return (
    <div className="blog-post-page">
      <nav className="glass-nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            K<span>.</span>M
          </Link>
          <Link to={backTo}>
            <NeonButton variant="secondary" size="sm">
              <ArrowLeft size={14} /> {backLabel}
            </NeonButton>
          </Link>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="glass-footer">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>&copy; {new Date().getFullYear()} Kavya Mittal. Designed & Built with passion.</p>
        </div>
      </footer>
    </div>
  )
}
