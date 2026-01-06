import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpFAQ.css';

const HelpFAQ = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'places', name: 'Places & Map', icon: '🗺️' },
    { id: 'stories', name: 'Stories', icon: '📖' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'forum', name: 'Community Forum', icon: '💬' },
    { id: 'gamification', name: 'XP & Badges', icon: '🏆' },
    { id: 'technical', name: 'Technical Issues', icon: '⚙️' }
  ];

  const faqs = {
    general: [
      {
        question: 'What is Discover Dhaka?',
        answer: 'Discover Dhaka is an interactive web platform that helps you explore Dhaka through maps, community stories, curated events, and personalized routes. Think of it as your digital guide to discovering the heart and soul of Dhaka.'
      },
      {
        question: 'Is Discover Dhaka free to use?',
        answer: 'Yes! Discover Dhaka is completely free to use. You can browse places, read stories, view events, and participate in the community forum without any cost.'
      },
      {
        question: 'Do I need an account to use Discover Dhaka?',
        answer: 'You can browse places and view the map without an account. However, to share stories, save places, create routes, RSVP to events, and participate in the forum, you\'ll need to create a free account.'
      },
      {
        question: 'How do I get started?',
        answer: 'Start by exploring the interactive map to discover places in Dhaka. Then create an account to save your favorite places, share your own stories, and connect with the community!'
      },
      {
        question: 'Is my data secure?',
        answer: 'Absolutely! We use industry-standard security measures including password encryption (bcrypt), JWT authentication, and secure database storage with Supabase. We never share your personal information with third parties.'
      }
    ],
    account: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the navigation bar. Enter your name, email, and password (minimum 6 characters). You\'ll be logged in automatically and can start exploring!'
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Currently, password reset is not available. Please contact us at contact@discoverdhaka.com with your account details, and our team will help you reset your password.'
      },
      {
        question: 'How do I upload a profile picture?',
        answer: 'Go to your profile page, click the "Edit Profile" button, then click on your current profile picture or the upload icon. Select an image file (JPG, PNG, GIF, or WEBP) up to 5MB in size.'
      },
      {
        question: 'Can I change my email address?',
        answer: 'Email addresses cannot be changed after registration. If you need to change your email, please contact our support team at contact@discoverdhaka.com.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'We don\'t currently have a self-service account deletion option. To delete your account and all associated data, please email contact@discoverdhaka.com with your request.'
      },
      {
        question: 'What does making my profile public/private do?',
        answer: 'A public profile allows other users to view your profile, stories, and activity. A private profile limits visibility to only you. You can toggle this in your profile settings.'
      }
    ],
    places: [
      {
        question: 'How do I find places on the map?',
        answer: 'Use the search bar to search for places by name, or use the category filters (Food, Culture, History, etc.) to see specific types of places. Click on any marker to see more details in a popup.'
      },
      {
        question: 'How do I save a place?',
        answer: 'Click on a place marker on the map or visit a place\'s detail page. Look for the "Save Place" button (bookmark icon). Saved places appear in the "Saved Places" tab on your profile.'
      },
      {
        question: 'Can I suggest a new place?',
        answer: 'Yes! If you have an account, you can submit new places through the "Add Place" form. Submissions go through an approval process by our admin team to ensure quality and accuracy.'
      },
      {
        question: 'How are places rated?',
        answer: 'Places are rated on a 1-5 star scale based on user reviews. The rating you see is the average of all user reviews for that place.'
      },
      {
        question: 'What are the different place categories?',
        answer: 'We have several categories: Food & Dining, Culture & Arts, Historical Sites, Parks & Nature, Shopping, Entertainment, Religious Sites, and Educational Institutions.'
      },
      {
        question: 'How do I get directions to a place?',
        answer: 'Currently, you can view the place location on our map. For turn-by-turn directions, copy the coordinates and use them in Google Maps or your preferred navigation app.'
      }
    ],
    stories: [
      {
        question: 'What is Story Mode?',
        answer: 'Story Mode lets you share your personal experiences and adventures in Dhaka. Share photos, write about your visits, tag locations, and inspire others to explore!'
      },
      {
        question: 'How do I create a story?',
        answer: 'Go to the Stories page and click "Share Your Story". Add a title, write your experience, upload up to 5 images, tag relevant places, and add hashtags. Click "Post Story" when ready!'
      },
      {
        question: 'How many images can I upload per story?',
        answer: 'You can upload up to 5 images per story. Each image must be under 5MB and in JPG, PNG, GIF, or WEBP format.'
      },
      {
        question: 'Can I edit or delete my story after posting?',
        answer: 'Yes! Go to the story page and look for the edit or delete icons (only visible on your own stories). You can update the content or remove the story entirely.'
      },
      {
        question: 'Why isn\'t my story showing up?',
        answer: 'Stories go through a moderation process to ensure they meet our community guidelines. If your story was recently posted, it may be pending approval. Check back in 24-48 hours.'
      },
      {
        question: 'How do I like or comment on stories?',
        answer: 'Click the heart icon to like a story. To comment, scroll to the comment section at the bottom of the story and type your thoughts. You must be logged in to like or comment.'
      },
      {
        question: 'What hashtags should I use?',
        answer: 'Use relevant hashtags like #food, #history, #culture, #photography, #hiddengem, etc. This helps others discover your story when filtering by topics.'
      }
    ],
    events: [
      {
        question: 'How do I find events in Dhaka?',
        answer: 'Visit the Events page to see upcoming events. You can filter by category (Music, Art, Tech, Food, Sports) and search by name or description.'
      },
      {
        question: 'How do I RSVP to an event?',
        answer: 'Click on an event to view details, then click the "Attend" or "RSVP" button. You\'ll be added to the attendees list and can see who else is going!'
      },
      {
        question: 'Can I create my own event?',
        answer: 'Yes! Click "Create Event" on the Events page. Fill in the event details (name, date, venue, description, category) and optionally upload a cover image. Events are reviewed by admins before being published.'
      },
      {
        question: 'How do I un-RSVP from an event?',
        answer: 'Visit the event page and click the "Cancel RSVP" or "Not Attending" button to remove yourself from the attendees list.'
      },
      {
        question: 'Can I share events with friends?',
        answer: 'Yes! Each event has a unique URL that you can copy and share via social media, messaging apps, or email.'
      },
      {
        question: 'Will I get notifications about events?',
        answer: 'Event notifications are currently not available. We recommend bookmarking events or adding them to your personal calendar (feature coming soon!).'
      }
    ],
    forum: [
      {
        question: 'What is the Community Forum?',
        answer: 'The Community Forum is a space for users to discuss topics related to Dhaka, ask questions, share tips, and connect with fellow explorers. It\'s organized into categories for easy navigation.'
      },
      {
        question: 'How do I create a forum thread?',
        answer: 'Go to the Forum page, click "New Thread", select a category, add a title and your question/discussion, then click "Post". Your thread will appear immediately for others to reply to.'
      },
      {
        question: 'How do I reply to a thread?',
        answer: 'Click on any thread to view it, scroll to the reply form at the bottom, type your response, and click "Post Reply". You must be logged in to reply.'
      },
      {
        question: 'Can I upvote/downvote threads and replies?',
        answer: 'Yes! Click the up arrow (⬆) to upvote or down arrow (⬇) to downvote threads and replies. This helps surface the most helpful content.'
      },
      {
        question: 'What do "Pinned" and "Locked" threads mean?',
        answer: 'Pinned threads are important announcements that stay at the top of the forum. Locked threads cannot receive new replies (usually because the topic is closed or resolved).'
      },
      {
        question: 'How do I report inappropriate content?',
        answer: 'Currently, please contact us at contact@discoverdhaka.com with the thread/reply link and details. Our moderation team will review and take appropriate action.'
      },
      {
        question: 'Can I edit or delete my forum posts?',
        answer: 'Post editing is currently not available. To delete a post, please contact an admin. We recommend proofreading before posting!'
      }
    ],
    gamification: [
      {
        question: 'What is XP (Experience Points)?',
        answer: 'XP is a measure of your activity and contributions on Discover Dhaka. You earn XP by creating stories, attending events, writing reviews, participating in the forum, and more!'
      },
      {
        question: 'How do I earn XP?',
        answer: 'You earn XP through various actions:\n• Create a story: +50 XP\n• Create a route: +25 XP\n• Write a review: +10 XP\n• Attend an event: +15 XP\n• Post a comment: +5 XP'
      },
      {
        question: 'What are levels and how do they work?',
        answer: 'Your level is calculated based on your total XP. Level = (XP ÷ 100) + 1. For example, 0-99 XP = Level 1, 100-199 XP = Level 2, and so on.'
      },
      {
        question: 'What are badges and how do I earn them?',
        answer: 'Badges are achievements you unlock by completing specific milestones. Examples include "Explorer" (join the platform), "Storyteller" (share your first story), "Foodie" (visit 5 food places), and more!'
      },
      {
        question: 'Where can I see my XP and badges?',
        answer: 'Visit your profile page to see your current XP, level, level progress bar, and all earned badges in the "Badges" section.'
      },
      {
        question: 'Can I lose XP or badges?',
        answer: 'No! Once earned, XP and badges are permanent. However, content that violates our guidelines may be removed, and associated XP may be adjusted.'
      },
      {
        question: 'What\'s the highest level I can reach?',
        answer: 'There\'s no level cap! The more you explore, contribute, and engage with the community, the higher your level will climb.'
      }
    ],
    technical: [
      {
        question: 'The website is loading slowly. What should I do?',
        answer: 'Try these steps:\n1. Clear your browser cache and cookies\n2. Disable browser extensions temporarily\n3. Check your internet connection\n4. Try a different browser (Chrome, Firefox, or Edge)\n5. If the issue persists, contact us with details about your browser and operating system.'
      },
      {
        question: 'Images aren\'t loading. How do I fix this?',
        answer: 'First, check your internet connection. If other images on the web load fine, try refreshing the page (Ctrl+R or Cmd+R). If specific images still don\'t load, they may have been removed or there may be a temporary server issue.'
      },
      {
        question: 'I\'m getting an error when uploading images. Why?',
        answer: 'Make sure your image:\n• Is under 5MB in size\n• Is in JPG, PNG, GIF, or WEBP format\n• Has a valid filename (no special characters)\nIf it still doesn\'t work, try compressing the image or using a different file.'
      },
      {
        question: 'The map isn\'t showing up. What\'s wrong?',
        answer: 'This is usually a temporary loading issue. Try:\n1. Refreshing the page\n2. Clearing your browser cache\n3. Disabling ad blockers or privacy extensions\n4. Ensuring JavaScript is enabled in your browser'
      },
      {
        question: 'Can I use Discover Dhaka on mobile?',
        answer: 'Yes! The website is fully responsive and works on mobile browsers (Chrome, Safari, Firefox). We don\'t currently have a native mobile app, but the web version is optimized for mobile use.'
      },
      {
        question: 'Which browsers are supported?',
        answer: 'Discover Dhaka works best on modern browsers:\n• Chrome 90+\n• Firefox 88+\n• Safari 14+\n• Microsoft Edge 90+\nOlder browsers may not support all features.'
      },
      {
        question: 'I found a bug! How do I report it?',
        answer: 'We appreciate bug reports! Email us at contact@discoverdhaka.com with:\n• Description of the bug\n• Steps to reproduce it\n• Your browser and operating system\n• Screenshots if possible\nWe\'ll investigate and fix it as soon as possible!'
      }
    ]
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const filteredFAQs = searchQuery
    ? Object.values(faqs).flat().filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory];

  return (
    <div className="help-faq-page">
      {/* Header */}
      <div className="help-header">
        <div className="help-header-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>Help & FAQ</h1>
          <p>Find answers to common questions and get help with Discover Dhaka</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="help-search-section">
        <div className="help-search-container">
          <input
            type="text"
            className="help-search-input"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="help-search-icon">🔍</span>
        </div>
      </div>

      <div className="help-content">
        {/* Categories Sidebar */}
        {!searchQuery && (
          <div className="help-categories">
            <h3>Categories</h3>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${
                  activeCategory === category.id ? 'active' : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* FAQ List */}
        <div className="help-faq-list">
          {searchQuery && (
            <div className="search-results-header">
              <h2>
                Search Results for "{searchQuery}"
                <span className="results-count">
                  ({filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'})
                </span>
              </h2>
            </div>
          )}

          {!searchQuery && (
            <h2 className="faq-category-title">
              {categories.find((cat) => cat.id === activeCategory)?.icon}{' '}
              {categories.find((cat) => cat.id === activeCategory)?.name}
            </h2>
          )}

          {filteredFAQs.length === 0 ? (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
              <p>Try searching with different keywords or browse by category.</p>
            </div>
          ) : (
            <div className="faq-items">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${expandedFAQ === index ? 'expanded' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-toggle-icon">
                      {expandedFAQ === index ? '−' : '+'}
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="help-contact-section">
        <div className="help-contact-card">
          <h3>Still need help?</h3>
          <p>
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="contact-options">
            <div className="contact-option">
              <span className="contact-icon">📧</span>
              <div>
                <h4>Email Support</h4>
                <a href="mailto:contact@discoverdhaka.com">
                  contact@discoverdhaka.com
                </a>
              </div>
            </div>
            <div className="contact-option">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Phone Support</h4>
                <a href="tel:+8801234567890">+880 1234-567890</a>
              </div>
            </div>
          </div>
          <p className="response-time">
            We typically respond within 24-48 hours.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="help-quick-links">
        <h3>Quick Links</h3>
        <div className="quick-links-grid">
          <a href="/guidelines" className="quick-link-card">
            <span className="quick-link-icon">📜</span>
            <h4>Community Guidelines</h4>
            <p>Learn about our community rules and standards</p>
          </a>
          <a href="/privacy" className="quick-link-card">
            <span className="quick-link-icon">🔒</span>
            <h4>Privacy Policy</h4>
            <p>How we protect and use your data</p>
          </a>
          <a href="/terms" className="quick-link-card">
            <span className="quick-link-icon">📋</span>
            <h4>Terms of Service</h4>
            <p>Legal terms and conditions of use</p>
          </a>
          <a href="/about" className="quick-link-card">
            <span className="quick-link-icon">ℹ️</span>
            <h4>About Us</h4>
            <p>Learn more about Discover Dhaka</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpFAQ;
