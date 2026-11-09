import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_BUSINESSES,
  INITIAL_REVIEWS,
  CAMPAIGNS,
  SOCIAL_POSTS,
  INTEGRATIONS_LIST,
  SEO_KEYWORDS,
  COMPETITORS,
  PENDING_TASKS,
  NOTIFICATIONS
} from '../data/mockData';

const BusinessContext = createContext(null);

export const BusinessProvider = ({ children }) => {
  // Businesses
  const [businesses, setBusinesses] = useState(() => {
    const saved = localStorage.getItem('localboost_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [selectedBusinessId, setSelectedBusinessId] = useState(() => {
    const saved = localStorage.getItem('localboost_selected_biz_id');
    return saved || 'biz-1';
  });

  // Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('localboost_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Campaigns
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('localboost_campaigns');
    return saved ? JSON.parse(saved) : CAMPAIGNS;
  });

  // Social Posts
  const [socialPosts, setSocialPosts] = useState(() => {
    const saved = localStorage.getItem('localboost_social_posts');
    return saved ? JSON.parse(saved) : SOCIAL_POSTS;
  });

  // Integrations
  const [integrations, setIntegrations] = useState(() => {
    const saved = localStorage.getItem('localboost_integrations');
    return saved ? JSON.parse(saved) : INTEGRATIONS_LIST;
  });

  // Keywords
  const [keywords, setKeywords] = useState(() => {
    const saved = localStorage.getItem('localboost_keywords');
    return saved ? JSON.parse(saved) : SEO_KEYWORDS;
  });

  // Competitors
  const [competitors, setCompetitors] = useState(() => {
    const saved = localStorage.getItem('localboost_competitors');
    return saved ? JSON.parse(saved) : COMPETITORS;
  });

  // Tasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('localboost_tasks');
    return saved ? JSON.parse(saved) : PENDING_TASKS;
  });

  // Drafts
  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem('localboost_drafts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'draft-1',
        title: 'Special Diwali Family Offer 2026',
        category: 'Restaurant',
        type: 'Google Business Profile Post',
        content: '🪔 Celebrate the Festival of Lights with Sharma Restaurant! Enjoy 20% flat discount on all Pre-booked Family Thalis between Dhanteras and Bhai Dooj. Pure desi ghee delicacies made fresh for your family. Call 94520-81234 to book tables.',
        savedAt: 'Nov 02, 2026'
      }
    ];
  });

  // Plan
  const [currentPlan, setCurrentPlan] = useState(() => {
    const saved = localStorage.getItem('localboost_plan');
    return saved || 'growth';
  });

  // Date Range Filter
  const [dateRange, setDateRange] = useState('30d');

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('localboost_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('localboost_selected_biz_id', selectedBusinessId);
  }, [selectedBusinessId]);

  useEffect(() => {
    localStorage.setItem('localboost_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('localboost_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('localboost_social_posts', JSON.stringify(socialPosts));
  }, [socialPosts]);

  useEffect(() => {
    localStorage.setItem('localboost_integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('localboost_keywords', JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem('localboost_competitors', JSON.stringify(competitors));
  }, [competitors]);

  useEffect(() => {
    localStorage.setItem('localboost_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('localboost_drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('localboost_plan', currentPlan);
  }, [currentPlan]);

  // Current selected business object
  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId) || businesses[0] || INITIAL_BUSINESSES[0];

  // Actions
  const addBusiness = (newBiz) => {
    const id = `biz-${Date.now()}`;
    const formatted = {
      ...newBiz,
      id,
      rating: 4.5,
      totalReviews: 12,
      completionPercentage: 75,
      googleConnected: false,
      stats: {
        profileViews: 1200,
        profileViewsGrowth: 10.0,
        customerActions: 180,
        customerActionsGrowth: 8.5,
        phoneCalls: 45,
        phoneCallsGrowth: 5.0,
        directionRequests: 62,
        directionRequestsGrowth: 7.2,
        websiteClicks: 55,
        websiteClicksGrowth: 4.1,
      },
      seoScore: 70,
      profileCompletionScore: 75,
      responseRate: 80,
    };
    setBusinesses(prev => [formatted, ...prev]);
    setSelectedBusinessId(id);
    return formatted;
  };

  const updateBusiness = (id, patch) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));
  };

  const connectGoogleProfile = (bizId, email) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        return {
          ...b,
          googleConnected: true,
          googleAccountEmail: email || 'owner@gmail.com',
          completionPercentage: Math.min(100, (b.completionPercentage || 80) + 10)
        };
      }
      return b;
    }));
  };

  const disconnectGoogleProfile = (bizId) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        return {
          ...b,
          googleConnected: false,
          googleAccountEmail: ''
        };
      }
      return b;
    }));
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  // Review management actions
  const generateAIReply = (reviewId) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    let aiGenerated = '';
    if (review.rating >= 4) {
      aiGenerated = `Dear ${review.author}, thank you warmly for your wonderful ${review.rating}-star review of ${selectedBusiness.name}! We take immense pride in delivering top-notch hospitality in ${selectedBusiness.city}. We eagerly look forward to serving you again!`;
    } else if (review.rating === 3) {
      aiGenerated = `Hello ${review.author}, thank you for visiting ${selectedBusiness.name} and sharing your honest experience. We have noted your points regarding your recent visit and are actively working with our floor team to make your next experience a full 5-star one.`;
    } else {
      aiGenerated = `Dear ${review.author}, we sincerely regret that your recent experience at ${selectedBusiness.name} did not meet expectations. Customer satisfaction is our highest priority in ${selectedBusiness.city}. Please connect directly with our manager at ${selectedBusiness.phone} so we can make this right for you.`;
    }

    setReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      suggestedReply: aiGenerated,
      replyText: aiGenerated,
      replyStatus: 'Approved'
    } : r));
  };

  const updateReviewReplyText = (reviewId, text) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      replyText: text,
      replyStatus: 'Approved'
    } : r));
  };

  const publishReviewReply = (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      replyStatus: 'Published',
      replyDate: 'Just now'
    } : r));
  };

  const addKeyword = (keywordData) => {
    const id = `kw-${Date.now()}`;
    setKeywords(prev => [...prev, { id, ...keywordData }]);
  };

  const addCompetitor = (compData) => {
    const id = `comp-${Date.now()}`;
    setCompetitors(prev => [...prev, { id, isUser: false, ...compData }]);
  };

  const addCampaign = (campData) => {
    const id = `camp-${Date.now()}`;
    setCampaigns(prev => [
      {
        id,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        roas: 'N/A',
        ...campData
      },
      ...prev
    ]);
  };

  const addSocialPost = (postData) => {
    const id = `post-${Date.now()}`;
    setSocialPosts(prev => [
      {
        id,
        likes: 0,
        reach: 0,
        ...postData
      },
      ...prev
    ]);
  };

  const deleteSocialPost = (postId) => {
    setSocialPosts(prev => prev.filter(p => p.id !== postId));
  };

  const toggleIntegration = (integrationId) => {
    setIntegrations(prev => prev.map(integ => {
      if (integ.id === integrationId) {
        const nextState = !integ.connected;
        return {
          ...integ,
          connected: nextState,
          lastSync: nextState ? 'Just now' : 'Never',
          account: nextState ? (integ.account || 'Connected Account') : null
        };
      }
      return integ;
    }));
  };

  const saveDraft = (draftItem) => {
    const id = `draft-${Date.now()}`;
    const newDraft = {
      id,
      ...draftItem,
      savedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setDrafts(prev => [newDraft, ...prev]);
    return newDraft;
  };

  const deleteDraft = (draftId) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  return (
    <BusinessContext.Provider value={{
      businesses,
      selectedBusinessId,
      setSelectedBusinessId,
      selectedBusiness,
      addBusiness,
      updateBusiness,
      connectGoogleProfile,
      disconnectGoogleProfile,
      reviews,
      generateAIReply,
      updateReviewReplyText,
      publishReviewReply,
      campaigns,
      addCampaign,
      socialPosts,
      addSocialPost,
      deleteSocialPost,
      integrations,
      toggleIntegration,
      keywords,
      addKeyword,
      competitors,
      addCompetitor,
      tasks,
      toggleTask,
      drafts,
      saveDraft,
      deleteDraft,
      currentPlan,
      setCurrentPlan,
      dateRange,
      setDateRange,
      notifications: NOTIFICATIONS
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

