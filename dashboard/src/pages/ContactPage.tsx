import React, { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import {
  Send,
  CheckCircle2,
  Tv,
  ShieldCheck,
  Clock,
} from "lucide-react";

type ContactPageProps = {
  authenticated: boolean;
  appDomain: string;
  systemHealthy: boolean;
  onNavigate: (path: string) => void;
};

export const ContactPage: React.FC<ContactPageProps> = ({
  authenticated,
  appDomain,
  systemHealthy,
  onNavigate,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [topic, setTopic] = useState("Agency Scaling");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="vms-landing-root">
      <Navbar
        currentPath="/contact"
        authenticated={authenticated}
        appDomain={appDomain}
        systemHealthy={systemHealthy}
        onNavigate={onNavigate}
      />

      <main>
        {/* Header */}
        <section className="vms-section" style={{ paddingBottom: 28 }}>
          <div className="vms-container">
            <div className="vms-page-head">
              <span className="vms-kicker">CONTACT &amp; AGENCY SUPPORT</span>
              <h1 className="vms-h1" style={{ margin: "16px 0 20px" }}>
                Let&rsquo;s Scale Your Video Production
              </h1>
              <p className="vms-sub" style={{ margin: "0 auto 32px" }}>
                Whether you operate a single faceless channel or manage 15+ creator brands, our engineering team
                is here to help with API integrations, custom templates, and agency deployments.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="vms-section" style={{ paddingTop: 0 }}>
          <div className="vms-container">
            <div className="vms-contact-grid">
              {/* Form Card */}
              <div className="vms-contact-form-card">
                {submitted ? (
                  <div className="vms-contact-success">
                    <div className="vms-contact-success-icon">
                      <CheckCircle2 size={36} color="var(--vms-cyan)" />
                    </div>
                    <h2>Inquiry Received</h2>
                    <p>
                      Thank you for contacting ViralMotionStudio, <strong>{name}</strong>. Our engineering and
                      creator operations team will follow up at <strong>{email}</strong> within 24 hours.
                    </p>
                    <button
                      type="button"
                      className="vms-btn vms-btn-outline"
                      onClick={() => {
                        setSubmitted(false);
                        setMessage("");
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="vms-form">
                    <h3>Send Us a Message</h3>
                    <p className="vms-muted-sm">Fill out the details below and we will respond promptly.</p>

                    <div className="vms-form-group">
                      <label htmlFor="contact-name">Your Full Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="vms-form-group">
                      <label htmlFor="contact-email">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="alex@studio.agency"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="vms-form-group">
                      <label htmlFor="contact-channel">YouTube Channel / Studio URL (Optional)</label>
                      <input
                        id="contact-channel"
                        type="text"
                        placeholder="https://youtube.com/@channel or website"
                        value={channelUrl}
                        onChange={(e) => setChannelUrl(e.target.value)}
                      />
                    </div>

                    <div className="vms-form-group">
                      <label htmlFor="contact-topic">Inquiry Topic</label>
                      <select
                        id="contact-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      >
                        <option value="Agency Scaling">Agency Multi-Channel Scaling</option>
                        <option value="API Integration">REST API &amp; Webhook Integration</option>
                        <option value="Custom Motion Templates">Custom 3D / Remotion Motion Templates</option>
                        <option value="Technical Support">Technical &amp; Billing Support</option>
                      </select>
                    </div>

                    <div className="vms-form-group">
                      <label htmlFor="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Tell us about your channels, publishing frequency, and goals..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="vms-btn vms-btn-primary vms-btn-lg"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      <Send size={16} />
                      <span>Send Inquiry</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="vms-contact-info-col">
                <div className="vms-contact-info-card">
                  <div className="vms-info-icon-box">
                    <Clock size={20} color="var(--vms-cyan)" />
                  </div>
                  <div>
                    <h4>Response SLA</h4>
                    <p>Within 24 business hours. Priority support for Creator Pro and Agency Scale accounts.</p>
                  </div>
                </div>

                <div className="vms-contact-info-card">
                  <div className="vms-info-icon-box">
                    <Tv size={20} color="#FF0033" />
                  </div>
                  <div>
                    <h4>YouTube OAuth Verification</h4>
                    <p>Official Google OAuth 2.0 endpoints connected via authorized redirect URIs on {appDomain}.</p>
                  </div>
                </div>

                <div className="vms-contact-info-card">
                  <div className="vms-info-icon-box">
                    <ShieldCheck size={20} color="var(--vms-lavender)" />
                  </div>
                  <div>
                    <h4>Data Protection</h4>
                    <p>All client credentials and YouTube access tokens are AES-256-GCM encrypted at rest.</p>
                  </div>
                </div>

                <div className="vms-contact-live-status-card">
                  <div className="vms-live-dot" />
                  <div>
                    <strong>Studio Production Infrastructure</strong>
                    <span>Remotion Studio, Edge TTS &amp; YouTube API: 100% Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer appDomain={appDomain} onNavigate={onNavigate} />
    </div>
  );
};
