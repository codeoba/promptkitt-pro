/**
 * PromptKitt Pro - State Management & Storage Engine
 * Handles persistent state across Buyer, Seller, and Admin roles with LocalStorage sync,
 * Authentication (Login, Registration, Logout), User Profile, and Account Settings.
 */

class PKStore {
  constructor() {
    this.STORAGE_KEY = 'promptkitt_pro_state_v3';
    this.state = this.loadState();
    this.listeners = [];
  }

  getDefaultState() {
    return {
      currentRole: 'buyer', // 'buyer' | 'seller' | 'admin'
      theme: 'obsidian',
      isAuthenticated: true,
      user: {
        id: 'user_active_01',
        name: 'Jordan Sterling',
        username: 'jordan_ai',
        email: 'jordan@promptkitt.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        bio: 'Senior AI Engineer, Prompt Architect & Creative Technologist. Specializing in Midjourney v6.1 photorealism & Claude 3.5 software architectures.',
        location: 'San Francisco, CA',
        website: 'https://jordansterling.ai',
        socials: {
          twitter: '@jordan_ai',
          github: 'jordan-sterling',
          discord: 'jordan_ai#4092'
        },
        walletBalance: 128.50,
        credits: 450,
        isVip: true,
        vipPlan: 'PromptKitt Select VIP',
        vipRenewsAt: '2026-09-15',
        kycStatus: 'verified',
        twoFactorEnabled: true,
        apiKey: 'pk_live_98a72f10b83e491cba0987123ef',
        notificationSettings: {
          emailSales: true,
          emailBounties: true,
          emailVipDrops: true,
          marketingDigest: false
        }
      },
      registeredUsers: [
        {
          id: 'user_active_01',
          name: 'Jordan Sterling',
          username: 'jordan_ai',
          email: 'jordan@promptkitt.io',
          password: 'password123',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'seller'
        }
      ],
      cart: [],
      appliedCoupon: null,
      library: ['p4', 'p3'],
      favorites: ['p1', 'p3'],
      followingCreators: ['c1', 'c2'],
      orders: [
        {
          id: 'ord_98214',
          date: '2026-08-14',
          items: [{ id: 'p4', title: 'ChatGPT-4o Million-Dollar SaaS Landing Page & Cold Email Engine', price: 0.00 }],
          total: 0.00,
          paymentMethod: 'Free Acquire',
          status: 'completed'
        }
      ],
      refunds: [
        {
          id: 'ref_101',
          orderId: 'ord_98214',
          promptTitle: 'ChatGPT-4o Million-Dollar SaaS Landing Page',
          amount: 0.00,
          reason: 'Incompatible with local model setup',
          status: 'resolved',
          date: '2026-08-15'
        }
      ],
      currentCurrency: 'USD',
      apiKeys: [
        { id: 'key_1', name: 'Production Agent API Backend', key: 'pk_live_9f83a8b271c6d04e', created: '2 days ago', lastUsed: '5 mins ago', calls: 1420 },
        { id: 'key_2', name: 'Staging Next.js App Webhook', key: 'pk_test_3a8b91c0e5d412fe', created: '1 week ago', lastUsed: 'Yesterday', calls: 380 }
      ],
      activeMemberships: ['c1'],
      arenaVotes: {},
      sellerCoupons: [
        { id: 'coup_1', code: 'PROMPTPRO20', discountPercent: 20, uses: 45, maxUses: 100, active: true },
        { id: 'coup_2', code: 'VIP20', discountPercent: 20, uses: 112, maxUses: 500, active: true },
        { id: 'coup_3', code: 'FIRST50', discountPercent: 50, uses: 300, maxUses: 300, active: false }
      ],
      customPrompts: [],
      bounties: PK_DATA.bounties,
      bountySubmissions: [
        {
          id: 'sub_1',
          bountyId: 'b1',
          creatorUsername: 'NeuralAlchemist',
          creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          previewSnippet: 'Horology masterpiece, macro shot of Swiss automatic tourbillon...',
          sampleImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
          status: 'pending',
          submittedAt: '1 hour ago'
        }
      ],
      messages: [
        {
          id: 'chat_c1',
          contactName: 'NeuralAlchemist (Alex Rivers)',
          contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          online: true,
          unread: 1,
          messages: [
            { sender: 'buyer', text: 'Hi Alex! Loved your Cyber-Fashion portrait prompt. What is the best aspect ratio for Instagram reels?', time: '15m ago' },
            { sender: 'seller', text: 'Hey Jordan! Use --ar 9:16 for vertical reels and mobile screens. Enjoy!', time: '12m ago' },
            { sender: 'seller', text: 'Sure! You can adjust the --stylize parameter to 350 for more artistic flare.', time: '10m ago' }
          ]
        }
      ],
      notifications: [
        { id: 'notif_1', title: 'Order Confirmed', desc: 'ChatGPT SaaS Engine added to your Digital Vault.', time: '2h ago', read: false, icon: '🎉' },
        { id: 'notif_2', title: 'New VIP Drop', desc: '15 new Midjourney prompts unlocked in Select Vault.', time: '1d ago', read: true, icon: '⭐' }
      ],
      playgroundHistory: [
        {
          id: 'run_1',
          model: 'FLUX',
          prompt: 'Architectural Digest photograph of luxury penthouse living room overlooking misty pine forest at dawn...',
          outputImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
          time: '30m ago',
          cost: 2
        }
      ],
      sellerAnalytics: {
        totalRevenue: 4820.50,
        pendingPayout: 640.00,
        totalSales: 1240,
        conversionRate: '4.8%',
        promptsPublished: 14,
        payoutMethod: 'PayPal (jordan@promptkitt.io)'
      },
      adminQueue: [
        {
          id: 'rev_1',
          promptTitle: 'FLUX Hyper-realistic Microchip & Quantum Circuitry Macro',
          creatorName: 'QuantumRenderer',
          model: 'FLUX',
          price: 4.49,
          submittedAt: 'Today, 08:30 AM',
          template: 'Extreme macro photograph of quantum computer microchip with glowing neon pathways, hyper-detailed silicon wafer...',
          variables: ['chip_type', 'light_color'],
          status: 'pending_review'
        },
        {
          id: 'rev_2',
          promptTitle: 'Claude Enterprise Microservice Security Threat Modeler',
          creatorName: 'CyberGuard_AI',
          model: 'Claude',
          price: 6.99,
          submittedAt: 'Today, 09:15 AM',
          template: 'Act as a Principal Cybersecurity Architect. Perform a STRIDE threat modeling analysis on [system_spec]...',
          variables: ['system_spec', 'compliance_framework'],
          status: 'pending_review'
        }
      ],
      adminUsers: [
        { id: 'u_1', name: 'Alex Rivers', username: 'NeuralAlchemist', email: 'alex@alchemist.ai', role: 'PRO MASTER', credits: 1450, salesVolume: 24190.00, status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
        { id: 'u_2', name: 'Maya Chen', username: 'SyntaxSorcerer', email: 'maya@syntax.dev', role: 'TOP SELLER', credits: 820, salesVolume: 18430.00, status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
        { id: 'u_3', name: 'Marcus Vance', username: 'NeonDreamer', email: 'marcus@cyber.art', role: 'CREATOR', credits: 310, salesVolume: 6820.00, status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
        { id: 'u_4', name: 'Devin K.', username: 'devin_fullstack', email: 'devin@reactflow.io', role: 'BUYER', credits: 120, salesVolume: 0.00, status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
        { id: 'u_5', name: 'SpamBot_Test', username: 'free_crypto_99', email: 'spammer@temp.mail', role: 'BUYER', credits: 0, salesVolume: 0.00, status: 'Suspended', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }
      ],
      adminKycRequests: [
        { id: 'kyc_1', name: 'Jordan Sterling', username: 'jordan_ai', country: 'United States', documentName: 'passport_scan_verified_2026.pdf', matchScore: '99.4%', submittedAt: '2 hours ago', status: 'Pending Review' },
        { id: 'kyc_2', name: 'Elena Rostova', username: 'elena_design', country: 'Germany', documentName: 'national_id_card_de.pdf', matchScore: '98.8%', submittedAt: 'Yesterday', status: 'Pending Review' }
      ],
      adminPayoutRequests: [
        { id: 'PO-9841', sellerName: 'Jordan Sterling', method: 'PayPal', destination: 'jordan@promptkitt.io', amount: 640.00, status: 'Pending', date: 'Today, 10:20 AM' },
        { id: 'PO-9842', sellerName: 'Alex Rivers', method: 'Stripe Connect', destination: 'acct_1NZX8e29aL8K', amount: 1280.00, status: 'Pending', date: 'Today, 09:45 AM' },
        { id: 'PO-9839', sellerName: 'Maya Chen', method: 'Bank Wire SWIFT', destination: 'CH93 0000 0000 0000', amount: 950.00, status: 'Paid', date: 'Yesterday' }
      ],
      adminAuditLogs: [
        { id: 'log_1', timestamp: '2026-08-18 04:18:12', category: 'PAYOUT', event: 'PAYOUT_INITIATED', detail: 'Disbursement of $640.00 queued for Jordan Sterling (PO-9841)' },
        { id: 'log_2', timestamp: '2026-08-18 04:15:04', category: 'PROMPT_FACTORY', event: 'PROMPT_PUBLISH', detail: 'New prompt "Ultra-Realistic 8K Cyber-Fashion Portrait" published by NeuralAlchemist' },
        { id: 'log_3', timestamp: '2026-08-18 04:11:22', category: 'MODERATION', event: 'KYC_SUBMISSION', detail: 'Identity document passport_scan_verified_2026.pdf encrypted and queued' },
        { id: 'log_4', timestamp: '2026-08-18 03:50:19', category: 'AUTH', event: 'AUTH_SUCCESS', detail: 'Root Super Admin authenticated from IP 192.168.1.1 (MFA Verified)' },
        { id: 'log_5', timestamp: '2026-08-18 03:35:00', category: 'MODERATION', event: 'AI_SAFETY_PASS', detail: 'Automated toxicity and token density analyzer evaluated 18 submissions (0 flags)' }
      ],
      adminModelRegistry: [
        { id: 'midjourney', name: 'Midjourney', icon: '🎨', isEnabled: true, latencyMs: 142, activeListings: 142, status: 'Healthy' },
        { id: 'flux', name: 'FLUX', icon: '⚡', isEnabled: true, latencyMs: 118, activeListings: 98, status: 'Healthy' },
        { id: 'claude', name: 'Claude', icon: '🧠', isEnabled: true, latencyMs: 95, activeListings: 64, status: 'Healthy' },
        { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', isEnabled: true, latencyMs: 88, activeListings: 86, status: 'Healthy' },
        { id: 'deepseek', name: 'DeepSeek', icon: '🐋', isEnabled: true, latencyMs: 130, activeListings: 45, status: 'Healthy' },
        { id: 'gemini', name: 'Gemini', icon: '✨', isEnabled: true, latencyMs: 76, activeListings: 52, status: 'Healthy' },
        { id: 'stablediffusion', name: 'Stable Diffusion', icon: '🔮', isEnabled: true, latencyMs: 160, activeListings: 39, status: 'Healthy' },
        { id: 'runway', name: 'Runway', icon: '🎬', isEnabled: true, latencyMs: 310, activeListings: 42, status: 'Healthy' },
        { id: 'suno', name: 'Suno', icon: '🎵', isEnabled: true, latencyMs: 240, activeListings: 39, status: 'Healthy' }
      ],
      systemSettings: {
        platformCommissionRate: 15,
        minPayoutThreshold: 50,
        vipPoolShare: 70,
        vipSubscriptionFee: 19.00,
        defaultCurrency: 'USD',
        autoApproveVerifiedSellers: true
      }
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return Object.assign(this.getDefaultState(), JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse state', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Authentication System ---
  login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const found = this.state.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      this.state.isAuthenticated = true;
      this.state.user = Object.assign(this.state.user, found);
      this.saveState();
      return { success: true, user: this.state.user };
    }
    // If not found in seed list, log them in with standard session
    const newUser = {
      id: 'user_' + Date.now(),
      name: email.split('@')[0].replace('.', ' '),
      username: email.split('@')[0],
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      walletBalance: 50.00,
      credits: 200,
      isVip: false
    };
    this.state.isAuthenticated = true;
    this.state.user = Object.assign(this.state.user, newUser);
    this.state.registeredUsers.push(newUser);
    this.saveState();
    return { success: true, user: this.state.user };
  }

  register(name, username, email, password, role = 'buyer') {
    const cleanEmail = email.trim().toLowerCase();
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      username: username.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase(),
      email: cleanEmail,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      bio: `Hi! I'm ${name}, exploring AI prompt engineering and creative synthesis.`,
      location: 'Global',
      website: '',
      socials: { twitter: '', github: '', discord: '' },
      walletBalance: 0.00,
      credits: 100, // 100 free starter credits!
      isVip: false,
      kycStatus: 'unverified',
      apiKey: 'pk_live_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      twoFactorEnabled: false,
      notificationSettings: { emailSales: true, emailBounties: true, emailVipDrops: true, marketingDigest: true }
    };

    this.state.registeredUsers.push({ ...newUser, password });
    this.state.user = newUser;
    this.state.isAuthenticated = true;
    this.state.currentRole = role;
    this.saveState();
    return { success: true, user: newUser };
  }

  logout() {
    this.state.isAuthenticated = false;
    this.saveState();
  }

  // --- Profile & Settings Management ---
  updateProfile(profileData) {
    this.state.user = Object.assign(this.state.user, profileData);
    this.saveState();
    return this.state.user;
  }

  updateSecuritySettings(newPassword, enable2FA) {
    if (newPassword) {
      const userInDb = this.state.registeredUsers.find(u => u.id === this.state.user.id);
      if (userInDb) userInDb.password = newPassword;
    }
    this.state.user.twoFactorEnabled = enable2FA;
    this.saveState();
    return true;
  }

  updateNotificationSettings(settings) {
    this.state.user.notificationSettings = settings;
    this.saveState();
    return true;
  }

  generateNewApiKey() {
    this.state.user.apiKey = 'pk_live_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.saveState();
    return this.state.user.apiKey;
  }

  setRole(role) {
    this.state.currentRole = role;
    this.saveState();
  }

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.saveState();
  }

  // --- Cart Actions ---
  addToCart(item) {
    const exists = this.state.cart.some(c => c.id === item.id);
    if (!exists) {
      this.state.cart.push(item);
      this.saveState();
      return true;
    }
    return false;
  }

  removeFromCart(itemId) {
    this.state.cart = this.state.cart.filter(c => c.id !== itemId);
    this.saveState();
  }

  clearCart() {
    this.state.cart = [];
    this.state.appliedCoupon = null;
    this.saveState();
  }

  applyCoupon(code) {
    const clean = code.trim().toUpperCase();
    const found = this.state.sellerCoupons.find(c => c.code === clean && c.active);
    if (found) {
      this.state.appliedCoupon = { code: found.code, discountPercent: found.discountPercent };
      found.uses += 1;
      this.saveState();
      return { success: true, message: `Coupon applied! ${found.discountPercent}% OFF your entire cart.` };
    }
    return { success: false, message: 'Invalid or inactive coupon code.' };
  }

  removeCoupon() {
    this.state.appliedCoupon = null;
    this.saveState();
  }

  getCartTotal() {
    let subtotal = this.state.cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    let discount = 0;
    if (this.state.user && this.state.user.isVip) {
      discount += subtotal * (this.state.systemSettings.vipDiscountRate / 100);
    }
    if (this.state.appliedCoupon) {
      discount += subtotal * (this.state.appliedCoupon.discountPercent / 100);
    }
    discount = Math.min(discount, subtotal);
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total };
  }

  // --- Library / Digital Vault ---
  unlockPrompt(promptId, method = 'Purchase') {
    if (!this.state.library.includes(promptId)) {
      this.state.library.push(promptId);
      this.state.notifications.unshift({
        id: 'notif_' + Date.now(),
        title: 'Prompt Unlocked',
        desc: `Prompt has been permanently added to your Digital Vault (${method}).`,
        time: 'Just now',
        read: false,
        icon: '🔓'
      });
      this.saveState();
      return true;
    }
    return false;
  }

  isUnlocked(promptId) {
    return this.state.library.includes(promptId);
  }

  toggleFavorite(promptId) {
    if (this.state.favorites.includes(promptId)) {
      this.state.favorites = this.state.favorites.filter(id => id !== promptId);
    } else {
      this.state.favorites.push(promptId);
    }
    this.saveState();
  }

  isFavorite(promptId) {
    return this.state.favorites.includes(promptId);
  }

  toggleFollowCreator(creatorId) {
    if (this.state.followingCreators.includes(creatorId)) {
      this.state.followingCreators = this.state.followingCreators.filter(id => id !== creatorId);
    } else {
      this.state.followingCreators.push(creatorId);
    }
    this.saveState();
  }

  isFollowingCreator(creatorId) {
    return this.state.followingCreators.includes(creatorId);
  }

  deductCredits(amount) {
    if (this.state.user && this.state.user.credits >= amount) {
      this.state.user.credits -= amount;
      this.saveState();
      return true;
    }
    return false;
  }

  addCredits(amount) {
    if (this.state.user) {
      this.state.user.credits += amount;
      this.saveState();
    }
  }

  // --- Reviews & Upvotes ---
  addReview(promptId, rating, comment) {
    const allPrompts = [...PK_DATA.prompts, ...this.state.customPrompts];
    const p = allPrompts.find(item => item.id === promptId);
    if (p) {
      if (!p.reviews) p.reviews = [];
      p.reviews.unshift({
        id: 'rev_' + Date.now(),
        author: this.state.user ? this.state.user.name : 'Verified Buyer',
        rating: parseInt(rating),
        time: 'Just now',
        comment,
        upvotes: 0
      });
      p.reviewsCount = (p.reviewsCount || 0) + 1;
      this.saveState();
      return true;
    }
    return false;
  }

  upvoteReview(promptId, reviewId) {
    const allPrompts = [...PK_DATA.prompts, ...this.state.customPrompts];
    const p = allPrompts.find(item => item.id === promptId);
    if (p && p.reviews) {
      const r = p.reviews.find(rev => rev.id === reviewId);
      if (r) {
        r.upvotes = (r.upvotes || 0) + 1;
        this.saveState();
      }
    }
  }

  // --- Refunds System ---
  requestRefund(orderId, promptTitle, amount, reason) {
    const ref = {
      id: 'ref_' + Date.now(),
      orderId,
      promptTitle,
      amount: parseFloat(amount) || 0.00,
      reason,
      status: 'pending_review',
      date: 'Today'
    };
    this.state.refunds.unshift(ref);
    this.saveState();
    return ref;
  }

  // --- Creator Tip Jar ---
  sendTip(creatorId, amount) {
    const num = parseFloat(amount);
    if (num > 0) {
      this.state.notifications.unshift({
        id: 'notif_' + Date.now(),
        title: 'Tip Sent',
        desc: `You sent a tip of $${num.toFixed(2)} to creator!`,
        time: 'Just now',
        read: false,
        icon: '💖'
      });
      this.saveState();
      return true;
    }
    return false;
  }

  // --- Chat Messages ---
  sendMessage(conversationId, text) {
    let conv = this.state.chatConversations.find(c => c.id === conversationId);
    if (!conv) {
      conv = {
        id: conversationId,
        creatorName: 'AI Seller Support',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lastMessage: text,
        lastTime: 'Just now',
        unread: 0,
        messages: []
      };
      this.state.chatConversations.push(conv);
    }
    conv.messages.push({ sender: 'buyer', text, time: 'Just now' });
    conv.lastMessage = text;
    conv.lastTime = 'Just now';
    this.saveState();

    setTimeout(() => {
      conv.messages.push({
        sender: 'seller',
        text: 'Thanks for your message! If you need customized parameters or higher resolution variations, feel free to let me know.',
        time: 'Just now'
      });
      conv.lastMessage = 'Thanks for your message!...';
      conv.unread = (conv.unread || 0) + 1;
      this.saveState();
    }, 1200);
  }

  // --- Seller Management ---
  createSellerPrompt(promptData) {
    const newPrompt = {
      id: 'p_custom_' + Date.now(),
      slug: promptData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...promptData,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      creatorId: 'c1',
      qualityScore: this.calculatePromptQuality(promptData.template || promptData.description)
    };
    this.state.customPrompts.unshift(newPrompt);
    this.state.adminQueue.unshift({
      id: 'rev_' + Date.now(),
      promptTitle: newPrompt.title,
      creatorName: this.state.user ? this.state.user.name : 'Creator',
      model: newPrompt.modelId,
      price: newPrompt.price,
      submittedAt: 'Just now',
      status: 'pending_review'
    });
    this.state.sellerAnalytics.promptsPublished += 1;
    this.saveState();
    return newPrompt;
  }

  addSellerCoupon(code, discountPercent, maxUses) {
    const coupon = {
      id: 'coup_' + Date.now(),
      code: code.trim().toUpperCase(),
      discountPercent: parseInt(discountPercent),
      uses: 0,
      maxUses: parseInt(maxUses) || 100,
      active: true
    };
    this.state.sellerCoupons.unshift(coupon);
    this.saveState();
    return coupon;
  }

  toggleSellerCoupon(id) {
    const c = this.state.sellerCoupons.find(item => item.id === id);
    if (c) {
      c.active = !c.active;
      this.saveState();
    }
  }

  // --- Custom Bounty Submission ---
  submitBountyProposal(bountyId, snippet, sampleImg) {
    const sub = {
      id: 'sub_' + Date.now(),
      bountyId,
      creatorUsername: this.state.user ? this.state.user.username : 'Creator',
      creatorAvatar: this.state.user ? this.state.user.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      previewSnippet: snippet,
      sampleImage: sampleImg || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      status: 'pending',
      submittedAt: 'Just now'
    };
    this.state.bountySubmissions.unshift(sub);
    const b = this.state.bounties.find(item => item.id === bountyId);
    if (b) b.submissionsCount = (b.submissionsCount || 0) + 1;
    this.saveState();
    return sub;
  }

  calculatePromptQuality(text) {
    if (!text || text.length < 15) return 45;
    let score = 50;
    if (text.length > 50) score += 15;
    if (text.length > 150) score += 10;
    if (text.includes('--v') || text.includes('--ar') || text.includes('CFG') || text.includes('Steps')) score += 10;
    if (text.includes('[') && text.includes(']')) score += 10;
    if (/photorealistic|cinematic|octane|8k|volumetric|studio|sharp/i.test(text)) score += 5;
    return Math.min(score, 99);
  }

  magicExpandPrompt(shortIdea, model = 'midjourney') {
    const clean = shortIdea.trim();
    if (!clean) return 'Please enter an idea to expand.';

    if (model === 'midjourney' || model === 'flux' || model === 'stablediffusion') {
      return `Award-winning master photography of [subject: ${clean}], dramatic volumetric cinematic lighting with subtle atmospheric haze, shot on Hasselblad H6D-100c 85mm f/1.2 lens, shallow depth of field, raytraced subsurface scattering, hyper-detailed textures, photorealistic color grading --v 6.1 --ar 16:9 --style raw --stylize 250`;
    } else if (model === 'claude' || model === 'chatgpt') {
      return `Act as a Principal Staff AI Architect and Senior Technical Lead. 

MISSION: Deliver a complete, production-grade, and enterprise-hardened solution for:
"${clean}"

REQUIREMENTS:
1. Provide fully typed, modular, and optimized code with zero placeholders or skipped sections.
2. Implement strict error handling, edge-case validation, and performance caching.
3. Include comprehensive test suites (Unit & Integration) with 100% boundary coverage.
4. Document architecture decisions, data structures, and security considerations.`;
    } else {
      return `High-fidelity cinematic output for: ${clean}. Ultra-high resolution, crystal clear rendering, optimal parameter configuration and rich contextual cues.`;
    }
  }

  // =========================================================================
  // SUPER ADMIN STORE ACTIONS & REAL STATE MUTATIONS
  // =========================================================================
  adminAddAuditLog(category, event, detail) {
    const log = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category,
      event,
      detail
    };
    if (!this.state.adminAuditLogs) this.state.adminAuditLogs = [];
    this.state.adminAuditLogs.unshift(log);
    this.saveState();
    return log;
  }

  adminApprovePrompt(id) {
    const idx = this.state.adminQueue.findIndex(item => item.id === id);
    if (idx !== -1) {
      const item = this.state.adminQueue[idx];
      this.state.adminQueue.splice(idx, 1);

      // Add to customPrompts or active marketplace
      this.state.customPrompts.push({
        id: 'p_approved_' + Date.now(),
        title: item.promptTitle,
        modelId: item.model.toLowerCase(),
        category: 'photorealistic',
        price: item.price,
        template: item.template || 'Master prompt template verified by Super Admin.',
        instructions: 'Standard model parameters verified.',
        description: 'Certified master prompt reviewed and approved by Platform Moderation.',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        qualityScore: 98,
        rating: 5.0,
        reviewsCount: 0,
        salesCount: 0,
        isFeatured: false
      });

      this.adminAddAuditLog('MODERATION', 'PROMPT_APPROVED', `Approved prompt "${item.promptTitle}" for marketplace catalog`);
      this.saveState();
      return true;
    }
    return false;
  }

  adminRejectPrompt(id, reason) {
    const idx = this.state.adminQueue.findIndex(item => item.id === id);
    if (idx !== -1) {
      const item = this.state.adminQueue[idx];
      this.state.adminQueue.splice(idx, 1);
      this.adminAddAuditLog('MODERATION', 'PROMPT_REJECTED', `Rejected "${item.promptTitle}". Reason: ${reason}`);
      this.saveState();
      return true;
    }
    return false;
  }

  adminFeaturePrompt(id) {
    this.adminApprovePrompt(id);
    const lastPrompt = this.state.customPrompts[this.state.customPrompts.length - 1];
    if (lastPrompt) {
      lastPrompt.isFeatured = true;
      this.adminAddAuditLog('MODERATION', 'PROMPT_FEATURED', `Featured prompt "${lastPrompt.title}" on homepage carousel`);
      this.saveState();
    }
    return true;
  }

  adminToggleUserStatus(userId) {
    const user = this.state.adminUsers.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'Active' ? 'Suspended' : 'Active';
      this.adminAddAuditLog('RBAC', 'USER_STATUS_CHANGE', `User ${user.name} status updated to ${user.status}`);
      this.saveState();
      return user.status;
    }
    return 'Unknown';
  }

  adminGrantUserCredits(userId, amount) {
    const user = this.state.adminUsers.find(u => u.id === userId);
    if (user) {
      user.credits = (user.credits || 0) + amount;
      this.adminAddAuditLog('RBAC', 'CREDITS_GRANTED', `Granted +${amount}⚡ credits to ${user.name} (New balance: ${user.credits}⚡)`);
      this.saveState();
      return user.credits;
    }
    return 0;
  }

  adminChangeUserRole(userId, newRole) {
    const user = this.state.adminUsers.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.adminAddAuditLog('RBAC', 'ROLE_ELEVATION', `Elevated ${user.name} to role: ${newRole}`);
      this.saveState();
      return true;
    }
    return false;
  }

  adminApproveKyc(kycId) {
    const req = this.state.adminKycRequests.find(k => k.id === kycId);
    if (req) {
      req.status = 'Approved (Certified)';
      this.adminAddAuditLog('KYC', 'KYC_APPROVED', `Approved KYC for ${req.name} (${req.country})`);
      this.saveState();
      return true;
    }
    return false;
  }

  adminDisbursePayout(payoutId) {
    const p = this.state.adminPayoutRequests.find(item => item.id === payoutId);
    if (p && p.status !== 'Paid') {
      p.status = 'Paid';
      this.adminAddAuditLog('PAYOUT', 'PAYOUT_DISBURSED', `Disbursed $${p.amount.toFixed(2)} via ${p.method} to ${p.destination}`);
      this.saveState();
      return true;
    }
    return false;
  }

  adminDisburseAllPayouts() {
    let count = 0;
    let total = 0;
    this.state.adminPayoutRequests.forEach(p => {
      if (p.status !== 'Paid') {
        p.status = 'Paid';
        total += p.amount;
        count++;
      }
    });
    this.adminAddAuditLog('PAYOUT', 'BATCH_PAYOUT_DISBURSED', `Disbursed ${count} pending payouts totaling $${total.toFixed(2)}`);
    this.saveState();
    return { count, total };
  }

