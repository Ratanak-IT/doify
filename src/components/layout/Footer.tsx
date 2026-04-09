

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <div className="lp-logo-mark lp-logo-mark--sm">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="12" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8" />
            </svg>
          </div>
          <div>
            <span className="lp-footer-name">TaskFlow</span>
            <p className="lp-footer-brand-copy">
              Professional task management for teams, projects, and workflows.
            </p>
          </div>
        </div>

        <div className="lp-footer-nav">
          <div className="lp-footer-section">
            <p className="lp-footer-title">Website</p>
            <div className="lp-footer-stack">
              <a href="#" className="lp-footer-link">Home</a>
              <a href="#features" className="lp-footer-link">Features</a>
              <a href="#pricing" className="lp-footer-link">Pricing</a>
              <a href="#testimonials" className="lp-footer-link">Testimonials</a>
              <a href="#contact" className="lp-footer-link">Contact</a>
            </div>
          </div>

          <div className="lp-footer-section">
            <p className="lp-footer-title">Task Manager</p>
            <div className="lp-footer-stack">
              <a href="#" className="lp-footer-link">For Teams</a>
              <a href="#" className="lp-footer-link">Workflows</a>
              <a href="#" className="lp-footer-link">Security</a>
              <a href="#" className="lp-footer-link">Integrations</a>
              <a href="#" className="lp-footer-link">Support</a>
            </div>
          </div>

          <div className="lp-footer-section">
            <p className="lp-footer-title">Legal</p>
            <div className="lp-footer-stack">
              <a href="#" className="lp-footer-link">Privacy</a>
              <a href="#" className="lp-footer-link">Terms</a>
              <a href="#" className="lp-footer-link">Status</a>
              <a href="#" className="lp-footer-link">Help</a>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-footer-bottom">
        <span>
          © {new Date().getFullYear()} TaskFlow — Professional task management for teams and managers.
        </span>
      </div>
    </footer>
  );
}