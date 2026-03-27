import { useState } from 'react'
import { Phone, Mail, MapPin, Github, Linkedin, FileText, Send, type LucideIcon } from 'lucide-react'
import RevealOnScroll from '@/components/common/RevealOnScroll'
import SectionTitle from '@/components/common/SectionTitle'
import GlassCard from '@/components/common/GlassCard'
import NeonButton from '@/components/common/NeonButton'
import resumePdf from '@/assets/pdf/KAVYA_MITTAL.pdf'
import siteData from '@/data/site.json'

const CONTACT_ICON_MAP: Record<string, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  github: Github,
  linkedin: Linkedin,
}

const contactMethods = siteData.contact.methods.map((m) => ({
  icon: CONTACT_ICON_MAP[m.icon] || Mail,
  label: m.label,
  value: m.value,
  color: m.color,
}))

const socialLinks = siteData.contact.socialLinks.map((s) => ({
  icon: CONTACT_ICON_MAP[s.icon] || Github,
  href: s.href,
  label: s.label,
}))

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )
    const mailtoLink = `mailto:kavyamittal1282@gmail.com?subject=${subject}&body=${body}`

    window.location.href = mailtoLink
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <RevealOnScroll>
          <SectionTitle prefix="Get In " highlight="Touch" />
        </RevealOnScroll>

        <div className="contact-grid">
          {/* Info Card */}
          <RevealOnScroll>
            <GlassCard className="contact-info">
              <h3>Let's Connect</h3>
              <p>
                I'm always open to discussing new opportunities, interesting projects,
                or just having a conversation about tech.
              </p>

              <div className="contact-methods">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <div key={index} className="method-item">
                      <div className={`icon-box ${method.color}`}>
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <h4>{method.label}</h4>
                        <p>{method.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="social-links" style={{ marginTop: '1.5rem' }}>
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-icon"
                      aria-label={social.label}
                    >
                      <IconComponent size={18} />
                    </a>
                  )
                })}
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <NeonButton variant="secondary" href={resumePdf} download="Kavya_Mittal_Resume.pdf">
                  <FileText size={16} />
                  Download Resume
                </NeonButton>
              </div>
            </GlassCard>
          </RevealOnScroll>

          {/* Form Card */}
          <RevealOnScroll delay={150}>
            <GlassCard>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="glass-input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="glass-input"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="glass-input"
                    placeholder="Tell me about your project or opportunity..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <NeonButton type="submit" glow>
                  <Send size={16} />
                  Send Message
                </NeonButton>
              </form>
            </GlassCard>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
