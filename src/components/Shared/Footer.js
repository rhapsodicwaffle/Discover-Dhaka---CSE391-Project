import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
      color: 'white',
      marginTop: 'auto'
    }}>
      {/* Main Footer */}
      <div className="container" style={{ padding: '60px 20px 40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛺 Discover Dhaka
            </h3>
            <p style={{ opacity: 0.8, lineHeight: '1.6', fontSize: '14px' }}>
              Your ultimate guide to exploring Dhaka through interactive maps, community stories, and curated events. 
              Uncover the heart of the city one experience at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  🏠 Home
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/map" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  🗺️ Explore Map
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/stories" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  📖 Stories
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/events" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  🎉 Events
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/forum" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  💬 Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Community</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/profile" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  👤 My Profile
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  📜 Guidelines
                </a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  🤝 Contribute
                </a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '14px' }}>
                  ❓ Help & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Connect With Us</h4>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <a 
                href="#" 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                f
              </a>
              <a 
                href="#" 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                𝕏
              </a>
              <a 
                href="#" 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                in
              </a>
              <a 
                href="#" 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                📷
              </a>
            </div>
            <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6' }}>
              📧 contact@discoverdhaka.com<br />
              📱 +880 1234-567890
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ opacity: 0.7, fontSize: '14px' }}>
            © {currentYear} Discover Dhaka. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px' }}>
              Terms of Service
            </a>
            <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px' }}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
