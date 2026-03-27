import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'
import blogs from '@/data/blogs.json'

const BlogSection = () => {
  return (
    <section id="blog" className="section">
      <div className="container">
        <RevealOnScroll>
          <SectionTitle prefix="Insights & " highlight="Blog" />
        </RevealOnScroll>

        <div className="blog-grid">
          {blogs.map((blog, index) => (
            <RevealOnScroll key={blog.slug} delay={index * 100}>
              <GlassCard className="blog-card" hover>
                <div className="blog-card-header">
                  <span className="blog-category">{blog.category}</span>
                  <span className="blog-date">
                    <Calendar size={12} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    {blog.date}
                  </span>
                </div>

                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>

                <div className="blog-footer">
                  <span className="blog-readtime">
                    <Clock size={12} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    {blog.readTime}
                  </span>
                  {blog.published ? (
                    <Link to={`/blog/${blog.slug}`} className="blog-readmore">
                      Read More <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="blog-readmore" style={{ opacity: 0.5, cursor: 'default' }}>
                      Coming Soon
                    </span>
                  )}
                </div>
              </GlassCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection
