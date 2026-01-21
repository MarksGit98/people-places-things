import { Link } from 'react-router-dom';
import { AdsterraAd } from '../AdsterraAd/AdsterraAd';
import { AdsterraBanner } from '../AdsterraBanner/AdsterraBanner';
import './PrivacyPolicy.css';

export function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <div className="privacy-policy__container">
        <Link to="/" className="privacy-policy__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Game
        </Link>

        <h1 className="privacy-policy__title">Privacy Policy</h1>
        <p className="privacy-policy__date">Last updated: January 20, 2026</p>

        <section className="privacy-policy__section">
          <h2>Introduction</h2>
          <p>
            We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your
            information when you visit our website at peopleplacesandthings.io (the "Site").
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Information We Collect</h2>
          <h3>Automatically Collected Information</h3>
          <p>When you visit our Site, we may automatically collect certain information, including:</p>
          <ul>
            <li>Device information (browser type, operating system, device type)</li>
            <li>IP address</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>

          <h3>Local Storage</h3>
          <p>
            We use your browser's local storage to save your game progress and preferences. This data is stored
            locally on your device and is not transmitted to our servers.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Advertising</h2>
          <p>
            We use Adsterra to display advertisements on our Site. Adsterra and its advertising partners may use cookies
            and similar technologies to collect information about your browsing activities to provide you with
            relevant advertisements.
          </p>
          <p>
            For more information about Adsterra's privacy practices, please visit:{' '}
            <a href="https://adsterra.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
              Adsterra Privacy Policy
            </a>
          </p>
          <p>
            You can opt out of personalized advertising by visiting:{' '}
            <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">
              Your Online Choices
            </a>
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Analytics</h2>
          <p>
            We use Vercel Analytics to understand how visitors interact with our Site. This service collects
            anonymous usage data to help us improve our website and user experience.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Cookies</h2>
          <p>
            Cookies are small text files stored on your device. We and our advertising partners use cookies to:
          </p>
          <ul>
            <li>Remember your preferences</li>
            <li>Understand how you use our Site</li>
            <li>Deliver relevant advertisements</li>
            <li>Analyze Site traffic and trends</li>
          </ul>
          <p>
            You can control cookies through your browser settings. However, disabling cookies may affect the
            functionality of the Site.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Third-Party Links</h2>
          <p>
            Our Site may contain links to third-party websites. We are not responsible for the privacy practices
            or content of these external sites. We encourage you to review the privacy policies of any third-party
            sites you visit.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Children's Privacy</h2>
          <p>
            Our Site is not intended for children under 13 years of age. We do not knowingly collect personal
            information from children under 13. If you believe we have collected information from a child under 13,
            please contact us immediately.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
          <ul>
            <li>The right to access your personal data</li>
            <li>The right to request correction of inaccurate data</li>
            <li>The right to request deletion of your data</li>
            <li>The right to opt out of certain data processing activities</li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the
            new privacy policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at:{' '}
            <a href="mailto:rubberduckygamescontact@gmail.com">rubberduckygamescontact@gmail.com</a>
          </p>
        </section>

        {/* Bottom ad */}
        <div className="privacy-policy__bottom-ad">
          <AdsterraAd
            scriptSrc="https://pl28527779.effectivegatecpm.com/e367eb54c5443f7ddc13daba8ded0da3/invoke.js"
            containerId="container-e367eb54c5443f7ddc13daba8ded0da3-privacy"
          />
        </div>
      </div>

      {/* Banner ad at very bottom */}
      <div className="privacy-policy__banner-ad">
        <AdsterraBanner
          adKey="7370110dc9e2b65e305339fd5395c7e3"
          width={300}
          height={250}
          position="bottom"
        />
      </div>
    </div>
  );
}