  adminUpdateEconomics(rate, minPayout) {
    this.state.systemSettings.platformCommissionRate = parseInt(rate);
    this.state.systemSettings.minPayoutThreshold = parseFloat(minPayout);
    this.adminAddAuditLog('ECONOMICS', 'COMMISSION_UPDATE', `Updated global platform commission to ${rate}% and min payout to $${minPayout}`);
    this.saveState();
  }

  adminToggleModelEngine(modelId) {
    const m = this.state.adminModelRegistry.find(item => item.id === modelId);
    if (m) {
      m.isEnabled = !m.isEnabled;
      this.adminAddAuditLog('MODELS', 'MODEL_GATEWAY_TOGGLE', `${m.name} Gateway state set to: ${m.isEnabled ? 'ENABLED' : 'DISABLED'}`);
      this.saveState();
      return m.isEnabled;
    }
    return false;
  }

  // =========================================================================
  // ENTERPRISE MODULES STORE METHODS
  // =========================================================================
  setCurrency(currencyCode) {
    if (PK_DATA.currencyRates[currencyCode]) {
      this.state.currentCurrency = currencyCode;
      this.saveState();
    }
  }

  formatPrice(priceInUSD) {
    const code = this.state.currentCurrency || 'USD';
    const curr = PK_DATA.currencyRates[code] || PK_DATA.currencyRates.USD;
    const converted = priceInUSD * curr.rate;

    if (priceInUSD === 0) return 'FREE';
    if (code === 'TZS') {
      return `${curr.symbol}${Math.round(converted).toLocaleString('en-US')}`;
    } else if (code === 'KES') {
      return `${curr.symbol}${Math.round(converted).toLocaleString('en-US')}`;
    } else {
      return `${curr.symbol}${converted.toFixed(2)}`;
    }
  }

  createApiKey(name) {
    const newKey = {
      id: 'key_' + Date.now(),
      name: name || 'Enterprise API Token',
      key: 'pk_live_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10),
      created: 'Just now',
      lastUsed: 'Never',
      calls: 0
    };
    if (!this.state.apiKeys) this.state.apiKeys = [];
    this.state.apiKeys.unshift(newKey);
    this.saveState();
    return newKey;
  }

  revokeApiKey(keyId) {
    if (this.state.apiKeys) {
      this.state.apiKeys = this.state.apiKeys.filter(k => k.id !== keyId);
      this.saveState();
    }
  }

  voteArenaMatch(matchId, choice) {
    if (!this.state.arenaVotes) this.state.arenaVotes = {};
    this.state.arenaVotes[matchId] = choice;
    this.saveState();
  }

  toggleCreatorMembership(creatorId) {
    if (!this.state.activeMemberships) this.state.activeMemberships = [];
    const idx = this.state.activeMemberships.indexOf(creatorId);
    if (idx !== -1) {
      this.state.activeMemberships.splice(idx, 1);
    } else {
      this.state.activeMemberships.push(creatorId);
    }
    this.saveState();
    return this.state.activeMemberships.includes(creatorId);
  }
}

window.pkStore = new PKStore();
