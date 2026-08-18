/**
 * PromptKitt Pro - Main Application Logic & Reactive Controller
 * Implements comprehensive UI for Authentication (Login/Register/Logout),
 * User Profile & Public Portfolios, Account Settings, Categories, Goals,
 * Reviews, Bounties, Multi-Step Wizards, Payouts, KYC, and Admin AI Studio.
 */

class PromptKittApp {
  constructor() {
    this.currentRoute = 'home';
    this.routeParams = {};
    this.activeFilterModel = 'all';
    this.activeFilterCategory = 'all';
    this.activeSortOrder = 'featured';
    this.searchQuery = '';
    this.activeSettingsTab = 'profile';
    this.activeProfileTab = 'vault';
    this.init();
  }

  init() {
    pkStore.subscribe(() => {
      this.updateCounters();
      this.renderCurrentView();
    });

    const currentTheme = pkStore.state.theme || 'obsidian';
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = currentTheme;

    window.addEventListener('hashchange', () => this.handleHashRoute());
    window.addEventListener('click', (e) => {
      if (!e.target.closest('.user-dropdown-wrap')) {
        document.getElementById('userDropdownMenu')?.classList.remove('show');
      }
    });

    this.handleHashRoute();
    this.updateCounters();
  }

  handleHashRoute() {
    const hash = window.location.hash.replace(/^#/, '') || 'home';
    const parts = hash.split('/');
    const route = parts[0] || 'home';
    const param = parts[1] || null;

    this.routeParams = { id: param, slug: param };

    if (route === 'admin-dashboard') {
      if (param) {
        this.currentAdminTab = (param === 'autonomous') ? 'batch-studio' : param;
      } else {
        this.currentAdminTab = this.currentAdminTab || 'queue';
      }
      pkStore.state.currentRole = 'admin';
    }

    this.navigate(route, false);
  }

  navigate(route, updateHash = true) {
    this.currentRoute = route;
    if (updateHash) {
      if (route === 'admin-dashboard' && this.currentAdminTab) {
        const tabParam = this.currentAdminTab === 'batch-studio' ? 'autonomous' : this.currentAdminTab;
        window.location.hash = `admin-dashboard/${tabParam}`;
      } else {
        window.location.hash = this.routeParams.id ? `${route}/${this.routeParams.id}` : route;
      }
    }
    this.updateNavLinks();
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateNavLinks() {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (this.currentRoute === 'home') document.getElementById('navHome')?.classList.add('active');
    else if (this.currentRoute === 'explore') document.getElementById('navExplore')?.classList.add('active');
    else if (this.currentRoute === 'workflows' || this.currentRoute === 'chains') document.getElementById('navWorkflows')?.classList.add('active');
    else if (this.currentRoute === 'arena') document.getElementById('navArena')?.classList.add('active');
    else if (this.currentRoute === 'playground') document.getElementById('navPlayground')?.classList.add('active');
    else if (this.currentRoute === 'optimizer') document.getElementById('navOptimizer')?.classList.add('active');
    else if (this.currentRoute === 'developer' || this.currentRoute === 'api') document.getElementById('navDeveloper')?.classList.add('active');
    else if (this.currentRoute === 'categories') document.getElementById('navCategories')?.classList.add('active');
    else if (this.currentRoute === 'goals') document.getElementById('navGoals')?.classList.add('active');
    else if (this.currentRoute === 'bounties') document.getElementById('navBounties')?.classList.add('active');
    else if (this.currentRoute === 'profile') document.getElementById('navProfile')?.classList.add('active');
    else if (this.currentRoute === 'settings') document.getElementById('navSettings')?.classList.add('active');
    else if (this.currentRoute === 'select') document.getElementById('navSelect')?.classList.add('active');
  }

  updateCounters() {
    const state = pkStore.state || {};
    this.updateHeaderAuth();

    const notifBadge = document.getElementById('unreadNotifCount');
    const unreadNotifs = (state.notifications || []).filter(n => !n.read).length;
    if (notifBadge) notifBadge.innerText = unreadNotifs;

    const msgBadge = document.getElementById('unreadMsgCount');
    const unreadMsgs = (state.chatConversations || []).reduce((sum, c) => sum + (c.unread || 0), 0);
    if (msgBadge) msgBadge.innerText = unreadMsgs;

    ['Buyer', 'Seller', 'Admin'].forEach(r => {
      const btn = document.getElementById(`roleBtn${r}`);
      if (btn) {
        if (state.currentRole === r.toLowerCase()) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });
  }

  updateHeaderAuth() {
    const container = document.getElementById('navActionsContainer');
    if (!container) return;
    const state = pkStore.state;
    const curr = state.currentCurrency || 'USD';

    const currencySelectHtml = `
      <!-- Global Multi-Currency Switcher -->
      <select class="form-select" id="headerCurrencySelect" style="padding: 5px 8px; font-size: 0.78rem; font-weight: 700; width: auto; background: var(--bg-card); border-color: var(--border-subtle);" onchange="app.handleCurrencyChange(this.value)" title="Change Marketplace Currency">
        <option value="USD" ${curr === 'USD' ? 'selected' : ''}>🇺🇸 USD ($)</option>
        <option value="TZS" ${curr === 'TZS' ? 'selected' : ''}>🇹🇿 TZS (TSh)</option>
        <option value="KES" ${curr === 'KES' ? 'selected' : ''}>🇰🇪 KES (KSh)</option>
        <option value="EUR" ${curr === 'EUR' ? 'selected' : ''}>🇪🇺 EUR (€)</option>
        <option value="GBP" ${curr === 'GBP' ? 'selected' : ''}>🇬🇧 GBP (£)</option>
        <option value="USDT" ${curr === 'USDT' ? 'selected' : ''}>🪙 USDT (₮)</option>
      </select>
    `;

    if (state.isAuthenticated && state.user) {
      container.innerHTML = `
        ${currencySelectHtml}

        <!-- Direct Chat Messages -->
        <button class="icon-btn" onclick="app.openChatDrawer()" title="Direct Messages">
          <i class="ph-bold ph-chat-centered-text" style="font-size: 1.25rem;"></i>
          <span class="icon-badge-counter" id="unreadMsgCount">1</span>
        </button>

        <!-- Notifications -->
        <button class="icon-btn" onclick="app.openNotificationsDrawer()" title="Notifications">
          <i class="ph-bold ph-bell" style="font-size: 1.25rem;"></i>
          <span class="icon-badge-counter" id="unreadNotifCount">1</span>
        </button>

        <!-- Shopping Cart -->
        <button class="icon-btn" onclick="app.openCartDrawer()" title="Cart">
          <i class="ph-bold ph-shopping-cart-simple" style="font-size: 1.25rem;"></i>
          <span class="icon-badge-counter" id="cartBadgeCount">${state.cart.length}</span>
        </button>

        <!-- Profile Avatar & Dropdown Menu -->
        <div class="user-dropdown-wrap">
          <div class="user-avatar-trigger" onclick="app.toggleUserDropdown(event)" title="Account Menu">
            <img src="${state.user.avatar}" alt="${state.user.name}" class="user-avatar-img">
            <span class="user-avatar-online-dot"></span>
          </div>

          <div class="user-dropdown-menu" id="userDropdownMenu">
            <div style="padding: 12px 14px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 6px;">
              <strong style="font-size: 0.95rem; display: block; color: var(--text-primary);">${state.user.name}</strong>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">@${state.user.username}</span>
                <span class="nav-pill-badge" style="font-size: 0.68rem; padding: 1px 6px;">⚡ ${state.user.credits} Credits</span>
              </div>
            </div>
            <a href="#profile" class="user-dropdown-item" onclick="app.navigate('profile')"><i class="ph-bold ph-user-circle"></i> My Public Profile</a>
            <a href="#settings" class="user-dropdown-item" onclick="app.navigate('settings')"><i class="ph-bold ph-gear"></i> Account Settings</a>
            <a href="#library" class="user-dropdown-item" onclick="app.navigate('library')"><i class="ph-bold ph-vault"></i> My Digital Vault (${state.library.length})</a>
            <a href="#developer" class="user-dropdown-item" onclick="app.navigate('developer')"><i class="ph-bold ph-code"></i> Developer API & Keys</a>
            <a href="#seller-dashboard" class="user-dropdown-item" onclick="app.switchRole('seller')"><i class="ph-bold ph-storefront"></i> Seller Studio</a>
            <a href="#create-prompt" class="user-dropdown-item" onclick="app.navigate('create-prompt')"><i class="ph-bold ph-plus-circle"></i> Create Master Prompt</a>
            <a href="#admin-dashboard" class="user-dropdown-item" onclick="app.switchRole('admin')"><i class="ph-bold ph-shield-check" style="color: #f43f5e;"></i> Super Admin Suite</a>
            <a href="#select" class="user-dropdown-item" onclick="app.navigate('select')"><i class="ph-bold ph-crown" style="color: #f59e0b;"></i> Select VIP</a>
            <div style="height: 1px; background: var(--border-subtle); margin: 6px 0;"></div>
            <div class="user-dropdown-item danger" onclick="app.handleLogout()"><i class="ph-bold ph-sign-out"></i> Log Out</div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        ${currencySelectHtml}

        <!-- Shopping Cart -->
        <button class="icon-btn" onclick="app.openCartDrawer()" title="Cart">
          <i class="ph-bold ph-shopping-cart-simple" style="font-size: 1.25rem;"></i>
          <span class="icon-badge-counter" id="cartBadgeCount">${state.cart.length}</span>
        </button>

        <button class="btn btn-secondary btn-sm" onclick="app.openAuthModal('login')">
          <i class="ph-bold ph-sign-in"></i> Sign In
        </button>

        <button class="btn btn-primary btn-sm" onclick="app.openAuthModal('register')">
          <i class="ph-bold ph-user-plus"></i> Join Free (100⚡)
        </button>
      `;
    }
  }

  handleCurrencyChange(newCurrency) {
    pkStore.setCurrency(newCurrency);
    this.showToast(`Marketplace currency updated to ${newCurrency}.`, 'success');
    this.renderCurrentView();
  }

  toggleUserDropdown(e) {
    e.stopPropagation();
    document.getElementById('userDropdownMenu')?.classList.toggle('show');
  }

  switchRole(role) {
    pkStore.setRole(role);
    this.showToast(`Switched view to ${role.toUpperCase()} mode.`, 'success');
    if (role === 'seller') this.navigate('seller-dashboard');
    else if (role === 'admin') this.navigate('admin-dashboard');
    else this.navigate('home');
  }

  switchTheme(theme) {
    pkStore.setTheme(theme);
    this.showToast(`Theme updated to ${theme.toUpperCase()}.`, 'success');
  }

  handleSearchInput(val) {
    this.searchQuery = val.trim().toLowerCase();
    if (this.currentRoute !== 'explore') {
      this.navigate('explore');
    } else {
      this.renderExplore();
    }
  }

  filterByModel(modelId) {
    this.activeFilterModel = modelId;
    this.activeFilterCategory = 'all';
    if (this.currentRoute !== 'explore') {
      this.navigate('explore');
    } else {
      this.renderExplore();
    }
  }

  filterByCategory(catId) {
    this.activeFilterCategory = catId;
    this.activeFilterModel = 'all';
    this.navigate('explore');
  }

  handleSortChange(order) {
    this.activeSortOrder = order;
    this.renderExplore();
    this.showToast(`Sorted prompts by ${order.replace('_', ' ')}.`, 'success');
  }

  // =========================================================================
  // Master View Renderer
  // =========================================================================
  renderCurrentView() {
    const container = document.getElementById('appContent');
    if (!container) return;

    const role = pkStore.state.currentRole;

    if (this.currentRoute === 'seller-dashboard') {
      pkStore.state.currentRole = 'seller';
      this.renderSellerDashboard(container);
      return;
    }

    if (this.currentRoute === 'admin-dashboard') {
      pkStore.state.currentRole = 'admin';
      this.renderAdminDashboard(container);
      return;
    }

    switch (this.currentRoute) {
      case 'home':
        this.renderHome(container);
        break;
      case 'explore':
        this.renderExplore(container);
        break;
      case 'categories':
        this.renderCategories(container);
        break;
      case 'goals':
        this.renderGoals(container);
        break;
      case 'login':
        this.renderAuthPage(container, 'login');
        break;
      case 'register':
        this.renderAuthPage(container, 'register');
        break;
      case 'profile':
        this.renderProfile(container, this.routeParams.id);
        break;
      case 'settings':
        this.renderSettings(container);
        break;
      case 'creator':
        this.renderCreatorProfile(container, this.routeParams.id);
        break;
      case 'prompt-detail':
        this.renderPromptDetail(container, this.routeParams.id);
        break;
      case 'workflows':
      case 'chains':
        this.renderWorkflows(container);
        break;
      case 'arena':
        this.renderArena(container);
        break;
      case 'optimizer':
        this.renderOptimizer(container);
        break;
      case 'developer':
      case 'api':
        this.renderDeveloper(container);
        break;
      case 'license':
        this.renderLicenseCertificate(container, this.routeParams.id);
        break;
      case 'playground':
        this.renderPlayground(container);
        break;
      case 'bounties':
        this.renderBounties(container);
        break;
      case 'collections':
        this.renderCollections(container);
        break;
      case 'select':
        this.renderSelectVip(container);
        break;
      case 'library':
        this.renderLibrary(container);
        break;
      case 'create-prompt':
      case 'create':
        this.renderCreatePromptPage(container);
        break;
      case 'seller-dashboard':
        this.renderSellerDashboard(container);
        break;
      case 'admin-dashboard':
        this.renderAdminDashboard(container);
        break;
      default:
        this.renderHome(container);
    }
  }

  // =========================================================================
  // DEDICATED FULL-PAGE AUTH VIEW (`#login` / `#register`)
  // =========================================================================
  renderAuthPage(container, tab = 'login') {
    container.innerHTML = `
      <div class="container" style="padding: 50px 20px 80px; max-width: 540px; margin: 0 auto;">
        <div class="settings-card" style="padding: 36px; box-shadow: var(--shadow-lg), 0 0 30px var(--accent-primary-glow);">
          <div style="text-align: center; margin-bottom: 26px;">
            <div class="logo-icon-wrap" style="width: 52px; height: 52px; margin: 0 auto 14px; font-size: 1.8rem;">
              <i class="ph-fill ph-cat"></i>
            </div>
            <h1 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; margin-bottom: 6px;">
              ${tab === 'login' ? 'Sign In to PromptKitt' : 'Create Your Free Account'}
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
              ${tab === 'login' ? 'Welcome back! Access your digital vault, sellers studio, and live sandboxes.' : 'Join over 25,000+ AI engineers and receive 100 Free GPU Generation Credits.'}
            </p>
          </div>

          <!-- Tab Switcher -->
          <div style="display: flex; gap: 10px; background: var(--bg-primary); padding: 4px; border-radius: var(--radius-full); margin-bottom: 24px; border: 1px solid var(--border-subtle);">
            <button class="btn btn-sm ${tab === 'login' ? 'btn-primary' : 'btn-ghost'}" style="flex: 1; border-radius: var(--radius-full);" onclick="app.navigate('login')">
              <i class="ph-bold ph-sign-in"></i> Sign In
            </button>
            <button class="btn btn-sm ${tab === 'register' ? 'btn-primary' : 'btn-ghost'}" style="flex: 1; border-radius: var(--radius-full);" onclick="app.navigate('register')">
              <i class="ph-bold ph-user-plus"></i> Join Free (100⚡)
            </button>
          </div>

          <!-- Quick Social OAuth -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 22px;">
            <button class="btn btn-secondary" onclick="app.handleSocialAuth('Google')">
              <i class="ph-bold ph-google-logo" style="color: #ea4335;"></i> Google
            </button>
            <button class="btn btn-secondary" onclick="app.handleSocialAuth('GitHub')">
              <i class="ph-bold ph-github-logo"></i> GitHub
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 22px;">
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
            <span style="font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase;">Or with email address</span>
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
          </div>

          ${tab === 'login' ? `
            <form onsubmit="app.handlePageLoginSubmit(event)">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="pageLoginEmail" placeholder="jordan@promptkitt.io" value="jordan@promptkitt.io" required>
              </div>
              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label class="form-label">Password</label>
                  <a href="#" style="font-size: 0.8rem; color: var(--accent-primary);" onclick="app.showToast('Reset password link sent.', 'success')">Forgot?</a>
                </div>
                <input type="password" class="form-input" id="pageLoginPassword" value="password123" required>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
                <i class="ph-bold ph-sign-in"></i> Sign In to Account
              </button>
            </form>
          ` : `
            <form onsubmit="app.handlePageRegisterSubmit(event)">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="pageRegName" placeholder="Elena Rostova" required>
              </div>
              <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" class="form-input" id="pageRegUsername" placeholder="elena_ai" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="pageRegEmail" placeholder="elena@domain.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" id="pageRegPassword" placeholder="••••••••" required>
              </div>
              <div class="form-group">
                <label class="form-label">Primary Account Goal</label>
                <select class="form-select" id="pageRegRole">
                  <option value="buyer">Buy & Discover AI Master Prompts</option>
                  <option value="seller">Sell & Monetize AI Prompts (Creator)</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
                <i class="ph-bold ph-user-plus"></i> Complete Registration (100⚡ Free)
              </button>
            </form>
          `}
        </div>
      </div>
    `;
  }

  handlePageLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('pageLoginEmail').value;
    const password = document.getElementById('pageLoginPassword').value;
    const res = pkStore.login(email, password);
    if (res.success) {
      this.showToast(`Welcome back, ${res.user.name}!`, 'success');
      this.updateCounters();
      this.navigate('profile');
    }
  }

  handlePageRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('pageRegName').value;
    const username = document.getElementById('pageRegUsername').value;
    const email = document.getElementById('pageRegEmail').value;
    const password = document.getElementById('pageRegPassword').value;
    const role = document.getElementById('pageRegRole').value;

    const res = pkStore.register(name, username, email, password, role);
    if (res.success) {
      this.showToast(`Welcome, ${name}! 100 Starter Credits added.`, 'success');
      this.updateCounters();
      this.navigate('profile');
    }
  }

  openAuthModal(tab = 'login') {
    this.switchAuthTab(tab);
    this.openModal('authModal');
  }

  switchAuthTab(tab) {
    const tabLogin = document.getElementById('authTabLogin');
    const tabReg = document.getElementById('authTabRegister');
    const formLogin = document.getElementById('loginForm');
    const formReg = document.getElementById('registerForm');

    if (tab === 'login') {
      tabLogin?.classList.add('active');
      tabReg?.classList.remove('active');
      if (formLogin) formLogin.style.display = 'block';
      if (formReg) formReg.style.display = 'none';
    } else {
      tabReg?.classList.add('active');
      tabLogin?.classList.remove('active');
      if (formLogin) formLogin.style.display = 'none';
      if (formReg) formReg.style.display = 'block';
    }
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = pkStore.login(email, password);
    if (res.success) {
      this.closeModal('authModal');
      this.showToast(`Welcome back, ${res.user.name}!`, 'success');
      this.updateCounters();
      this.renderCurrentView();
    }
  }

  handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    const res = pkStore.register(name, username, email, password, role);
    if (res.success) {
      this.closeModal('authModal');
      this.showToast(`Welcome to PromptKitt Pro, ${name}! 100 Starter Credits added.`, 'success');
      this.updateCounters();
      this.navigate('profile');
    }
  }

  handleSocialAuth(provider) {
    pkStore.login(`${provider.toLowerCase()}user@promptkitt.io`, 'social123');
    this.closeModal('authModal');
    this.showToast(`Successfully authenticated with ${provider}!`, 'success');
    this.updateCounters();
    this.renderCurrentView();
  }

  handleLogout() {
    pkStore.logout();
    this.showToast('You have logged out safely.', 'success');
    this.updateCounters();
    this.navigate('home');
  }

  // =========================================================================
  // USER PUBLIC / PRIVATE PROFILE VIEW (`#profile`)
  // =========================================================================
  renderProfile(container, targetUsername) {
    const user = pkStore.state.user;
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const unlockedPrompts = allPrompts.filter(p => pkStore.isUnlocked(p.id));
    const favPrompts = allPrompts.filter(p => pkStore.isFavorite(p.id));

    container.innerHTML = `
      <div class="container" style="padding-top: 20px; padding-bottom: 60px;">
        <div class="profile-hero-banner" style="background: url('${user.banner}') center/cover no-repeat;">
          <div class="profile-avatar-overlay">
            <img src="${user.avatar}" class="profile-avatar-big" alt="${user.name}">
            <div style="margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <h1 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: #fff;">${user.name}</h1>
                <i class="ph-fill ph-check-circle" style="color: var(--accent-cyan); font-size: 1.2rem;" title="Verified User"></i>
                <span class="nav-pill-badge" style="background: var(--grad-primary); color: #fff; border: none;">${user.isVip ? 'VIP SELECT' : 'CREATOR'}</span>
              </div>
              <span style="color: #cbd5e1; font-size: 0.9rem;">@${user.username} · ${user.location || 'Global'}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
          <p style="color: var(--text-secondary); font-size: 1rem; max-width: 680px; line-height: 1.6;">${user.bio || 'AI engineer and creative technologist on PromptKitt Pro.'}</p>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="app.navigate('settings')"><i class="ph-bold ph-gear"></i> Edit Profile & Settings</button>
            <button class="btn btn-vip btn-sm" onclick="app.navigate('select')"><i class="ph-bold ph-crown"></i> ${user.isVip ? 'Manage VIP' : 'Upgrade to VIP'}</button>
          </div>
        </div>

        <div class="stats-cards-grid" style="margin-bottom: 36px;">
          <div class="stat-card">
            <span class="stat-label">Unlocked Prompts</span>
            <div class="stat-value text-gradient">${unlockedPrompts.length}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Available AI Credits</span>
            <div class="stat-value" style="color: var(--accent-emerald);">⚡ ${user.credits}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Saved Favorites</span>
            <div class="stat-value">${favPrompts.length}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Wallet Balance</span>
            <div class="stat-value" style="color: var(--accent-amber);">$${user.walletBalance.toFixed(2)}</div>
          </div>
        </div>

        <!-- Profile Tabs -->
        <div style="display: flex; gap: 14px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px; padding-bottom: 12px;">
          <button class="btn btn-sm ${this.activeProfileTab === 'vault' ? 'btn-primary' : 'btn-secondary'}" onclick="app.switchProfileTab('vault')">
            <i class="ph-bold ph-vault"></i> Unlocked Vault Prompts (${unlockedPrompts.length})
          </button>
          <button class="btn btn-sm ${this.activeProfileTab === 'favs' ? 'btn-primary' : 'btn-secondary'}" onclick="app.switchProfileTab('favs')">
            <i class="ph-bold ph-heart"></i> Favorites (${favPrompts.length})
          </button>
        </div>

        ${this.activeProfileTab === 'vault' ? `
          <div class="prompts-grid">
            ${unlockedPrompts.length > 0 ? unlockedPrompts.map(p => this.renderPromptCard(p)).join('') : `
              <p style="color: var(--text-muted);">No prompts unlocked yet.</p>
            `}
          </div>
        ` : `
          <div class="prompts-grid">
            ${favPrompts.length > 0 ? favPrompts.map(p => this.renderPromptCard(p)).join('') : `
              <p style="color: var(--text-muted);">No favorites saved yet.</p>
            `}
          </div>
        `}
      </div>
    `;
  }

  switchProfileTab(tab) {
    this.activeProfileTab = tab;
    this.renderProfile(document.getElementById('appContent'));
  }

  // =========================================================================
  // ACCOUNT SETTINGS VIEW (`#settings`)
  // =========================================================================
  renderSettings(container) {
    const user = pkStore.state.user;

    container.innerHTML = `
      <div class="container settings-container">
        <!-- Settings Tabs Sidebar -->
        <aside class="settings-tabs-sidebar">
          <div style="padding: 10px 14px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 8px;">
            <strong style="font-size: 0.95rem;">Account Center</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Security & Preferences</span>
          </div>

          <button class="settings-tab-btn ${this.activeSettingsTab === 'profile' ? 'active' : ''}" onclick="app.switchSettingsTab('profile')">
            <i class="ph-bold ph-user"></i> Profile & Public Bio
          </button>
          <button class="settings-tab-btn ${this.activeSettingsTab === 'security' ? 'active' : ''}" onclick="app.switchSettingsTab('security')">
            <i class="ph-bold ph-shield-check"></i> Security & 2FA
          </button>
          <button class="settings-tab-btn ${this.activeSettingsTab === 'billing' ? 'active' : ''}" onclick="app.switchSettingsTab('billing')">
            <i class="ph-bold ph-credit-card"></i> Billing & Payouts
          </button>
          <button class="settings-tab-btn ${this.activeSettingsTab === 'api' ? 'active' : ''}" onclick="app.switchSettingsTab('api')">
            <i class="ph-bold ph-code"></i> Developer API Keys
          </button>
          <button class="settings-tab-btn ${this.activeSettingsTab === 'notifications' ? 'active' : ''}" onclick="app.switchSettingsTab('notifications')">
            <i class="ph-bold ph-bell"></i> Notification Rules
          </button>
        </aside>

        <!-- Settings Active Panel -->
        <main class="settings-card">
          ${this.renderSettingsPanelContent(user)}
        </main>
      </div>
    `;
  }

  switchSettingsTab(tab) {
    this.activeSettingsTab = tab;
    this.renderSettings(document.getElementById('appContent'));
  }

  renderSettingsPanelContent(user) {
    switch (this.activeSettingsTab) {
      case 'profile':
        return `
          <div class="section-header" style="margin-bottom: 20px;">
            <div>
              <h2 class="section-title"><i class="ph-bold ph-user-circle" style="color: var(--accent-primary);"></i> Profile Information</h2>
              <p class="section-subtitle">Update your public creator bio, avatar URL, location and social handles.</p>
            </div>
          </div>

          <form onsubmit="app.handleSaveProfileSettings(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="setFullName" value="${user.name}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" class="form-input" id="setUsername" value="${user.username}" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="setEmail" value="${user.email}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Avatar Image URL</label>
              <input type="url" class="form-input" id="setAvatar" value="${user.avatar}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Banner Image URL</label>
              <input type="url" class="form-input" id="setBanner" value="${user.banner}">
            </div>

            <div class="form-group">
              <label class="form-label">Public Bio & Expertise</label>
              <textarea class="form-textarea" id="setBio">${user.bio || ''}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Location</label>
                <input type="text" class="form-input" id="setLocation" value="${user.location || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Website / Portfolio</label>
                <input type="url" class="form-input" id="setWebsite" value="${user.website || ''}">
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
              <button type="submit" class="btn btn-primary btn-lg"><i class="ph-bold ph-check"></i> Save Changes</button>
            </div>
          </form>
        `;

      case 'security':
        return `
          <div class="section-header" style="margin-bottom: 20px;">
            <div>
              <h2 class="section-title"><i class="ph-bold ph-shield-check" style="color: var(--accent-emerald);"></i> Security & Authentication</h2>
              <p class="section-subtitle">Manage your password, 2-Factor Authentication, and active sessions.</p>
            </div>
          </div>

          <form onsubmit="app.handleSaveSecuritySettings(event)">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="form-input" placeholder="••••••••">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" class="form-input" id="setNewPassword" placeholder="New secure password">
              </div>
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input type="password" class="form-input" id="setConfirmPassword" placeholder="Confirm new password">
              </div>
            </div>

            <div style="padding: 20px; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin: 24px 0; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <strong style="font-size: 0.95rem; display: block;">Two-Factor Authentication (2FA)</strong>
                <span style="font-size: 0.82rem; color: var(--text-secondary);">Secure your payouts & seller earnings with Google Authenticator.</span>
              </div>
              <input type="checkbox" id="set2FA" ${user.twoFactorEnabled ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--accent-primary);">
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary btn-lg">Update Security</button>
            </div>
          </form>
        `;

      case 'billing':
        return `
          <div class="section-header" style="margin-bottom: 20px;">
            <div>
              <h2 class="section-title"><i class="ph-bold ph-bank" style="color: var(--accent-amber);"></i> Billing & Payout Preferences</h2>
              <p class="section-subtitle">Configure your payout destinations and view invoices.</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Available Wallet Balance</span>
              <div style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; color: var(--accent-emerald);">$${user.walletBalance.toFixed(2)}</div>
            </div>
            <div style="background: var(--bg-secondary); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Current VIP Tier</span>
              <div style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--accent-amber);">${user.isVip ? 'PromptKitt Select VIP' : 'Free Member'}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Preferred Creator Payout Destination</label>
            <input type="text" class="form-input" value="PayPal (${user.email})" readonly>
          </div>
          <button class="btn btn-secondary" onclick="app.openModal('payoutModal')">Request Withdrawal Payout</button>
        `;

      case 'api':
        return `
          <div class="section-header" style="margin-bottom: 20px;">
            <div>
              <h2 class="section-title"><i class="ph-bold ph-code" style="color: var(--accent-cyan);"></i> Developer REST API Keys</h2>
              <p class="section-subtitle">Integrate PromptKitt Pro programmatic variable generation into your agents & applications.</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Live API Secret Key</label>
            <div style="display: flex; gap: 10px;">
              <input type="text" class="form-input" id="apiKeyDisplay" value="${user.apiKey}" readonly style="font-family: var(--font-mono); color: var(--accent-cyan);">
              <button class="btn btn-secondary" onclick="app.copyApiKey()"><i class="ph-bold ph-copy"></i> Copy</button>
              <button class="btn btn-secondary" onclick="app.handleRegenerateApiKey()"><i class="ph-bold ph-arrows-clockwise"></i> Roll Key</button>
            </div>
          </div>

          <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 18px; border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.85rem; color: #a5b4fc;">
            <div style="color: var(--text-muted); margin-bottom: 6px;">// Example CURL Request:</div>
            <div>curl -X POST https://api.promptkitt.io/v1/prompts/interpolate \\</div>
            <div>  -H "Authorization: Bearer ${user.apiKey}" \\</div>
            <div>  -d '{"promptId": "p1", "variables": {"subject": "futuristic mech"}}'</div>
          </div>
        `;

      case 'notifications':
        return `
          <div class="section-header" style="margin-bottom: 20px;">
            <div>
              <h2 class="section-title"><i class="ph-bold ph-bell" style="color: var(--accent-purple);"></i> Notification Preferences</h2>
              <p class="section-subtitle">Control which alerts and emails are sent to ${user.email}.</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <label style="display: flex; justify-content: space-between; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-md); cursor: pointer;">
              <div>
                <strong>Prompt Sale & Revenue Notifications</strong>
                <span style="font-size: 0.8rem; color: var(--text-secondary); display: block;">Instant alert when a buyer purchases your prompt template.</span>
              </div>
              <input type="checkbox" checked style="width: 20px; accent-color: var(--accent-primary);">
            </label>

            <label style="display: flex; justify-content: space-between; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-md); cursor: pointer;">
              <div>
                <strong>Bounty Solution Proposals</strong>
                <span style="font-size: 0.8rem; color: var(--text-secondary); display: block;">Notify when a creator submits a solution to your posted bounty.</span>
              </div>
              <input type="checkbox" checked style="width: 20px; accent-color: var(--accent-primary);">
            </label>

            <label style="display: flex; justify-content: space-between; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-md); cursor: pointer;">
              <div>
                <strong>Weekly VIP Prompt Drops</strong>
                <span style="font-size: 0.8rem; color: var(--text-secondary); display: block;">Curated weekly digest of top trending models and techniques.</span>
              </div>
              <input type="checkbox" checked style="width: 20px; accent-color: var(--accent-primary);">
            </label>
          </div>
        `;
    }
  }

  handleSaveProfileSettings(e) {
    e.preventDefault();
    const name = document.getElementById('setFullName').value;
    const username = document.getElementById('setUsername').value;
    const email = document.getElementById('setEmail').value;
    const avatar = document.getElementById('setAvatar').value;
    const banner = document.getElementById('setBanner').value;
    const bio = document.getElementById('setBio').value;
    const location = document.getElementById('setLocation').value;
    const website = document.getElementById('setWebsite').value;

    pkStore.updateProfile({ name, username, email, avatar, banner, bio, location, website });
    this.showToast('Profile information updated successfully!', 'success');
    this.updateCounters();
  }

  handleSaveSecuritySettings(e) {
    e.preventDefault();
    const newPass = document.getElementById('setNewPassword').value;
    const enable2FA = document.getElementById('set2FA').checked;
    pkStore.updateSecuritySettings(newPass, enable2FA);
    this.showToast('Security settings updated.', 'success');
  }

  copyApiKey() {
    const key = document.getElementById('apiKeyDisplay').value;
    navigator.clipboard.writeText(key);
    this.showToast('API Key copied to clipboard!', 'success');
  }

  handleRegenerateApiKey() {
    const newKey = pkStore.generateNewApiKey();
    const input = document.getElementById('apiKeyDisplay');
    if (input) input.value = newKey;
    this.showToast('New live API key generated!', 'success');
  }

  // =========================================================================
  // 1. HOME VIEW
  // =========================================================================
  renderHome(container) {
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const featuredPrompts = allPrompts.filter(p => p.isFeatured).slice(0, 6);

    container.innerHTML = `
      <section class="hero-section container">
        <div class="hero-tag">
          <i class="ph-fill ph-sparkle"></i> The Next-Gen AI Prompt & Skill Ecosystem
        </div>
        <h1 class="hero-title">
          Discover, Test & Acquire <span class="text-gradient">World-Class AI Prompts</span>
        </h1>
        <p class="hero-subtitle">
          Over 25,000+ engineered master prompts, variable sandboxes, and agent workflow skills for Midjourney, FLUX.1, Claude 3.5, and ChatGPT-4o.
        </p>

        <div class="hero-search-wrapper">
          <div class="hero-search-box">
            <i class="ph-bold ph-magnifying-glass" style="font-size: 1.3rem; color: var(--text-muted); margin-right: 12px;"></i>
            <input type="text" class="hero-search-input" id="heroSearchInput" placeholder="Try 'photorealistic cyber portrait' or 'Next.js 15 architect'..." onkeydown="if(event.key==='Enter') app.searchFromHero()">
            <select class="hero-model-select" id="heroModelSelect">
              <option value="all">⚡ All AI Models</option>
              ${PK_DATA.models.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
            </select>
            <button class="hero-search-btn" onclick="app.searchFromHero()">
              Search Prompts <i class="ph-bold ph-arrow-right"></i>
            </button>
          </div>

          <div class="hero-quick-tags">
            <span style="font-weight: 700;">Trending:</span>
            <span class="quick-tag-pill" onclick="app.quickSearch('Photorealistic')">📸 Photorealistic</span>
            <span class="quick-tag-pill" onclick="app.quickSearch('FLUX.1 Pro')">⚡ FLUX.1 Pro</span>
            <span class="quick-tag-pill" onclick="app.quickSearch('Claude 3.5')">🧠 Claude System Architect</span>
            <span class="quick-tag-pill" onclick="app.quickSearch('Cyberpunk')">🌆 Cyberpunk 3D</span>
            <span class="quick-tag-pill" onclick="app.quickSearch('Free')">🎁 100% Free</span>
          </div>
        </div>

        <div class="model-pills-bar">
          <button class="model-pill ${this.activeFilterModel === 'all' ? 'active' : ''}" onclick="app.filterByModel('all')">
            <i class="ph-fill ph-circles-four" style="font-size: 1.1rem; color: var(--accent-primary);"></i> All Models
          </button>
          ${PK_DATA.models.map(m => `
            <button class="model-pill ${this.activeFilterModel === m.id ? 'active' : ''}" onclick="app.filterByModel('${m.id}')">
              <span>${m.icon}</span> ${m.name}
            </button>
          `).join('')}
        </div>
      </section>

      <section class="section container">
        <div class="section-header">
          <div>
            <h2 class="section-title"><i class="ph-fill ph-flame" style="color: #f43f5e;"></i> Trending & Featured Master Prompts</h2>
            <p class="section-subtitle">Verified prompts with highest success rates, variable support, and 5-star community reviews.</p>
          </div>
          <div class="section-actions">
            <button class="btn btn-secondary btn-sm" onclick="app.navigate('explore')">View All Prompts <i class="ph-bold ph-arrow-right"></i></button>
          </div>
        </div>

        <div class="prompts-grid">
          ${featuredPrompts.map(p => this.renderPromptCard(p)).join('')}
        </div>
      </section>

      <section class="section container">
        <div style="background: var(--bg-card); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 40px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; align-items: center; box-shadow: var(--shadow-lg);">
          <div>
            <span class="nav-pill-badge" style="margin-bottom: 12px; display: inline-block;">EXCLUSIVE NEXT-GEN TOOL</span>
            <h2 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 14px;">
              Live Interactive Prompt Sandbox & Quality Scorer
            </h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 1.05rem;">
              Test variable parameters in real-time before buying. Analyze your prompts with our AI Power Meter (1-100 score) and use 1-Click Magic Optimization.
            </p>
            <div style="display: flex; gap: 14px; flex-wrap: wrap;">
              <button class="btn btn-primary btn-lg" onclick="app.navigate('playground')">
                <i class="ph-bold ph-play-circle"></i> Launch Live Playground
              </button>
              <button class="btn btn-secondary btn-lg" onclick="app.openModal('remixModal')">
                <i class="ph-bold ph-git-fork"></i> 1-Click Prompt Remix
              </button>
            </div>
          </div>
          <div style="background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; font-family: var(--font-mono); font-size: 0.85rem; color: #a5b4fc;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: var(--accent-emerald); font-weight: 700;">
              <span>● LIVE SIMULATOR READY</span>
              <span>SCORE: 98/100</span>
            </div>
            <div style="color: var(--text-muted); margin-bottom: 8px;">// Testing Variables:</div>
            <div>[subject]: <span style="color: #fff;">cyberpunk warrior woman</span></div>
            <div>[lighting]: <span style="color: #fff;">neon volumetric rim lighting</span></div>
            <div>[camera]: <span style="color: #fff;">85mm f/1.2 lens, 8k</span></div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); color: var(--accent-cyan);">
              --v 6.1 --ar 16:9 --style raw [Simulated Hit Rate: 99.4%]
            </div>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-header">
          <div>
            <h2 class="section-title"><i class="ph-fill ph-package" style="color: var(--accent-purple);"></i> Curated Prompt Bundles & Suites</h2>
            <p class="section-subtitle">Save up to 50% with bundled prompt collections created by certified top-tier sellers.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="app.navigate('collections')">View All Bundles</button>
        </div>

        <div class="collections-grid">
          ${PK_DATA.collections.map(c => this.renderCollectionCard(c)).join('')}
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 2. EXPLORE / MARKETPLACE VIEW
  // =========================================================================
  renderExplore(container = document.getElementById('appContent')) {
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    
    let filtered = allPrompts.filter(p => {
      if (this.activeFilterModel !== 'all' && p.modelId !== this.activeFilterModel) return false;
      if (this.activeFilterCategory !== 'all' && p.category !== this.activeFilterCategory) return false;
      if (this.searchQuery) {
        const str = `${p.title} ${p.description} ${p.tags.join(' ')} ${p.category}`.toLowerCase();
        if (!str.includes(this.searchQuery)) return false;
      }
      return true;
    });

    if (this.activeSortOrder === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (this.activeSortOrder === 'price_low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (this.activeSortOrder === 'price_high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px;">
        <div class="section-header" style="margin-bottom: 24px;">
          <div>
            <h1 class="section-title"><i class="ph-fill ph-storefront" style="color: var(--accent-primary);"></i> Prompt Marketplace</h1>
            <p class="section-subtitle">Showing ${filtered.length} verified AI prompts ready for instant deployment & download.</p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <select class="var-input-field" style="padding: 8px 14px; border-radius: var(--radius-full);" onchange="app.handleSortChange(this.value)">
              <option value="featured" ${this.activeSortOrder === 'featured' ? 'selected' : ''}>🔥 Sort by: Most Popular</option>
              <option value="rating" ${this.activeSortOrder === 'rating' ? 'selected' : ''}>⭐ Highest Rated</option>
              <option value="price_low" ${this.activeSortOrder === 'price_low' ? 'selected' : ''}>💰 Price: Low to High</option>
              <option value="price_high" ${this.activeSortOrder === 'price_high' ? 'selected' : ''}>💎 Price: High to Low</option>
            </select>
          </div>
        </div>

        <div class="model-pills-bar" style="margin-bottom: 24px;">
          <button class="model-pill ${this.activeFilterModel === 'all' ? 'active' : ''}" onclick="app.filterByModel('all')">
            <i class="ph-fill ph-circles-four"></i> All Models (${allPrompts.length})
          </button>
          ${PK_DATA.models.map(m => {
            const count = allPrompts.filter(p => p.modelId === m.id).length;
            return `
              <button class="model-pill ${this.activeFilterModel === m.id ? 'active' : ''}" onclick="app.filterByModel('${m.id}')">
                <span>${m.icon}</span> ${m.name} (${count})
              </button>
            `;
          }).join('')}
        </div>

        ${filtered.length > 0 ? `
          <div class="prompts-grid">
            ${filtered.map(p => this.renderPromptCard(p)).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: 80px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <i class="ph-bold ph-magnifying-glass" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i>
            <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin-bottom: 8px;">No matching prompts found</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Try clearing filters or searching for different keywords.</p>
            <button class="btn btn-secondary" onclick="app.clearFilters()">Clear All Filters</button>
          </div>
        `}
      </div>
    `;
  }

  // =========================================================================
  // 3. CATEGORIES VIEW
  // =========================================================================
  renderCategories(container) {
    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px;">
        <div class="section-header">
          <div>
            <h1 class="section-title"><i class="ph-fill ph-folders" style="color: var(--accent-cyan);"></i> Explore by Category</h1>
            <p class="section-subtitle">Find dedicated prompts engineered specifically for your domain and visual style.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${PK_DATA.categories.map(cat => `
            <div class="collection-card" style="cursor: pointer;" onclick="app.filterByCategory('${cat.id}')">
              <div style="font-size: 2.2rem; margin-bottom: 12px;">${cat.icon}</div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin-bottom: 6px;">${cat.name}</h3>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 16px;">${cat.desc}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
                <span class="nav-pill-badge">${cat.count}+ Master Prompts</span>
                <span style="color: var(--accent-primary); font-weight: 700; font-size: 0.85rem;">Browse Category →</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 4. GOALS / USE CASES VIEW
  // =========================================================================
  renderGoals(container) {
    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px;">
        <div class="section-header">
          <div>
            <h1 class="section-title"><i class="ph-fill ph-target" style="color: var(--accent-rose);"></i> Browse by Project Goal</h1>
            <p class="section-subtitle">Goal-oriented prompt architectures designed to achieve measurable business and creative outcomes.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
          ${PK_DATA.goals.map(g => `
            <div class="collection-card" style="cursor: pointer;" onclick="app.quickSearch('${g.title.split(' ')[0]}')">
              <div style="font-size: 2.4rem; margin-bottom: 14px;">${g.icon}</div>
              <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; margin-bottom: 8px;">${g.title}</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 20px;">${g.desc}</p>
              <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span class="nav-pill-badge" style="background: rgba(244,63,94,0.15); color: var(--accent-rose); border-color: var(--accent-rose);">Outcome Driven</span>
                <span style="color: var(--accent-primary); font-weight: 700; font-size: 0.88rem;">Explore Prompts →</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 5. CREATOR PUBLIC PROFILE VIEW
  // =========================================================================
  renderCreatorProfile(container, creatorIdOrUsername) {
    const creator = PK_DATA.creators.find(c => c.id === creatorIdOrUsername || c.username.toLowerCase() === (creatorIdOrUsername || '').toLowerCase()) || PK_DATA.creators[0];
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const creatorPrompts = allPrompts.filter(p => p.creatorId === creator.id);
    const isFollowing = pkStore.isFollowingCreator(creator.id);

    container.innerHTML = `
      <div class="container" style="padding-top: 20px; padding-bottom: 60px;">
        <div class="creator-banner">
          <div class="creator-profile-header">
            <img src="${creator.avatar}" class="creator-avatar-lg" alt="${creator.displayName}">
            <div style="margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <h1 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900;">${creator.displayName}</h1>
                <i class="ph-fill ph-check-circle" style="color: var(--accent-cyan); font-size: 1.2rem;" title="Verified Creator"></i>
                <span class="nav-pill-badge" style="background: var(--grad-primary); color: #fff; border: none;">${creator.badge}</span>
              </div>
              <span style="color: var(--text-secondary); font-size: 0.9rem;">@${creator.username} · ${creator.location}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
          <p style="color: var(--text-secondary); font-size: 1.05rem; max-width: 700px;">${creator.bio}</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn ${isFollowing ? 'btn-primary' : 'btn-secondary'}" onclick="app.handleToggleFollow('${creator.id}')">
              ${isFollowing ? '<i class="ph-bold ph-check"></i> Following' : '<i class="ph-bold ph-plus"></i> Follow Creator'}
            </button>
            <button class="btn btn-vip" onclick="app.openTipModal('${creator.id}')">
              <i class="ph-bold ph-heart"></i> Tip Creator
            </button>
            <button class="icon-btn btn-lg" onclick="app.openChatWithCreator('${creator.id}')" title="Send Direct Message">
              <i class="ph-bold ph-chat-centered-text"></i>
            </button>
          </div>
        </div>

        <div class="stats-cards-grid" style="margin-bottom: 40px;">
          <div class="stat-card">
            <span class="stat-label">Total Prompt Sales</span>
            <div class="stat-value text-gradient">${creator.salesCount}+</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Overall Rating</span>
            <div class="stat-value" style="color: var(--accent-amber);">⭐ ${creator.rating}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Followers</span>
            <div class="stat-value">${creator.followersCount}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Portfolio Items</span>
            <div class="stat-value">${creatorPrompts.length} Prompts</div>
          </div>
        </div>

        <div class="section-header">
          <h2 class="section-title"><i class="ph-bold ph-sparkle" style="color: var(--accent-primary);"></i> Creator Portfolio</h2>
        </div>

        <div class="prompts-grid">
          ${creatorPrompts.map(p => this.renderPromptCard(p)).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 6. PROMPT DETAIL & LIVE REVIEWS (CLEAN 2-COLUMN LAYOUT)
  // =========================================================================
  renderPromptDetail(container, promptIdOrSlug) {
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const prompt = allPrompts.find(p => p.id === promptIdOrSlug || p.slug === promptIdOrSlug) || allPrompts[0];
    const creator = PK_DATA.creators.find(c => c.id === prompt.creatorId) || PK_DATA.creators[0];
    const isUnlocked = pkStore.isUnlocked(prompt.id);
    const isFav = pkStore.isFavorite(prompt.id);
    const isFollowing = pkStore.isFollowingCreator(creator.id);
    const reviews = prompt.reviews || [];

    const currentVars = {};
    prompt.variables?.forEach(v => {
      currentVars[v.key] = v.defaultVal;
    });

    container.innerHTML = `
      <div class="container prompt-detail-container">
        <!-- Breadcrumb Navigation -->
        <div style="padding: 10px 0 16px; font-size: 0.86rem; color: var(--text-muted); display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <a href="#home" onclick="app.navigate('home')">Home</a>
          <span>/</span>
          <a href="#explore" onclick="app.navigate('explore')">Marketplace</a>
          <span>/</span>
          <a href="#explore" onclick="app.filterByCategory('${prompt.category}')" style="text-transform: uppercase; color: var(--accent-primary); font-weight: 600;">${prompt.category}</a>
          <span>/</span>
          <span style="color: var(--text-primary); font-weight: 700;">${prompt.title}</span>
        </div>

        <!-- Header Info Block -->
        <div class="prompt-detail-header-block">
          <div class="prompt-detail-badges-row">
            <span class="nav-pill-badge" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); border-color: var(--accent-primary);">
              <i class="ph-fill ph-cpu"></i> ${prompt.modelId.toUpperCase()} ENGINE
            </span>
            <span class="nav-pill-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border-color: var(--accent-emerald);">
              <i class="ph-bold ph-shield-check"></i> Quality Score: ${prompt.qualityScore}/100
            </span>
            <span style="font-size: 0.88rem; color: var(--accent-amber); font-weight: 700; display: flex; align-items: center; gap: 4px;">
              ⭐ ${prompt.rating || 5.0} (${prompt.reviewsCount || 0} reviews)
            </span>
            <span style="font-size: 0.82rem; color: var(--text-muted);">
              · ${prompt.salesCount || 0} purchases
            </span>
          </div>

          <h1 class="prompt-detail-h1">${prompt.title}</h1>
        </div>

        <!-- 2-Column Responsive Layout -->
        <div class="prompt-detail-2col-layout">
          <!-- LEFT COLUMN: Media Showcase, Description, Variables Sandbox, Template & Reviews -->
          <div class="detail-main-content">
            <!-- Media Showcase Card -->
            <div class="detail-showcase-card">
              <div class="detail-media-container">
                <img src="${prompt.coverImage}" id="mainDetailImage" class="detail-media-img" alt="${prompt.title}">
              </div>
              ${prompt.galleryImages?.length > 1 ? `
                <div class="detail-thumbnails-strip">
                  ${prompt.galleryImages.map((img, idx) => `
                    <img src="${img}" class="detail-thumb-item ${idx === 0 ? 'active' : ''}" onclick="app.switchDetailImage(this, '${img}')" alt="Thumbnail">
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Overview & Description Card -->
            <div class="detail-content-card">
              <h3 class="detail-card-title"><i class="ph-bold ph-info" style="color: var(--accent-cyan);"></i> Prompt Overview</h3>
              <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.7; margin-bottom: 20px; white-space: pre-line;">
                ${prompt.description}
              </p>

              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${(prompt.tags || []).map(t => `<span class="quick-tag-pill" onclick="app.quickSearch('${t}')">#${t}</span>`).join('')}
              </div>
            </div>

            <!-- Interactive Variable Simulator Sandbox -->
            <div class="detail-content-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h3 class="detail-card-title" style="margin-bottom: 0;">
                  <i class="ph-bold ph-sliders" style="color: var(--accent-primary);"></i> Interactive Variable Simulator
                </h3>
                <span class="nav-pill-badge" style="background: var(--grad-primary); color: #fff; border: none;">LIVE TESTER</span>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 18px;">
                Customize the placeholder values below to see the dynamic prompt update in real time:
              </p>

              <div id="simulatorInputs" class="prompt-variables-box">
                ${(prompt.variables || []).map(v => `
                  <div class="var-input-group">
                    <label class="var-input-label">[${v.key}]:</label>
                    <input type="text" class="var-input-field" data-varkey="${v.key}" value="${v.defaultVal}" oninput="app.updateVariablePreview('${prompt.id}')">
                  </div>
                `).join('')}
              </div>

              <div style="margin-top: 16px; padding: 16px; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-glow); font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.6; color: #a5b4fc;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Live Interpolated Preview:</span>
                  <button class="btn btn-sm btn-ghost" style="padding: 2px 8px; font-size: 0.78rem;" onclick="app.copySimulatedPreview()">
                    <i class="ph-bold ph-copy"></i> Copy Preview
                  </button>
                </div>
                <div id="interpolatedPreviewText" style="white-space: pre-wrap;">${this.interpolatePrompt(prompt.template, currentVars)}</div>
              </div>
            </div>

            <!-- Master Prompt Box (Unlocked vs Masked) -->
            <div class="detail-content-card">
              <h3 class="detail-card-title">
                <i class="ph-bold ${isUnlocked ? 'ph-lock-key-open' : 'ph-lock-key'}" style="color: ${isUnlocked ? 'var(--accent-emerald)' : 'var(--accent-primary)'};"></i>
                ${isUnlocked ? 'Unlocked Master Prompt Template' : 'Engineered Prompt Template'}
              </h3>

              ${isUnlocked ? `
                <div class="prompt-unlocked-box">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-weight: 800; font-size: 0.85rem; text-transform: uppercase;">
                      ✓ Verified Master Syntax:
                    </span>
                    <button class="btn btn-sm btn-primary" onclick="app.copyPromptToClipboard('${prompt.id}')">
                      <i class="ph-bold ph-copy"></i> Copy Full Prompt
                    </button>
                  </div>
                  <pre id="fullUnlockedCode" style="white-space: pre-wrap; word-break: break-word; font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.6; color: #6ee7b7;">${prompt.template}</pre>
                </div>
              ` : `
                <div class="prompt-mask-box">
                  <div class="masked-code">
                    ${prompt.template ? prompt.template.substring(0, 180) : 'Award-winning master prompt template with volumetric lighting, ultra-sharp focus, octane render --v 6.1 --ar 16:9'}...
                  </div>
                  <div class="mask-unlock-overlay">
                    <i class="ph-fill ph-lock-key" style="font-size: 2.2rem; color: var(--accent-primary);"></i>
                    <strong style="font-size: 1.1rem;">Template Protected & Masked</strong>
                    <span style="font-size: 0.88rem; color: var(--text-secondary); max-width: 440px;">
                      Purchase this prompt or activate Select VIP to instantly reveal full variables, tokens, and instructions in your Vault.
                    </span>
                    <button class="btn btn-primary btn-sm" style="margin-top: 8px;" onclick="app.quickBuy('${prompt.id}')">
                      Unlock for ${prompt.price == 0 ? 'FREE' : '$' + prompt.price.toFixed(2)}
                    </button>
                  </div>
                </div>
              `}
            </div>

            <!-- Usage Instructions & Setup Guide -->
            <div class="detail-content-card">
              <h3 class="detail-card-title"><i class="ph-bold ph-book-open" style="color: var(--accent-amber);"></i> Usage & Parameter Guidelines</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; white-space: pre-line;">
                ${prompt.instructions || 'Recommended settings: Set Aspect Ratio to 16:9 or 9:16 for portraits. Maintain default CFG Scale between 6.0 and 7.5.'}
              </p>
            </div>

            <!-- Community Reviews & Ratings -->
            <div class="detail-content-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <h3 class="detail-card-title" style="margin-bottom: 4px;"><i class="ph-bold ph-star" style="color: var(--accent-amber);"></i> Verified Community Reviews</h3>
                  <span style="font-size: 0.85rem; color: var(--text-secondary);">Feedback and output impressions from verified buyers</span>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="app.openAddReviewModal('${prompt.id}')">
                  <i class="ph-bold ph-star"></i> Write a Review
                </button>
              </div>

              ${reviews.length > 0 ? reviews.map(r => `
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <strong style="font-size: 0.95rem;">${r.author}</strong>
                      <span class="nav-pill-badge" style="font-size: 0.68rem; padding: 1px 6px;">Verified Buyer</span>
                    </div>
                    <span style="color: var(--accent-amber); font-size: 0.9rem;">${'⭐'.repeat(r.rating)}</span>
                  </div>
                  <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.5; margin-bottom: 12px;">${r.comment}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
                    <span>${r.time}</span>
                    <button class="btn btn-ghost btn-sm" style="padding: 3px 10px; font-size: 0.78rem;" onclick="app.handleUpvoteReview('${prompt.id}', '${r.id}')">
                      <i class="ph-bold ph-thumbs-up"></i> Helpful (${r.upvotes || 0})
                    </button>
                  </div>
                </div>
              `).join('') : `
                <div style="text-align: center; padding: 30px; background: var(--bg-secondary); border-radius: var(--radius-md); color: var(--text-muted);">
                  <p>No community reviews yet. Be the first to try and review this prompt!</p>
                </div>
              `}
            </div>
          </div>

          <!-- RIGHT COLUMN: Sticky Purchase Sidebar -->
          <div class="detail-sticky-sidebar">
            <!-- Purchase / Unlock Box -->
            <div class="purchase-box-card">
              <div class="purchase-price-row">
                <div>
                  <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Instant Access</span>
                  <div class="price-huge ${prompt.price == 0 ? 'free' : ''}">
                    ${prompt.price == 0 ? 'FREE' : `$${prompt.price.toFixed(2)}`}
                  </div>
                </div>
                ${pkStore.state.user && pkStore.state.user.isVip && prompt.price > 0 ? `
                  <span class="nav-pill-badge" style="background: rgba(245,158,11,0.15); color: #f59e0b; border-color: #f59e0b;">
                    <i class="ph-bold ph-crown"></i> VIP FREE UNLOCK
                  </span>
                ` : ''}
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${isUnlocked ? `
                  <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="app.copyPromptToClipboard('${prompt.id}')">
                    <i class="ph-bold ph-copy"></i> Copy Unlocked Prompt
                  </button>
                  <button class="btn btn-secondary btn-lg" style="width: 100%;" onclick="app.openInPlayground('${prompt.id}')">
                    <i class="ph-bold ph-flask"></i> Test in Playground
                  </button>
                ` : `
                  <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="app.quickBuy('${prompt.id}')">
                    <i class="ph-bold ph-lightning"></i> ${prompt.price == 0 ? 'Download Prompt (Free)' : 'Buy & Reveal Template'}
                  </button>
                  <button class="btn btn-secondary btn-lg" style="width: 100%;" onclick="app.handleAddToCart('${prompt.id}')">
                    <i class="ph-bold ph-shopping-cart-simple"></i> Add to Cart
                  </button>
                `}
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm ${isFav ? 'active' : ''}" style="flex: 1;" onclick="app.handleToggleFav('${prompt.id}')">
                  <i class="ph-bold ph-heart" style="color: ${isFav ? 'var(--accent-rose)' : 'inherit'};"></i> ${isFav ? 'Favorited' : 'Favorite'}
                </button>
                <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="app.openModal('remixModal')">
                  <i class="ph-bold ph-git-fork"></i> Remix
                </button>
              </div>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px; display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: var(--text-secondary);">
                <i class="ph-bold ph-shield-check" style="font-size: 1.3rem; color: var(--accent-emerald);"></i>
                <span>Backed by 14-Day Prompt Quality Guarantee with instant digital delivery.</span>
              </div>
            </div>

            <!-- Creator Sidebar Profile Card -->
            <div class="sidebar-seller-card">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px; cursor: pointer;" onclick="app.navigate('creator/${creator.id}')">
                <img src="${creator.avatar}" style="width: 50px; height: 50px; border-radius: var(--radius-full); object-fit: cover;" alt="${creator.displayName}">
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <strong style="font-size: 0.98rem;">${creator.displayName}</strong>
                    <i class="ph-fill ph-check-circle" style="color: var(--accent-cyan); font-size: 0.88rem;" title="Verified Creator"></i>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                    ${creator.salesCount}+ Sales · ⭐ ${creator.rating} Rating
                  </div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button class="btn btn-sm ${isFollowing ? 'btn-primary' : 'btn-secondary'}" onclick="app.handleToggleFollow('${creator.id}')">
                  ${isFollowing ? '✓ Following' : '+ Follow'}
                </button>
                <button class="btn btn-sm btn-vip" onclick="app.openTipModal('${creator.id}')">
                  <i class="ph-bold ph-heart"></i> Tip Creator
                </button>
              </div>
            </div>

            <!-- Technical Specifications Table -->
            <div class="sidebar-specs-card">
              <h4 style="font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; margin-bottom: 10px;">Prompt Specifications</h4>
              <div class="spec-item-row">
                <span style="color: var(--text-secondary);">Target Model:</span>
                <strong style="text-transform: uppercase;">${prompt.modelId}</strong>
              </div>
              <div class="spec-item-row">
                <span style="color: var(--text-secondary);">Category:</span>
                <span>${prompt.category}</span>
              </div>
              <div class="spec-item-row">
                <span style="color: var(--text-secondary);">Dynamic Variables:</span>
                <span>${(prompt.variables || []).length} Placeholders</span>
              </div>
              <div class="spec-item-row">
                <span style="color: var(--text-secondary);">License:</span>
                <span style="color: var(--accent-emerald); font-weight: 700;">Commercial Use OK</span>
              </div>
              <div class="spec-item-row">
                <span style="color: var(--text-secondary);">Delivery:</span>
                <span>Instant Digital Vault</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 7. INTERACTIVE AI PLAYGROUND
  // =========================================================================
  renderPlayground(container) {
    const credits = pkStore.state.user ? pkStore.state.user.credits : 0;

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px;">
        <div class="section-header">
          <div>
            <h1 class="section-title"><i class="ph-fill ph-flask" style="color: var(--accent-cyan);"></i> Multi-Modal AI Playground</h1>
            <p class="section-subtitle">Test text, code, and image generation with live AI Quality Analyzer and 1-Click Magic Optimization.</p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span class="nav-pill-badge" style="background: rgba(16,185,129,0.15); color: var(--accent-emerald); font-size: 0.82rem; padding: 4px 12px;">
              ⚡ Available Credits: ${credits}
            </span>
            <button class="btn btn-vip btn-sm" onclick="app.navigate('select')">+ Get More Credits</button>
          </div>
        </div>

        <div class="playground-container">
          <!-- Left Pane: Prompt Editor & Tools -->
          <div class="playground-editor-pane">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; gap: 8px; align-items: center;">
                <label style="font-size: 0.85rem; font-weight: 700;">Target Model Engine:</label>
                <select class="var-input-field" id="playgroundModelSelect" style="padding: 6px 12px;" onchange="app.handlePlaygroundModelChange()">
                  <option value="flux">⚡ FLUX (Image)</option>
                  <option value="midjourney">🎨 Midjourney (Image)</option>
                  <option value="chatgpt">🤖 ChatGPT (Text / Reasoning)</option>
                  <option value="claude">🧠 Claude (Coding / Artifacts)</option>
                  <option value="gemini">✨ Gemini (Multimodal)</option>
                  <option value="stablediffusion">🔮 Stable Diffusion (Image)</option>
                  <option value="deepseek">🐋 DeepSeek (Reasoning / Code)</option>
                </select>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="app.magicOptimizePlaygroundPrompt()">
                <i class="ph-fill ph-sparkle" style="color: #f59e0b;"></i> Magic Polish (1-Click)
              </button>
            </div>

            <textarea id="playgroundPromptInput" class="playground-textarea" placeholder="Type or paste your prompt here. You can use variables like [subject], [lighting]..." oninput="app.updateQualityMeter(this.value)">Award-winning editorial portrait photograph of [subject: cyberpunk warrior woman], [lighting: dual neon volumetric rim lighting], shot on Hasselblad H6D-100c 85mm f/1.2 lens, raytraced reflections, 8k resolution --ar 16:9 --v 6.1 --style raw</textarea>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Est. Generation Cost: <strong>2 Credits</strong></span>
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary" onclick="app.clearPlayground()">Clear</button>
                <button class="btn btn-primary" id="btnRunPlayground" onclick="app.runPlaygroundGeneration()">
                  <i class="ph-bold ph-play"></i> Run Live Generation (2⚡)
                </button>
              </div>
            </div>

            <!-- Quality Meter Card -->
            <div class="quality-meter-card" id="qualityMeterCard">
              <div class="meter-header">
                <div>
                  <h4 style="font-family: var(--font-display); font-weight: 800; font-size: 1rem;">AI Prompt Quality & Power Meter</h4>
                  <span style="font-size: 0.78rem; color: var(--text-secondary);">Real-time algorithmic scoring based on token density and parameters</span>
                </div>
                <div class="meter-score-circle" id="meterScoreValue">96/100</div>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" id="meterProgressBar" style="width: 96%;"></div>
              </div>
              <div class="score-breakdown-grid">
                <div class="breakdown-item good"><i class="ph-bold ph-check"></i> Parameter Tuning (--v 6.1, --ar)</div>
                <div class="breakdown-item good"><i class="ph-bold ph-check"></i> Dynamic Variables Detected</div>
                <div class="breakdown-item good"><i class="ph-bold ph-check"></i> Zero Token Fluff (Dense)</div>
                <div class="breakdown-item good"><i class="ph-bold ph-check"></i> Lighting & Camera Coherence</div>
              </div>
            </div>
          </div>

          <!-- Right Pane: Generation Preview -->
          <div class="playground-preview-pane">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
              <h4 style="font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                <i class="ph-bold ph-image" style="color: var(--accent-primary);"></i> Real-Time Output Sandbox
              </h4>
              <span style="font-size: 0.78rem; color: var(--accent-emerald);">● ENGINE READY</span>
            </div>

            <div id="playgroundOutputDisplay" style="min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle); overflow: hidden; position: relative;">
              <img id="playgroundResultImg" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);" alt="Live Result">
            </div>

            <div>
              <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 10px;">Recent Session Runs</h5>
              <div style="display: flex; gap: 10px; overflow-x: auto;">
                ${pkStore.state.playgroundHistory.map(run => `
                  <div style="width: 70px; height: 70px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-subtle); cursor: pointer;" onclick="app.restorePlaygroundRun('${run.id}')">
                    <img src="${run.outputImage}" style="width: 100%; height: 100%; object-fit: cover;" alt="Run">
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 8. BOUNTIES VIEW
  // =========================================================================
  renderBounties(container) {
    const bounties = pkStore.state.bounties;

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px;">
        <div class="section-header">
          <div>
            <h1 class="section-title"><i class="ph-fill ph-trophy" style="color: #f59e0b;"></i> Custom Prompt Bounties</h1>
            <p class="section-subtitle">Post bespoke prompt requests with cash rewards or submit your engineering solutions to earn.</p>
          </div>
          <div>
            <button class="btn btn-primary" onclick="app.openModal('postBountyModal')">
              <i class="ph-bold ph-plus-circle"></i> Post a Custom Bounty
            </button>
          </div>
        </div>

        <div class="bounties-list">
          ${bounties.map(b => `
            <div class="bounty-item-card">
              <div class="bounty-main-info">
                <span class="bounty-status-badge ${b.status}">${b.status === 'open' ? '🟢 OPEN FOR SUBMISSIONS' : '🔒 COMPLETED & PAID'}</span>
                <h3 class="bounty-title">#${b.number}: ${b.title}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 12px;">${b.description}</p>
                <div class="bounty-meta">
                  <span><strong>Target Model:</strong> ${b.modelTarget}</span>
                  <span><strong>Requested by:</strong> ${b.buyerName}</span>
                  <span><strong>Submissions:</strong> ${b.submissionsCount} solutions</span>
                  <span><strong>Deadline:</strong> ${b.deadline}</span>
                </div>
              </div>
              <div class="bounty-budget-box">
                <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Bounty Reward</div>
                <div class="bounty-budget-amount">$${b.budget.toFixed(2)}</div>
                ${b.status === 'open' ? `
                  <button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="app.openSubmitSolutionModal('${b.id}')">
                    Submit Solution <i class="ph-bold ph-arrow-right"></i>
                  </button>
                ` : `
                  <span style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700; display: block; margin-top: 8px;">
                    Winner Awarded
                  </span>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 9. COLLECTIONS VIEW
  // =========================================================================
  renderCollections(container) {
    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px;">
        <div class="section-header">
          <div>
            <h1 class="section-title"><i class="ph-fill ph-package" style="color: var(--accent-purple);"></i> Curated Prompt Bundles</h1>
            <p class="section-subtitle">Complete prompt ecosystems, character consistency toolkits, and software engineering suites.</p>
          </div>
        </div>

        <div class="collections-grid">
          ${PK_DATA.collections.map(c => this.renderCollectionCard(c)).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 10. SELECT VIP MEMBERSHIP VIEW
  // =========================================================================
  renderSelectVip(container) {
    const isVip = pkStore.state.user && pkStore.state.user.isVip;

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px; text-align: center;">
        <div class="hero-tag" style="background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.4); color: #f59e0b;">
          <i class="ph-fill ph-crown"></i> PROMPTKITT SELECT VIP MEMBERSHIP
        </div>
        <h1 class="hero-title">Unlock Unlimited AI Potential</h1>
        <p class="hero-subtitle">
          Join an elite circle of AI prompt architects. Get free monthly unlocks, heavy marketplace discounts, and dedicated GPU computing.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; max-width: 900px; margin: 40px auto 0; text-align: left;">
          ${PK_DATA.plans.map(plan => `
            <div style="background: var(--bg-card); border: 2px solid ${plan.id === 'plan_monthly' ? 'var(--accent-primary)' : 'var(--border-subtle)'}; border-radius: var(--radius-lg); padding: 32px; display: flex; flex-direction: column; position: relative; box-shadow: var(--shadow-lg);">
              <span class="nav-pill-badge" style="position: absolute; top: 16px; right: 16px; background: var(--grad-primary); color: #fff; border: none;">
                ${plan.badge}
              </span>
              <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; margin-bottom: 6px;">${plan.name}</h3>
              <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 20px;">
                <span style="font-family: var(--font-display); font-size: 2.4rem; font-weight: 900;">$${plan.price}</span>
                <span style="color: var(--text-muted); font-size: 0.9rem;">/ ${plan.interval}</span>
              </div>

              <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; font-size: 0.92rem;">
                ${plan.perks.map(perk => `
                  <li style="display: flex; align-items: center; gap: 10px;">
                    <i class="ph-fill ph-check-circle" style="color: var(--accent-emerald); font-size: 1.1rem;"></i>
                    <span>${perk}</span>
                  </li>
                `).join('')}
              </ul>

              <button class="btn ${plan.id === 'plan_monthly' ? 'btn-primary' : 'btn-vip'} btn-lg" style="margin-top: auto;" onclick="app.handleSubscribeVip('${plan.id}')">
                ${isVip ? 'Manage Active VIP Subscription' : `Subscribe (${plan.name})`}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 11. BUYER DIGITAL VAULT & DISPUTES
  // =========================================================================
  renderLibrary(container) {
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const unlocked = allPrompts.filter(p => pkStore.isUnlocked(p.id));
    const favs = allPrompts.filter(p => pkStore.isFavorite(p.id));
    const refunds = pkStore.state.refunds || [];

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 60px;">
        <div class="section-header">
          <div>
            <h1 class="section-title"><i class="ph-fill ph-vault" style="color: var(--accent-emerald);"></i> My Digital Vault & Purchases</h1>
            <p class="section-subtitle">Access your unlocked prompts, copy variable templates, or request guarantee refunds.</p>
          </div>
          <div>
            <button class="btn btn-secondary btn-sm" onclick="app.navigate('explore')">Browse More Prompts</button>
          </div>
        </div>

        <div style="display: flex; gap: 16px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px; padding-bottom: 12px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-primary"><i class="ph-bold ph-lock-key-open"></i> Unlocked Vault (${unlocked.length})</button>
          <button class="btn btn-sm btn-secondary" onclick="app.navigate('explore')"><i class="ph-bold ph-heart"></i> Favorites (${favs.length})</button>
          <button class="btn btn-sm btn-secondary" onclick="app.openModal('refundModal')"><i class="ph-bold ph-arrow-counter-clockwise"></i> Request Guarantee Refund</button>
        </div>

        ${unlocked.length > 0 ? `
          <div class="prompts-grid" style="margin-bottom: 40px;">
            ${unlocked.map(p => `
              <div class="prompt-card">
                <div class="prompt-card-media" style="height: 180px;">
                  <img src="${p.coverImage}" class="prompt-card-img" alt="${p.title}" style="height: 100%; object-fit: cover;">
                  <div class="prompt-model-badge"><i class="ph-fill ph-cpu"></i> ${(p.model || p.modelId || 'AI').toUpperCase()}</div>
                  <span class="nav-pill-badge" style="position: absolute; bottom: 8px; right: 8px; background: rgba(16,185,129,0.9); color: #fff; font-size: 0.75rem; font-weight: 800;">
                    ✓ UNLOCKED
                  </span>
                </div>
                <div class="prompt-card-body" style="padding: 16px;">
                  <h4 class="prompt-card-title" style="font-size: 0.95rem; margin-bottom: 12px;">${p.title}</h4>
                  <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sm btn-primary" style="flex: 1;" onclick="app.navigate('prompt-detail/${p.id}')">
                      <i class="ph-bold ph-flask"></i> Open Sandbox
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="app.navigate('license/${p.id}')" title="View Official Commercial Rights Certificate">
                      <i class="ph-bold ph-certificate" style="color: #f59e0b;"></i> License
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: 60px; background: var(--bg-card); border-radius: var(--radius-lg); margin-bottom: 40px;">
            <p>You have not unlocked any prompts yet.</p>
            <button class="btn btn-primary" style="margin-top: 14px;" onclick="app.navigate('explore')">Explore Marketplace</button>
          </div>
        `}

        ${refunds.length > 0 ? `
          <div class="section-header">
            <h3 class="section-title" style="font-size: 1.3rem;"><i class="ph-bold ph-shield-warning" style="color: var(--accent-amber);"></i> Dispute & Refund Status</h3>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Item</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${refunds.map(r => `
                  <tr>
                    <td><code>#${r.id}</code></td>
                    <td style="font-weight: 700;">${r.promptTitle}</td>
                    <td>${r.reason}</td>
                    <td><span class="nav-pill-badge" style="background: rgba(16,185,129,0.15); color: var(--accent-emerald); border-color: var(--accent-emerald);">${r.status.toUpperCase()}</span></td>
                    <td style="color: var(--text-muted);">${r.date}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
      </div>
    `;
  }

  // =========================================================================
  // 12. FULL-PAGE PROMPT CREATOR STUDIO (#create-prompt)
  // =========================================================================
  renderCreatePromptPage(container) {
    this.selectedCreateModel = this.selectedCreateModel || 'midjourney';
    const user = pkStore.state.user || { name: 'Creator', avatar: '' };

    container.innerHTML = `
      <div class="container" style="padding-top: 20px;">
        <div class="create-studio-header">
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <a href="#seller-dashboard" onclick="app.navigate('seller-dashboard')" style="color: var(--accent-primary); font-weight: 600;">← Seller Studio</a>
              <span>/</span>
              <span>Create Master Prompt</span>
            </div>
            <h1 class="section-title" style="font-size: 1.9rem; margin-bottom: 4px;">
              <i class="ph-bold ph-magic-wand" style="color: var(--accent-primary);"></i> Prompt Creator Studio & Architecture Lab
            </h1>
            <p class="section-subtitle">Engineer, parameterize, test, and publish certified master AI prompt suites to 20,000+ buyers.</p>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <button class="btn btn-secondary" onclick="app.navigate('seller-dashboard')"><i class="ph-bold ph-x"></i> Cancel</button>
            <button class="btn-creator-cta" onclick="document.getElementById('fullPromptCreateForm').requestSubmit()">
              <span class="btn-icon-circle"><i class="ph-bold ph-paper-plane-tilt"></i></span>
              <span>Publish Master Prompt</span>
            </button>
          </div>
        </div>

        <div class="create-prompt-layout">
          <!-- Left Column: Comprehensive Multi-Step Form -->
          <div class="create-form-col">
            <form id="fullPromptCreateForm" onsubmit="app.handleCreatePromptFullSubmit(event)">
              
              <!-- Section 1: Target AI Engine -->
              <div class="create-form-section">
                <h3 class="create-section-title">
                  <span class="nav-pill-badge" style="width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; padding: 0;">1</span>
                  Select Target AI Model Engine
                </h3>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 14px;">
                  Choose the primary artificial intelligence model engine your prompt is optimized and tested on:
                </p>

                <div class="model-selector-grid">
                  ${PK_DATA.models.map(m => `
                    <div class="model-select-card ${this.selectedCreateModel === m.id ? 'active' : ''}" onclick="app.selectCreateModel('${m.id}')">
                      <span class="model-select-icon">${m.icon}</span>
                      <span class="model-select-name">${m.name}</span>
                    </div>
                  `).join('')}
                </div>
                <input type="hidden" id="fullCreateSelectedModel" value="${this.selectedCreateModel}">
              </div>

              <!-- Section 2: Title & Category -->
              <div class="create-form-section">
                <h3 class="create-section-title">
                  <span class="nav-pill-badge" style="width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; padding: 0;">2</span>
                  Prompt Metadata & Niche
                </h3>
                
                <div class="form-group">
                  <label class="form-label">Prompt Title</label>
                  <input type="text" class="form-input" id="fullCreateTitle" placeholder="e.g. Ultra-Realistic 8K Cyberpunk Fashion Portrait" value="Ultra-Realistic 8K Studio Cyberpunk Fashion Portrait" oninput="app.handleLiveCreateInput()" required>
                  <span style="font-size: 0.76rem; color: var(--text-muted);">Use descriptive, benefit-driven keywords that buyers search for.</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label">Marketplace Category</label>
                    <select class="form-select" id="fullCreateCategory" onchange="app.handleLiveCreateInput()">
                      <option value="photorealistic">Photorealistic Portraits</option>
                      <option value="cyberpunk-3d">3D & Cyberpunk Art</option>
                      <option value="code-dev">Full-Stack Architecture</option>
                      <option value="marketing-copy">High-Converting Copy</option>
                      <option value="logo-branding">Vector Logo & Brand Kits</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Price ($ USD) - Enter 0.00 for Free</label>
                    <input type="number" step="0.01" min="0" class="form-input" id="fullCreatePrice" value="4.99" oninput="app.handleLiveCreateInput()" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Search Tags (comma separated)</label>
                  <input type="text" class="form-input" id="fullCreateTags" placeholder="cyberpunk, portrait, 8k, fashion, studio" value="cyberpunk, portrait, 8k, fashion, studio" oninput="app.handleLiveCreateInput()">
                </div>
              </div>

              <!-- Section 3: Master Prompt Template & Variables -->
              <div class="create-form-section">
                <h3 class="create-section-title">
                  <span class="nav-pill-badge" style="width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; padding: 0;">3</span>
                  Master Prompt Template & Dynamic Variables
                </h3>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">
                  Wrap dynamic placeholders in square brackets like <code>[subject]</code>, <code>[wardrobe]</code>, <code>[lighting]</code>. They are automatically extracted for buyer customization:
                </p>

                <div class="form-group">
                  <label class="form-label">Master Prompt Template Syntax</label>
                  <textarea class="form-textarea" id="fullCreateTemplate" style="min-height: 130px;" oninput="app.handleLiveCreateInput()" required>Award-winning editorial photograph of [subject], wearing [wardrobe], dramatic [lighting], shot on 85mm f/1.2 lens, raytraced reflections, 8k resolution --ar 16:9 --v 6.1 --style raw</textarea>
                </div>

                <div>
                  <label class="form-label" style="display: flex; justify-content: space-between;">
                    <span>Detected Dynamic Variables:</span>
                    <span id="detectedVarsCount" style="color: var(--accent-emerald); font-weight: 700;">3 variables detected</span>
                  </label>
                  <div class="variables-chip-container" id="detectedVariablesChips">
                    <span class="var-chip"><i class="ph-bold ph-brackets-curly"></i> [subject]</span>
                    <span class="var-chip"><i class="ph-bold ph-brackets-curly"></i> [wardrobe]</span>
                    <span class="var-chip"><i class="ph-bold ph-brackets-curly"></i> [lighting]</span>
                  </div>
                </div>
              </div>

              <!-- Section 4: Visual Showcase & Instructions -->
              <div class="create-form-section">
                <h3 class="create-section-title">
                  <span class="nav-pill-badge" style="width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; padding: 0;">4</span>
                  Showcase Media & Usage Instructions
                </h3>

                <div class="form-group">
                  <label class="form-label">Main Cover Output Image URL</label>
                  <input type="url" class="form-input" id="fullCreateCover" value="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" oninput="app.handleLiveCreateInput()" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Detailed Prompt Instructions & Recommended Parameters</label>
                  <textarea class="form-textarea" id="fullCreateInstructions" placeholder="Recommended settings: Stylize 250, Aspect Ratio 16:9, Step 28, CFG 7.0...">Recommended settings: Use Aspect Ratio 16:9 for landscape, 9:16 for portrait. Set Stylize to 250 and style raw for best cinematic photo fidelity.</textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Description / Summary for Buyers</label>
                  <textarea class="form-textarea" id="fullCreateDescription" placeholder="Explain what makes this prompt unique and the outputs it produces...">Engineered prompt suite for creating hyper-realistic high fashion cyberpunk editorial portraits with photorealistic skin textures, dual neon rim lights, and commercial aesthetic.</textarea>
                </div>
              </div>

              <!-- Submit & Publish Footer -->
              <div class="modal-footer-actions" style="margin-top: 0; padding-top: 24px; border-top: 1px solid var(--border-subtle);">
                <button type="button" class="btn-cancel" onclick="app.navigate('seller-dashboard')"><i class="ph-bold ph-x"></i> Cancel & Return</button>
                <button type="submit" class="btn-creator-cta">
                  <span class="btn-icon-circle"><i class="ph-bold ph-paper-plane-tilt"></i></span>
                  <span>Publish & Submit to Marketplace</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Right Column: Live Sticky Card & Marketplace Preview -->
          <div class="create-preview-col live-preview-sticky">
            <div class="preview-box-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                  <i class="ph-bold ph-eye" style="color: var(--accent-cyan);"></i> Live Marketplace Preview
                </h4>
                <span class="nav-pill-badge" style="background: rgba(16,185,129,0.15); color: var(--accent-emerald);">REAL-TIME</span>
              </div>

              <!-- Live Card Render -->
              <div id="liveCreatedCardPreview">
                <!-- Dynamically updated -->
              </div>

              <div style="margin-top: 20px; padding: 14px; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">🛡️ Quality Verification:</strong>
                All prompts submitted are verified by automated syntax analyzers and scored for token density, parameters, and variable coverage before going live.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.handleLiveCreateInput();
  }

  selectCreateModel(modelId) {
    this.selectedCreateModel = modelId;
    const hidden = document.getElementById('fullCreateSelectedModel');
    if (hidden) hidden.value = modelId;
    document.querySelectorAll('.model-select-card').forEach(card => card.classList.remove('active'));
    event.currentTarget?.classList.add('active');
    this.handleLiveCreateInput();
  }

  handleLiveCreateInput() {
    const title = document.getElementById('fullCreateTitle')?.value || 'Prompt Title';
    const category = document.getElementById('fullCreateCategory')?.value || 'photorealistic';
    const price = parseFloat(document.getElementById('fullCreatePrice')?.value) || 0;
    const template = document.getElementById('fullCreateTemplate')?.value || '';
    const cover = document.getElementById('fullCreateCover')?.value || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    const model = document.getElementById('fullCreateSelectedModel')?.value || 'midjourney';
    const user = pkStore.state.user || { name: 'Jordan Sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' };

    // Extract dynamic variables like [subject]
    const matches = template.match(/\[(.*?)\]/g) || [];
    const uniqueVars = [...new Set(matches.map(m => m.replace(/\[|\]/g, '')))];

    const chipsContainer = document.getElementById('detectedVariablesChips');
    const countEl = document.getElementById('detectedVarsCount');
    if (chipsContainer) {
      chipsContainer.innerHTML = uniqueVars.length > 0
        ? uniqueVars.map(v => `<span class="var-chip"><i class="ph-bold ph-brackets-curly"></i> [${v}]</span>`).join('')
        : `<span style="color: var(--text-muted); font-size: 0.82rem;">No variables detected yet. Type e.g. [subject] in template.</span>`;
    }
    if (countEl) {
      countEl.innerText = `${uniqueVars.length} variable${uniqueVars.length === 1 ? '' : 's'} detected`;
    }

    // Update Live Card
    const previewContainer = document.getElementById('liveCreatedCardPreview');
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div class="prompt-card" style="box-shadow: var(--shadow-md);">
          <div class="prompt-card-media">
            <img src="${cover}" class="prompt-card-img" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'">
            <div class="prompt-model-badge">
              <i class="ph-fill ph-cpu"></i> ${model.toUpperCase()}
            </div>
            <div class="prompt-quality-score-badge">
              <i class="ph-bold ph-shield-check"></i> 98/100
            </div>
          </div>
          <div class="prompt-card-body">
            <span class="prompt-card-category">${category}</span>
            <h3 class="prompt-card-title">${title}</h3>
            <div class="prompt-variables-preview">
              ${uniqueVars.slice(0, 3).map(v => `<span class="var-tag">[${v}]</span>`).join('')}
              ${uniqueVars.length > 3 ? `<span class="var-tag">+${uniqueVars.length - 3} more</span>` : ''}
            </div>
            <div class="prompt-card-footer">
              <div class="prompt-creator-meta">
                <img src="${user.avatar}" class="creator-avatar-sm" alt="${user.name}">
                <span class="creator-name-sm">${user.name.split(' ')[0]}</span>
                <i class="ph-fill ph-check-circle verified-check-sm"></i>
              </div>
              <div class="prompt-pricing-action">
                <span class="prompt-price-tag ${price == 0 ? 'free' : ''}">
                  ${price == 0 ? 'FREE' : `$${price.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  handleCreatePromptFullSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('fullCreateTitle').value;
    const modelId = document.getElementById('fullCreateSelectedModel').value;
    const category = document.getElementById('fullCreateCategory').value;
    const price = parseFloat(document.getElementById('fullCreatePrice').value) || 0;
    const template = document.getElementById('fullCreateTemplate').value;
    const coverImage = document.getElementById('fullCreateCover').value;
    const instructions = document.getElementById('fullCreateInstructions').value;
    const description = document.getElementById('fullCreateDescription').value;

    pkStore.createSellerPrompt({
      title,
      modelId,
      category,
      price,
      template,
      coverImage,
      instructions,
      description
    });

    this.showToast('Master prompt engineered and published live to marketplace!', 'success');
    this.navigate('seller-dashboard');
  }

  // =========================================================================
  // 13. SELLER STUDIO DASHBOARD
  // =========================================================================
  renderSellerDashboard(container) {
    const stats = pkStore.state.sellerAnalytics;
    const coupons = pkStore.state.sellerCoupons || [];
    const user = pkStore.state.user || { name: 'Seller', avatar: '' };

    container.innerHTML = `
      <div class="container dashboard-layout">
        <aside class="dashboard-sidebar">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
            <img src="${user.avatar}" style="width: 44px; height: 44px; border-radius: var(--radius-full);" alt="Avatar">
            <div>
              <h4 style="font-weight: 800; font-size: 0.95rem;">${user.name}</h4>
              <span class="nav-pill-badge">Certified Seller</span>
            </div>
          </div>

          <ul class="dash-nav-list">
            <li class="dash-nav-item active"><a href="#seller-dashboard"><i class="ph-bold ph-chart-line-up"></i> Sales & Analytics</a></li>
            <li class="dash-nav-item"><a href="#create-prompt" onclick="app.navigate('create-prompt')"><i class="ph-bold ph-plus-circle"></i> Create New Prompt</a></li>
            <li class="dash-nav-item"><a href="#" onclick="app.openModal('couponModal')"><i class="ph-bold ph-ticket"></i> Custom Coupons</a></li>
            <li class="dash-nav-item"><a href="#" onclick="app.openModal('kycModal')"><i class="ph-bold ph-identification-card"></i> KYC Verification</a></li>
            <li class="dash-nav-item"><a href="#" onclick="app.openModal('payoutModal')"><i class="ph-bold ph-bank"></i> Request Payout</a></li>
            <li class="dash-nav-item"><a href="#home" onclick="app.switchRole('buyer')"><i class="ph-bold ph-arrow-left"></i> Return to Marketplace</a></li>
          </ul>
        </aside>

        <main class="dashboard-content">
          <div class="section-header" style="margin-bottom: 0;">
            <div>
              <h1 class="section-title"><i class="ph-fill ph-storefront" style="color: var(--accent-primary);"></i> Seller Command Studio</h1>
              <p class="section-subtitle">Manage your live prompt portfolio, sales conversions, and withdrawal payouts.</p>
            </div>
            <button class="btn-creator-cta" onclick="app.navigate('create-prompt')">
              <span class="btn-icon-circle"><i class="ph-bold ph-plus"></i></span>
              <span>Create New Prompt Studio</span>
            </button>
          </div>

          <div class="stats-cards-grid">
            <div class="stat-card">
              <span class="stat-label">Total Revenue</span>
              <div class="stat-value text-gradient">$${stats.totalRevenue.toFixed(2)}</div>
              <span class="stat-delta positive"><i class="ph-bold ph-trend-up"></i> +18.4% this month</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Pending Payout Balance</span>
              <div class="stat-value" style="color: var(--accent-emerald);">$${stats.pendingPayout.toFixed(2)}</div>
              <button class="btn btn-sm btn-secondary" style="margin-top: 6px;" onclick="app.openModal('payoutModal')">Withdraw Funds</button>
            </div>
            <div class="stat-card">
              <span class="stat-label">Total Prompt Sales</span>
              <div class="stat-value">${stats.totalSales}</div>
              <span class="stat-delta positive"><i class="ph-bold ph-shopping-cart"></i> Steady growth</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Conversion Rate</span>
              <div class="stat-value">${stats.conversionRate}</div>
              <span class="stat-delta positive">Top 5% on platform</span>
            </div>
          </div>

          <!-- Published Prompts Table -->
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin-bottom: 14px;">Your Published Prompts</h3>
            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Prompt Name</th>
                    <th>Model</th>
                    <th>Price</th>
                    <th>Sales</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${[...PK_DATA.prompts.slice(0, 3), ...pkStore.state.customPrompts].map(p => `
                    <tr>
                      <td style="font-weight: 700; max-width: 280px;">${p.title}</td>
                      <td><span class="nav-pill-badge">${p.modelId.toUpperCase()}</span></td>
                      <td style="font-weight: 800;">$${p.price.toFixed(2)}</td>
                      <td>${p.salesCount || 0}</td>
                      <td>⭐ ${p.rating || 5.0}</td>
                      <td>
                        <button class="btn btn-sm btn-ghost" onclick="app.navigate('prompt-detail/${p.id}')">View</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Seller Coupons Section -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800;">Your Custom Promotional Coupons</h3>
              <button class="btn btn-secondary btn-sm" onclick="app.openModal('couponModal')">+ New Coupon</button>
            </div>
            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Redemptions</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${coupons.map(c => `
                    <tr>
                      <td><code>${c.code}</code></td>
                      <td style="font-weight: 700; color: var(--accent-emerald);">${c.discountPercent}% OFF</td>
                      <td>${c.uses} / ${c.maxUses}</td>
                      <td><span class="nav-pill-badge" style="background: ${c.active ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.2)'}; color: ${c.active ? 'var(--accent-emerald)' : 'var(--text-muted)'};">${c.active ? 'ACTIVE' : 'EXPIRED'}</span></td>
                      <td>
                        <button class="btn btn-sm btn-ghost" onclick="app.handleToggleCoupon('${c.id}')">${c.active ? 'Disable' : 'Enable'}</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  // =========================================================================
  // 14. ENTERPRISE SUPER ADMIN CONTROL CENTER & ABUNDANT TOOLS SUITE
  // =========================================================================
  renderAdminDashboard(container) {
    this.currentAdminTab = this.currentAdminTab || 'queue';
    this.adminUserSearch = this.adminUserSearch || '';
    this.adminUserRoleFilter = this.adminUserRoleFilter || 'all';
    this.adminLogCategory = this.adminLogCategory || 'all';
    this.adminLogSearch = this.adminLogSearch || '';

    const queue = pkStore.state.adminQueue || [];
    const users = pkStore.state.adminUsers || [];
    const kyc = pkStore.state.adminKycRequests || [];
    const payouts = pkStore.state.adminPayoutRequests || [];
    const models = pkStore.state.adminModelRegistry || PK_DATA.models;
    const settings = pkStore.state.systemSettings || { platformCommissionRate: 15, minPayoutThreshold: 50 };

    const pendingKycCount = kyc.filter(k => k.status.includes('Pending')).length;
    const pendingPayoutTotal = payouts.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

    // Platform Analytics
    const platformStats = {
      gmv: 84390.00,
      commissionRate: settings.platformCommissionRate,
      netRevenue: 84390.00 * (settings.platformCommissionRate / 100),
      totalPrompts: PK_DATA.prompts.length + (pkStore.state.customPrompts?.length || 0),
      totalUsers: users.length + 18400,
      safetyPassRate: '99.8%',
      pendingPayouts: pendingPayoutTotal
    };

    container.innerHTML = `
      <div class="container dashboard-layout">
        <!-- Sidebar Navigation -->
        <aside class="dashboard-sidebar">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
            <div class="logo-icon-wrap" style="background: linear-gradient(135deg, #f43f5e, #e11d48); box-shadow: 0 0 15px rgba(244,63,94,0.4);"><i class="ph-bold ph-shield-check"></i></div>
            <div>
              <h4 style="font-weight: 800; font-size: 0.95rem;">Super Admin</h4>
              <span class="nav-pill-badge" style="background: rgba(244,63,94,0.15); color: #f43f5e; border-color: rgba(244,63,94,0.3);">FULL ROOT CONTROL</span>
            </div>
          </div>

          <ul class="dash-nav-list">
            <li class="dash-nav-item ${this.currentAdminTab === 'queue' ? 'active' : ''}">
              <a href="#admin-dashboard/queue" onclick="app.switchAdminTab('queue')">
                <i class="ph-bold ph-shield-check"></i> Moderation Queue (${queue.length})
              </a>
            </li>
            <li class="dash-nav-item ${this.currentAdminTab === 'batch-studio' ? 'active' : ''}">
              <a href="#admin-dashboard/autonomous" onclick="app.switchAdminTab('batch-studio')">
                <i class="ph-bold ph-cpu"></i> AI Autonomous Studio
              </a>
            </li>
            <li class="dash-nav-item ${this.currentAdminTab === 'users' ? 'active' : ''}">
              <a href="#admin-dashboard/users" onclick="app.switchAdminTab('users')">
                <i class="ph-bold ph-users-three"></i> User & RBAC Directory (${users.length})
              </a>
            </li>
            <li class="dash-nav-item ${this.currentAdminTab === 'kyc' ? 'active' : ''}">
              <a href="#admin-dashboard/kyc" onclick="app.switchAdminTab('kyc')">
                <i class="ph-bold ph-identification-card"></i> Seller KYC Approvals (${pendingKycCount})
              </a>
            </li>
            <li class="dash-nav-item ${this.currentAdminTab === 'finances' ? 'active' : ''}">
              <a href="#admin-dashboard/finances" onclick="app.switchAdminTab('finances')">
                <i class="ph-bold ph-bank"></i> Financial & Payout Ledger
              </a>
            </li>
            <li class="dash-nav-item ${this.currentAdminTab === 'economics' ? 'active' : ''}">
              <a href="#admin-dashboard/economics" onclick="app.switchAdminTab('economics')">
                <i class="ph-bold ph-chart-donut"></i> Platform Economics & Fees
              </a>
            </li>
            <li class="dash-nav-item ${this.currentAdminTab === 'models' ? 'active' : ''}">
              <a href="#admin-dashboard/models" onclick="app.switchAdminTab('models')">
                <i class="ph-bold ph-hard-drives"></i> AI Engine Gateway Registry
              </a>
            </li>
            <li class="dash-nav-item ${this.currentAdminTab === 'audit-logs' ? 'active' : ''}">
              <a href="#admin-dashboard/audit-logs" onclick="app.switchAdminTab('audit-logs')">
                <i class="ph-bold ph-terminal-window"></i> Security Audit Logs
              </a>
            </li>
            <li class="dash-nav-item">
              <a href="#home" onclick="app.switchRole('buyer')">
                <i class="ph-bold ph-arrow-left"></i> Exit Super Admin
              </a>
            </li>
          </ul>
        </aside>

        <!-- Main Content Area -->
        <main class="dashboard-content">
          <!-- Top Executive Metrics Ribbon -->
          <div class="admin-metric-grid">
            <div class="admin-metric-card">
              <span class="admin-metric-label">Platform Gross GMV</span>
              <div class="admin-metric-val text-gradient">$${platformStats.gmv.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <span class="stat-delta positive"><i class="ph-bold ph-trend-up"></i> +24.8% MoM</span>
            </div>
            <div class="admin-metric-card">
              <span class="admin-metric-label">Net Platform Commission (${settings.platformCommissionRate}%)</span>
              <div class="admin-metric-val" style="color: var(--accent-emerald);">$${platformStats.netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <span class="stat-delta positive"><i class="ph-bold ph-wallet"></i> Instant Split</span>
            </div>
            <div class="admin-metric-card">
              <span class="admin-metric-label">Active Master Prompts</span>
              <div class="admin-metric-val" style="color: var(--accent-cyan);">${platformStats.totalPrompts}</div>
              <span class="stat-delta positive"><i class="ph-bold ph-sparkle"></i> 100% Quality Checked</span>
            </div>
            <div class="admin-metric-card">
              <span class="admin-metric-label">Pending Payout Disbursements</span>
              <div class="admin-metric-val" style="color: ${platformStats.pendingPayouts > 0 ? '#f59e0b' : 'var(--accent-emerald)'};">$${platformStats.pendingPayouts.toFixed(2)}</div>
              <span class="stat-delta positive"><i class="ph-bold ph-bank"></i> ${payouts.filter(p => p.status === 'Pending').length} requests</span>
            </div>
          </div>

          <!-- Dynamic Active Sub-Tool Panel -->
          <div id="adminDynamicSubTab">
            ${this.renderAdminSubTabContent()}
          </div>
        </main>
      </div>
    `;
  }

  switchAdminTab(tabName) {
    this.currentAdminTab = tabName;
    const tabParam = tabName === 'batch-studio' ? 'autonomous' : tabName;
    window.location.hash = `admin-dashboard/${tabParam}`;
    const container = document.getElementById('appMain');
    if (container) this.renderAdminDashboard(container);
  }

  renderAdminSubTabContent() {
    const queue = pkStore.state.adminQueue || [];
    const users = pkStore.state.adminUsers || [];
    const kyc = pkStore.state.adminKycRequests || [];
    const payouts = pkStore.state.adminPayoutRequests || [];
    const logs = pkStore.state.adminAuditLogs || [];
    const models = pkStore.state.adminModelRegistry || PK_DATA.models;
    const settings = pkStore.state.systemSettings || { platformCommissionRate: 15, minPayoutThreshold: 50 };
    const coupons = pkStore.state.sellerCoupons || [];

    switch (this.currentAdminTab) {
      // =========================================================================
      // 1. AI AUTONOMOUS BATCH STUDIO (#admin-dashboard/autonomous)
      // =========================================================================
      case 'batch-studio':
        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-cpu" style="color: var(--accent-purple);"></i> Autonomous AI Prompt Studio & Multi-Model Synthesizer</h2>
                <p class="section-subtitle">Synthesize, parameterize, and publish certified master prompt suites across multiple AI models simultaneously.</p>
              </div>
            </div>

            <!-- Quick Preset Pills -->
            <div style="margin-bottom: 18px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-right: 8px;">Popular Synthesis Seeds:</span>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="app.setBatchPreset('Ultra-Realistic Architectural Penthouse Masterpieces & Volumetric Haze', 'flux', 4.99)">🏗️ Architecture (FLUX)</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="app.setBatchPreset('Cinematic Cyber-Fashion & Neon Holographic Editorial Portraits', 'midjourney', 5.49)">🎨 Cyber-Fashion (Midjourney)</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="app.setBatchPreset('Principal Full-Stack System Architect & High-Concurrency Code Auditor', 'claude', 6.99)">🧠 Software Architect (Claude)</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="app.setBatchPreset('Autonomous SaaS Marketing Engine & Viral Copywriting Framework', 'chatgpt', 3.99)">🤖 SaaS Growth (ChatGPT)</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="app.setBatchPreset('Quant Trading Algorithmic Strategies & Financial Data Analyst', 'deepseek', 5.99)">🐋 Financial Algos (DeepSeek)</button>
              </div>
            </div>

            <div id="batchStudioProgressWrap" style="display: none; margin-bottom: 24px; padding: 20px; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-glow);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span id="batchProgressLabel" style="font-weight: 700; color: var(--accent-cyan); font-size: 0.9rem;">Initializing Neural Synthesis Pipeline...</span>
                <span id="batchProgressPercent" style="font-weight: 800; font-family: var(--font-mono);">0%</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
                <div id="batchProgressBar" style="width: 0%; height: 100%; background: var(--grad-primary); transition: width 0.3s ease;"></div>
              </div>
            </div>

            <form onsubmit="app.handleAdminBatchGenerate(event)">
              <div class="form-group">
                <label class="form-label">Theme / Niche Generation Seed</label>
                <input type="text" class="form-input" id="adminBatchNiche" value="Ultra-Realistic Cinematic Architectural Masterpieces & Volumetric Lighting" required>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div class="form-group">
                  <label class="form-label">Target Model Engine</label>
                  <select class="form-select" id="adminBatchModel">
                    <option value="flux">FLUX</option>
                    <option value="midjourney">Midjourney</option>
                    <option value="claude">Claude</option>
                    <option value="chatgpt">ChatGPT</option>
                    <option value="deepseek">DeepSeek</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Batch Quantity</label>
                  <select class="form-select" id="adminBatchCount">
                    <option value="3">3 Master Prompts</option>
                    <option value="5" selected>5 Master Prompts</option>
                    <option value="10">10 Master Prompts</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Default Listing Price ($)</label>
                  <input type="number" step="0.50" min="0" class="form-input" id="adminBatchPrice" value="3.99">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div class="form-group">
                  <label class="form-label">Creativity & Neural Temperature (0.7)</label>
                  <input type="range" min="0.2" max="1.0" step="0.05" value="0.7" class="form-input" oninput="this.previousElementSibling.innerText = 'Creativity & Neural Temperature (' + this.value + ')'">
                </div>
                <div class="form-group">
                  <label class="form-label">Token Density & Parameter Verification</label>
                  <select class="form-select" id="adminBatchVerify">
                    <option value="strict">Strict SFW & Verified Commercial Rights</option>
                    <option value="creative">High Artistic Variance Mode</option>
                  </select>
                </div>
              </div>

              <div class="modal-footer-actions" style="margin-top: 0;">
                <button type="submit" id="btnRunBatchSynth" class="btn-creator-cta">
                  <span class="btn-icon-circle"><i class="ph-fill ph-sparkle"></i></span>
                  <span>Synthesize & Publish Batch Live</span>
                </button>
              </div>
            </form>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-subtle);">
              <h4 style="font-weight: 800; font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="ph-fill ph-vault" style="color: var(--accent-primary);"></i> Recently Synthesized Autonomous Prompts (${(pkStore.state.customPrompts || []).length})
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px;">
                ${(pkStore.state.customPrompts || []).slice(-6).map(p => `
                  <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span class="nav-pill-badge">${p.modelId.toUpperCase()}</span>
                      <span class="api-health-badge online">Live in Store</span>
                    </div>
                    <h5 style="font-size: 0.92rem; font-weight: 700; line-height: 1.3;">${p.title}</h5>
                    <p style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">${p.template.substring(0, 60)}...</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
                      <span style="font-weight: 800; color: var(--accent-emerald); font-size: 0.95rem;">$${Number(p.price).toFixed(2)}</span>
                      <button class="btn btn-sm btn-secondary" onclick="app.navigate('prompt-detail/${p.id}')">View Listing</button>
                    </div>
                  </div>
                `).join('') || '<p style="color: var(--text-muted); font-size: 0.85rem;">No batch prompts generated yet in this session. Click synthesize above!</p>'}
              </div>
            </div>
          </div>
        `;

      // =========================================================================
      // 2. USER & RBAC PERMISSION MANAGEMENT DIRECTORY (#admin-dashboard/users)
      // =========================================================================
      case 'users':
        const filteredUsers = users.filter(u => {
          const matchSearch = !this.adminUserSearch || u.name.toLowerCase().includes(this.adminUserSearch.toLowerCase()) || u.email.toLowerCase().includes(this.adminUserSearch.toLowerCase()) || u.username.toLowerCase().includes(this.adminUserSearch.toLowerCase());
          const matchRole = this.adminUserRoleFilter === 'all' || u.role.toLowerCase() === this.adminUserRoleFilter.toLowerCase();
          return matchSearch && matchRole;
        });

        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-users-three" style="color: var(--accent-cyan);"></i> User & RBAC Permission Management</h2>
                <p class="section-subtitle">Inspect registered creators and buyers, grant free generation credits, ban abusive accounts, or change permissions.</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="app.handleAdminCreateStaffModal()">
                <i class="ph-bold ph-user-plus"></i> + Add Staff / Admin
              </button>
            </div>

            <!-- Filter Controls -->
            <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
              <input type="text" class="form-input" style="max-width: 280px;" placeholder="Search user by name, email..." value="${this.adminUserSearch}" oninput="app.handleAdminUserSearch(this.value)">
              <select class="form-select" style="max-width: 180px;" onchange="app.handleAdminUserRoleFilter(this.value)">
                <option value="all" ${this.adminUserRoleFilter === 'all' ? 'selected' : ''}>All Roles</option>
                <option value="PRO MASTER" ${this.adminUserRoleFilter === 'PRO MASTER' ? 'selected' : ''}>Pro Master</option>
                <option value="TOP SELLER" ${this.adminUserRoleFilter === 'TOP SELLER' ? 'selected' : ''}>Top Seller</option>
                <option value="CREATOR" ${this.adminUserRoleFilter === 'CREATOR' ? 'selected' : ''}>Creator</option>
                <option value="BUYER" ${this.adminUserRoleFilter === 'BUYER' ? 'selected' : ''}>Buyer</option>
              </select>
            </div>

            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Email</th>
                    <th>Role & Permissions</th>
                    <th>Free Credits</th>
                    <th>Sales Volume</th>
                    <th>Account Status</th>
                    <th>RBAC Controls</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredUsers.map(u => `
                    <tr>
                      <td style="font-weight: 700;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <img src="${u.avatar}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover;" alt="Avatar">
                          <div>
                            <div>${u.name}</div>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">@${u.username}</span>
                          </div>
                        </div>
                      </td>
                      <td>${u.email}</td>
                      <td>
                        <select class="form-select" style="padding: 4px 8px; font-size: 0.78rem; width: auto;" onchange="app.handleAdminChangeUserRole('${u.id}', this.value)">
                          <option value="BUYER" ${u.role === 'BUYER' ? 'selected' : ''}>BUYER</option>
                          <option value="CREATOR" ${u.role === 'CREATOR' ? 'selected' : ''}>CREATOR</option>
                          <option value="TOP SELLER" ${u.role === 'TOP SELLER' ? 'selected' : ''}>TOP SELLER</option>
                          <option value="PRO MASTER" ${u.role === 'PRO MASTER' ? 'selected' : ''}>PRO MASTER</option>
                        </select>
                      </td>
                      <td style="font-weight: 800; color: var(--accent-amber);">${u.credits}⚡</td>
                      <td style="font-weight: 800;">$${Number(u.salesVolume).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span class="api-health-badge ${u.status === 'Active' ? 'online' : ''}" style="${u.status !== 'Active' ? 'background: rgba(244,63,94,0.15); color: #f43f5e; border: 1px solid rgba(244,63,94,0.3);' : ''}">
                          ● ${u.status}
                        </span>
                      </td>
                      <td>
                        <div style="display: flex; gap: 6px;">
                          <button class="btn btn-sm btn-secondary" onclick="app.handleAdminGrantCredits('${u.id}', 500)" title="Grant 500 free generation credits">+500⚡</button>
                          <button class="btn btn-sm ${u.status === 'Active' ? 'btn-secondary' : 'btn-primary'}" onclick="app.handleAdminToggleUserStatus('${u.id}')" title="Ban or Activate user">
                            ${u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button class="btn btn-sm btn-ghost" onclick="app.handleAdminImpersonate('${u.username}')" title="Simulate Session"><i class="ph-bold ph-eye"></i></button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

      // =========================================================================
      // 3. SELLER KYC & ID APPROVALS (#admin-dashboard/kyc)
      // =========================================================================
      case 'kyc':
        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-identification-badge" style="color: var(--accent-cyan);"></i> Creator KYC & Identity Verification Portal</h2>
                <p class="section-subtitle">Review official government ID submissions, inspect biometric match confidence, and grant Certified Selling privileges.</p>
              </div>
            </div>

            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Country</th>
                    <th>ID Document</th>
                    <th>Biometric Score</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Verification Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${kyc.map(item => `
                    <tr>
                      <td style="font-weight: 700;">
                        <div>${item.name}</div>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">@${item.username}</span>
                      </td>
                      <td>${item.country}</td>
                      <td><code>${item.documentName}</code></td>
                      <td style="font-weight: 800; color: var(--accent-emerald);">${item.matchScore} Match</td>
                      <td style="color: var(--text-muted);">${item.submittedAt}</td>
                      <td>
                        <span class="nav-pill-badge" style="${item.status.includes('Approved') ? 'background: rgba(16,185,129,0.15); color: var(--accent-emerald);' : 'background: rgba(245,158,11,0.15); color: #f59e0b;'}">
                          ${item.status}
                        </span>
                      </td>
                      <td>
                        <div style="display: flex; gap: 8px;">
                          ${!item.status.includes('Approved') ? `
                            <button class="btn btn-sm btn-primary" onclick="app.handleAdminApproveKyc('${item.id}')">
                              <i class="ph-bold ph-check"></i> Approve Tier-2
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.showToast('Sent request for supplemental bank statement / proof of residency.', 'info')">
                              Request Docs
                            </button>
                          ` : `
                            <span style="color: var(--accent-emerald); font-size: 0.82rem; font-weight: 700;"><i class="ph-bold ph-check-circle"></i> Certified</span>
                          `}
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

      // =========================================================================
      // 4. FINANCIAL LEDGER & PAYOUT DISBURSEMENTS (#admin-dashboard/finances)
      // =========================================================================
      case 'finances':
        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-bank" style="color: var(--accent-emerald);"></i> Financial Ledger & Creator Payout Disbursements</h2>
                <p class="section-subtitle">Inspect pending seller withdrawal requests, verify payout addresses, and trigger batch disbursements.</p>
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary btn-sm" onclick="app.handleExportPayoutsCsv()">
                  <i class="ph-bold ph-download-simple"></i> Export CSV
                </button>
                <button class="btn btn-primary btn-sm" onclick="app.handleAdminDisburseAllPayouts()">
                  <i class="ph-bold ph-paper-plane-tilt"></i> Disburse All Pending
                </button>
              </div>
            </div>

            <!-- Manual Creator Bonus / Direct Payout Dispatcher Form -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
              <h4 style="font-weight: 800; font-size: 0.95rem; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <i class="ph-bold ph-paper-plane"></i> Quick Payout / Creator Bonus Dispatcher
              </h4>
              <form onsubmit="app.handleAdminManualPayout(event)" style="display: grid; grid-template-columns: 1.2fr 1fr 1fr auto; gap: 12px; align-items: end;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.78rem;">Creator Username</label>
                  <input type="text" class="form-input" id="adminManualSeller" placeholder="@NeuralAlchemist" required>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.78rem;">Amount ($ USD)</label>
                  <input type="number" step="1" min="10" class="form-input" id="adminManualAmount" placeholder="250.00" required>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.78rem;">Payment Route</label>
                  <select class="form-select" id="adminManualMethod">
                    <option value="Stripe Connect">Stripe Connect</option>
                    <option value="PayPal">PayPal</option>
                    <option value="USDT (Crypto)">USDT (Crypto ERC-20)</option>
                    <option value="Bank SWIFT">Bank SWIFT Wire</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary btn-sm" style="height: 38px;">
                  Dispatch Payout
                </button>
              </form>
            </div>

            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Payout Ref</th>
                    <th>Seller Name</th>
                    <th>Payment Method</th>
                    <th>Destination Details</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${payouts.map(p => `
                    <tr>
                      <td><code>#${p.id}</code></td>
                      <td style="font-weight: 700;">${p.sellerName}</td>
                      <td><span class="nav-pill-badge">${p.method}</span></td>
                      <td><code>${p.destination}</code></td>
                      <td style="font-weight: 800; color: var(--accent-emerald); font-size: 0.95rem;">$${p.amount.toFixed(2)}</td>
                      <td style="color: var(--text-muted);">${p.date}</td>
                      <td>
                        <span class="api-health-badge ${p.status === 'Paid' ? 'online' : ''}" style="${p.status !== 'Paid' ? 'background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3);' : ''}">
                          ● ${p.status}
                        </span>
                      </td>
                      <td>
                        ${p.status === 'Pending' ? `
                          <button class="btn btn-sm btn-primary" onclick="app.handleAdminDisbursePayout('${p.id}')">
                            <i class="ph-bold ph-check"></i> Disburse Payout
                          </button>
                        ` : `
                          <span style="color: var(--accent-emerald); font-size: 0.8rem; font-weight: 700;">Completed</span>
                        `}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

      // =========================================================================
      // 5. PLATFORM ECONOMICS, COMMISSION & PRICING ENGINE (#admin-dashboard/economics)
      // =========================================================================
      case 'economics':
        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-chart-donut" style="color: #f59e0b;"></i> Platform Economics, Commission & Pricing Engine</h2>
                <p class="section-subtitle">Set global platform commission rates, creator revenue splits, and platform transaction rules.</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
              <!-- Economics Settings Form -->
              <div class="create-form-section" style="margin-bottom: 0;">
                <h4 style="font-weight: 800; margin-bottom: 12px; font-size: 1.05rem;">Marketplace Commission Split</h4>
                <div class="form-group">
                  <label class="form-label" style="display: flex; justify-content: space-between;">
                    <span>Platform Commission (%):</span>
                    <strong id="commissionRateDisplay" style="color: var(--accent-primary); font-size: 1.15rem;">${settings.platformCommissionRate}%</strong>
                  </label>
                  <input type="range" min="5" max="30" value="${settings.platformCommissionRate}" class="form-input" id="inputAdminCommission" oninput="app.updateCommissionSimulator(this.value)">
                  <span style="font-size: 0.78rem; color: var(--text-muted);">Creator receives remaining percentage upon every prompt purchase.</span>
                </div>

                <div class="form-group">
                  <label class="form-label">Minimum Payout Withdrawal Threshold ($)</label>
                  <input type="number" min="10" max="500" value="${settings.minPayoutThreshold}" id="inputAdminMinPayout" class="form-input">
                </div>

                <button class="btn btn-primary btn-sm" onclick="app.handleAdminSaveEconomics()">
                  <i class="ph-bold ph-check"></i> Save & Apply Globally
                </button>
              </div>

              <!-- Create Global Platform Promo Code -->
              <div class="create-form-section" style="margin-bottom: 0;">
                <h4 style="font-weight: 800; margin-bottom: 12px; font-size: 1.05rem;">Create Global Platform Discount Coupon</h4>
                <form onsubmit="app.handleAdminCreateCoupon(event)">
                  <div class="form-group">
                    <label class="form-label">Promo Code (e.g. SUPER50)</label>
                    <input type="text" class="form-input" id="adminCouponCode" placeholder="PROMO_CODE" required>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                      <label class="form-label">Discount (%)</label>
                      <input type="number" min="5" max="90" value="25" class="form-input" id="adminCouponDiscount" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Max Uses</label>
                      <input type="number" min="1" max="1000" value="100" class="form-input" id="adminCouponMaxUses" required>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm">
                    <i class="ph-bold ph-ticket"></i> Deploy Platform Coupon
                  </button>
                </form>
              </div>
            </div>

            <!-- Active Coupons Table -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px;">
              <h4 style="font-weight: 800; font-size: 0.95rem; margin-bottom: 12px;">Active Platform Promo Codes (${coupons.length})</h4>
              <div class="data-table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Coupon Code</th>
                      <th>Discount</th>
                      <th>Redemptions</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${coupons.map(c => `
                      <tr>
                        <td style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-primary);">${c.code}</td>
                        <td style="font-weight: 700;">${c.discountPercent}% OFF</td>
                        <td>${c.uses} / ${c.maxUses}</td>
                        <td><span class="api-health-badge ${c.active ? 'online' : ''}">${c.active ? 'Active' : 'Disabled'}</span></td>
                        <td>
                          <button class="btn btn-sm btn-ghost" onclick="app.handleToggleCoupon('${c.id}')">${c.active ? 'Deactivate' : 'Activate'}</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;

      // =========================================================================
      // 6. AI MODEL REGISTRY & GATEWAY API HEALTH MONITOR (#admin-dashboard/models)
      // =========================================================================
      case 'models':
        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-hard-drives" style="color: var(--accent-cyan);"></i> AI Model Registry & Gateway Telemetry Monitor</h2>
                <p class="section-subtitle">Real-time gateway latency, active model engine switches, and live diagnostic health telemetry.</p>
              </div>
            </div>

            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>AI Model Engine</th>
                    <th>Gateway Health</th>
                    <th>Live Response Latency</th>
                    <th>Active Catalog Listings</th>
                    <th>Marketplace Status</th>
                    <th>Diagnostic Telemetry</th>
                  </tr>
                </thead>
                <tbody>
                  ${models.map(m => `
                    <tr>
                      <td style="font-weight: 800; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.4rem;">${m.icon}</span>
                        ${m.name}
                      </td>
                      <td>
                        <span class="api-health-badge ${m.isEnabled !== false ? 'online' : ''}" style="${m.isEnabled === false ? 'background: rgba(244,63,94,0.15); color: #f43f5e;' : ''}">
                          ● ${m.isEnabled !== false ? 'Healthy (99.99%)' : 'Disabled'}
                        </span>
                      </td>
                      <td style="font-family: var(--font-mono); color: var(--accent-emerald);" id="pingLatency_${m.id}">~${m.latencyMs || 140}ms</td>
                      <td style="font-weight: 700;">${m.activeListings || 40}+ Prompts</td>
                      <td>
                        <button class="btn btn-sm ${m.isEnabled !== false ? 'btn-secondary' : 'btn-primary'}" onclick="app.handleAdminToggleModelEngine('${m.id}')">
                          ${m.isEnabled !== false ? 'Disable Engine' : 'Enable Engine'}
                        </button>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-secondary" onclick="app.handleAdminPingModel('${m.id}', '${m.name}')">
                          <i class="ph-bold ph-activity"></i> Test Ping
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

      // =========================================================================
      // 7. SECURITY AUDIT LOGS (#admin-dashboard/audit-logs)
      // =========================================================================
      case 'audit-logs':
        const filteredLogs = logs.filter(l => {
          const matchCat = this.adminLogCategory === 'all' || l.category === this.adminLogCategory;
          const matchSearch = !this.adminLogSearch || l.detail.toLowerCase().includes(this.adminLogSearch.toLowerCase()) || l.event.toLowerCase().includes(this.adminLogSearch.toLowerCase());
          return matchCat && matchSearch;
        });

        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-terminal-window" style="color: var(--accent-cyan);"></i> Platform Security Audit Logs</h2>
                <p class="section-subtitle">Real-time immutable audit trail of logins, transaction flows, permission elevations, and payouts.</p>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm" onclick="app.handleAdminSimulateScan()">
                  <i class="ph-bold ph-shield-check"></i> Run Integrity Scan
                </button>
                <button class="btn btn-secondary btn-sm" onclick="app.handleExportAuditLogsCsv()">
                  <i class="ph-bold ph-download-simple"></i> Export CSV
                </button>
              </div>
            </div>

            <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
              <input type="text" class="form-input" style="max-width: 280px;" placeholder="Search logs..." value="${this.adminLogSearch}" oninput="app.handleAdminLogSearch(this.value)">
              <select class="form-select" style="max-width: 180px;" onchange="app.handleAdminLogCategoryFilter(this.value)">
                <option value="all" ${this.adminLogCategory === 'all' ? 'selected' : ''}>All Categories</option>
                <option value="AUTH" ${this.adminLogCategory === 'AUTH' ? 'selected' : ''}>AUTH</option>
                <option value="PAYOUT" ${this.adminLogCategory === 'PAYOUT' ? 'selected' : ''}>PAYOUT</option>
                <option value="MODERATION" ${this.adminLogCategory === 'MODERATION' ? 'selected' : ''}>MODERATION</option>
                <option value="RBAC" ${this.adminLogCategory === 'RBAC' ? 'selected' : ''}>RBAC</option>
                <option value="PROMPT_FACTORY" ${this.adminLogCategory === 'PROMPT_FACTORY' ? 'selected' : ''}>PROMPT FACTORY</option>
                <option value="ECONOMICS" ${this.adminLogCategory === 'ECONOMICS' ? 'selected' : ''}>ECONOMICS</option>
              </select>
            </div>

            <div class="audit-log-terminal">
              ${filteredLogs.map(item => `
                <div class="audit-log-entry">
                  <span class="audit-log-time">[${item.timestamp}]</span>
                  <span class="audit-log-event">${item.event}</span>
                  <span class="audit-log-detail">${item.detail}</span>
                </div>
              `).join('') || '<div style="color: var(--text-muted); padding: 12px;">No logs matching current criteria.</div>'}
            </div>
          </div>
        `;

      // =========================================================================
      // 8. PROMPT REVIEW & MODERATION QUEUE (#admin-dashboard/queue)
      // =========================================================================
      case 'queue':
      default:
        return `
          <div class="admin-tool-card">
            <div class="section-header" style="margin-bottom: 20px;">
              <div>
                <h2 class="section-title"><i class="ph-fill ph-shield-check" style="color: #f43f5e;"></i> Prompt Review & Moderation Queue</h2>
                <p class="section-subtitle">Review new seller submissions, inspect master prompt templates, verify parameters, approve or feature on homepage.</p>
              </div>
              <button class="btn-creator-cta" onclick="app.switchAdminTab('batch-studio')">
                <span class="btn-icon-circle"><i class="ph-fill ph-sparkle"></i></span>
                <span>Launch Autonomous Batch Studio</span>
              </button>
            </div>

            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Prompt Title</th>
                    <th>Seller</th>
                    <th>Target AI</th>
                    <th>Listing Price</th>
                    <th>Submitted</th>
                    <th>Moderation Decision</th>
                  </tr>
                </thead>
                <tbody>
                  ${queue.length > 0 ? queue.map(item => `
                    <tr>
                      <td style="font-weight: 700;">
                        <div>${item.promptTitle}</div>
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${item.template ? item.template.substring(0, 50) + '...' : ''}</span>
                      </td>
                      <td>${item.creatorName}</td>
                      <td><span class="nav-pill-badge">${item.model.toUpperCase()}</span></td>
                      <td style="font-weight: 800; color: var(--accent-emerald);">$${Number(item.price).toFixed(2)}</td>
                      <td style="color: var(--text-muted);">${item.submittedAt}</td>
                      <td>
                        <div style="display: flex; gap: 8px;">
                          <button class="btn btn-sm btn-primary" onclick="app.handleAdminApprove('${item.id}')">
                            <i class="ph-bold ph-check"></i> Approve
                          </button>
                          <button class="btn btn-sm btn-secondary" onclick="app.handleAdminFeature('${item.id}')">
                            ⭐ Feature
                          </button>
                          <button class="btn btn-sm btn-secondary" style="color: #f43f5e;" onclick="app.handleAdminReject('${item.id}')">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <i class="ph-bold ph-check-circle" style="font-size: 2.5rem; color: var(--accent-emerald); display: block; margin-bottom: 8px;"></i>
                        All submissions have been reviewed! The queue is completely empty.
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        `;
    }
  }

  setBatchPreset(niche, model, price) {
    const nicheInput = document.getElementById('adminBatchNiche');
    const modelSelect = document.getElementById('adminBatchModel');
    const priceInput = document.getElementById('adminBatchPrice');
    if (nicheInput) nicheInput.value = niche;
    if (modelSelect) modelSelect.value = model;
    if (priceInput) priceInput.value = price;
    this.showToast(`Applied preset for ${model.toUpperCase()}!`, 'info');
  }

  updateCommissionSimulator(val) {
    const display = document.getElementById('commissionRateDisplay');
    if (display) display.innerText = val + '%';
  }

  handleAdminCreateStaffModal() {
    const name = prompt('Enter staff member name:', 'Elena Vance');
    if (!name) return;
    const email = prompt('Enter staff member email:', 'elena@promptkitt.io');
    if (!email) return;
    const role = prompt('Enter staff role (ADMIN / MODERATOR / CURATOR):', 'ADMIN') || 'ADMIN';

    pkStore.state.adminUsers.push({
      id: 'u_' + Date.now(),
      name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      email,
      role: role.toUpperCase(),
      credits: 2500,
      salesVolume: 0.00,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    });

    pkStore.adminAddAuditLog('RBAC', 'STAFF_CREATED', `Added new staff member ${name} (${role.toUpperCase()})`);
    pkStore.saveState();
    this.showToast(`New staff member ${name} added successfully!`, 'success');
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminImpersonate(username) {
    this.showToast(`Simulating active session for creator @${username}...`, 'info');
    setTimeout(() => {
      this.navigate('profile');
    }, 400);
  }

  handleAdminManualPayout(e) {
    e.preventDefault();
    const seller = document.getElementById('adminManualSeller').value;
    const amount = parseFloat(document.getElementById('adminManualAmount').value) || 100;
    const method = document.getElementById('adminManualMethod').value;

    const payoutObj = {
      id: 'PO-' + Math.floor(Math.random() * 8000 + 1000),
      sellerName: seller.replace(/^@/, ''),
      method: method,
      destination: method.includes('Crypto') ? '0x71C...B29' : `${seller.replace(/^@/, '').toLowerCase()}@payout.net`,
      amount: amount,
      status: 'Paid',
      date: 'Just now'
    };

    pkStore.state.adminPayoutRequests.unshift(payoutObj);
    pkStore.adminAddAuditLog('PAYOUT', 'MANUAL_DISBURSEMENT', `Manual payout of $${amount.toFixed(2)} dispatched to ${seller} via ${method}`);
    pkStore.saveState();

    this.showToast(`Dispatched immediate payout of $${amount.toFixed(2)} to ${seller}!`, 'success');
    this.renderAdminDashboard(document.getElementById('appMain'));
  }

  handleAdminSimulateScan() {
    this.showToast('Running comprehensive platform vulnerability & cryptographic hash integrity scan...', 'info');
    setTimeout(() => {
      pkStore.adminAddAuditLog('SECURITY', 'INTEGRITY_SCAN', 'Cryptographic database scan completed. 0 vulnerabilities, 100% token safety verified.');
      this.showToast('Security scan completed: Zero vulnerabilities detected. System 100% Secure!', 'success');
      const subContainer = document.getElementById('adminDynamicSubTab');
      if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
    }, 800);
  }

  // =========================================================================
  // ADMIN INTERACTIVE HANDLERS
  // =========================================================================
  handleAdminApprove(id) {
    pkStore.adminApprovePrompt(id);
    this.showToast('Prompt approved and published live to marketplace catalog!', 'success');
    this.renderAdminDashboard(document.getElementById('appMain'));
  }

  handleAdminFeature(id) {
    pkStore.adminFeaturePrompt(id);
    this.showToast('Prompt approved and pinned as Featured on Homepage!', 'success');
    this.renderAdminDashboard(document.getElementById('appMain'));
  }

  handleAdminReject(id) {
    const reason = prompt('Please specify a rejection reason for the creator:', 'Parameters need further calibration');
    if (reason) {
      pkStore.adminRejectPrompt(id, reason);
      this.showToast('Prompt rejected and seller notified with reason.', 'info');
      this.renderAdminDashboard(document.getElementById('appMain'));
    }
  }

  handleAdminBatchGenerate(e) {
    e.preventDefault();
    const niche = document.getElementById('adminBatchNiche').value;
    const model = document.getElementById('adminBatchModel').value;
    const count = parseInt(document.getElementById('adminBatchCount').value) || 5;
    const price = parseFloat(document.getElementById('adminBatchPrice').value) || 3.99;

    const progressWrap = document.getElementById('batchStudioProgressWrap');
    const progressBar = document.getElementById('batchProgressBar');
    const progressLabel = document.getElementById('batchProgressLabel');
    const progressPercent = document.getElementById('batchProgressPercent');
    const submitBtn = document.getElementById('btnRunBatchSynth');

    if (progressWrap) progressWrap.style.display = 'block';
    if (submitBtn) submitBtn.disabled = true;

    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      if (progressBar) progressBar.style.width = `${p}%`;
      if (progressPercent) progressPercent.innerText = `${p}%`;

      if (p === 25) progressLabel.innerText = 'Tokenizing prompt variations & bracket variables...';
      if (p === 50) progressLabel.innerText = `Calibrating ${model.toUpperCase()} neural hyper-parameters...`;
      if (p === 75) progressLabel.innerText = 'Generating 4K showcase renders & safety analysis...';

      if (p >= 100) {
        clearInterval(interval);
        for (let i = 1; i <= count; i++) {
          pkStore.state.customPrompts.push({
            id: 'p_batch_' + Date.now() + '_' + i,
            title: `${niche} [Master Suite #${Math.floor(Math.random()*900)+100}]`,
            category: 'photorealistic',
            modelId: model,
            price: price,
            template: `Award-winning master prompt for ${niche}. Optimized for ${model.toUpperCase()} with dynamic lighting, high resolution and rich photorealism.`,
            instructions: `Use default ${model.toUpperCase()} settings. Aspect ratio 16:9 recommended.`,
            description: `Autonomous high-converting master prompt synthesized by Admin AI Studio.`,
            coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
            qualityScore: 99,
            rating: 5.0,
            reviewsCount: 0,
            salesCount: 0,
            isFeatured: false
          });
        }
        pkStore.adminAddAuditLog('PROMPT_FACTORY', 'BATCH_SYNTHESIS', `Synthesized and published batch of ${count} prompts for "${niche}" (${model.toUpperCase()})`);
        pkStore.saveState();
        this.showToast(`Successfully synthesized and published ${count} master prompts live!`, 'success');
        this.renderAdminDashboard(document.getElementById('appMain'));
      }
    }, 350);
  }

  handleAdminUserSearch(val) {
    this.adminUserSearch = val;
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminUserRoleFilter(val) {
    this.adminUserRoleFilter = val;
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminToggleUserStatus(userId) {
    const status = pkStore.adminToggleUserStatus(userId);
    this.showToast(`User status updated to ${status}!`, 'info');
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminGrantCredits(userId, amount) {
    const newBal = pkStore.adminGrantUserCredits(userId, amount);
    this.showToast(`Granted +${amount}⚡ credits to user! New balance: ${newBal}⚡`, 'success');
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminChangeUserRole(userId, newRole) {
    pkStore.adminChangeUserRole(userId, newRole);
    this.showToast(`User role elevated to ${newRole}!`, 'success');
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminApproveKyc(kycId) {
    pkStore.adminApproveKyc(kycId);
    this.showToast('Seller KYC verified and Certified Selling rights granted!', 'success');
    this.renderAdminDashboard(document.getElementById('appMain'));
  }

  handleAdminDisbursePayout(payoutId) {
    pkStore.adminDisbursePayout(payoutId);
    this.showToast(`Payout #${payoutId} disbursed successfully!`, 'success');
    this.renderAdminDashboard(document.getElementById('appMain'));
  }

  handleAdminDisburseAllPayouts() {
    const res = pkStore.adminDisburseAllPayouts();
    if (res.count > 0) {
      this.showToast(`Disbursed ${res.count} pending payouts totaling $${res.total.toFixed(2)}!`, 'success');
    } else {
      this.showToast('No pending payouts to disburse.', 'info');
    }
    this.renderAdminDashboard(document.getElementById('appMain'));
  }

  handleAdminSaveEconomics() {
    const rate = document.getElementById('inputAdminCommission').value;
    const minPayout = document.getElementById('inputAdminMinPayout').value;
    pkStore.adminUpdateEconomics(rate, minPayout);
    this.showToast('Global platform economics and commission updated!', 'success');
    this.renderAdminDashboard(document.getElementById('appMain'));
  }

  handleAdminCreateCoupon(e) {
    e.preventDefault();
    const code = document.getElementById('adminCouponCode').value;
    const discount = document.getElementById('adminCouponDiscount').value;
    const maxUses = document.getElementById('adminCouponMaxUses').value;

    pkStore.addSellerCoupon(code, discount, maxUses);
    pkStore.adminAddAuditLog('ECONOMICS', 'COUPON_CREATED', `Platform coupon "${code.toUpperCase()}" (${discount}% off) deployed`);
    this.showToast(`Platform coupon ${code.toUpperCase()} deployed globally!`, 'success');
    document.getElementById('adminCouponCode').value = '';
  }

  handleAdminToggleModelEngine(modelId) {
    const isEnabled = pkStore.adminToggleModelEngine(modelId);
    this.showToast(`Model ${modelId.toUpperCase()} is now ${isEnabled ? 'ENABLED' : 'DISABLED'}!`, 'info');
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminPingModel(modelId, modelName) {
    const lat = Math.floor(Math.random() * 60) + 80;
    const el = document.getElementById(`pingLatency_${modelId}`);
    if (el) el.innerText = `~${lat}ms (200 OK)`;
    this.showToast(`${modelName} Gateway returned 200 OK (Latency: ${lat}ms)`, 'success');
  }

  handleAdminLogSearch(val) {
    this.adminLogSearch = val;
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleAdminLogCategoryFilter(val) {
    this.adminLogCategory = val;
    const subContainer = document.getElementById('adminDynamicSubTab');
    if (subContainer) subContainer.innerHTML = this.renderAdminSubTabContent();
  }

  handleExportPayoutsCsv() {
    const payouts = pkStore.state.adminPayoutRequests || [];
    let csv = 'Payout_ID,Seller_Name,Method,Destination,Amount_USD,Date,Status\n';
    payouts.forEach(p => {
      csv += `"${p.id}","${p.sellerName}","${p.method}","${p.destination}",${p.amount},"${p.date}","${p.status}"\n`;
    });
    this.downloadCsvFile('PromptKitt_Payouts_Ledger.csv', csv);
    this.showToast('Payout ledger exported as CSV!', 'success');
  }

  handleExportAuditLogsCsv() {
    const logs = pkStore.state.adminAuditLogs || [];
    let csv = 'Timestamp,Category,Event,Detail\n';
    logs.forEach(l => {
      csv += `"${l.timestamp}","${l.category}","${l.event}","${l.detail.replace(/"/g, '""')}"\n`;
    });
    this.downloadCsvFile('PromptKitt_Security_Audit_Logs.csv', csv);
    this.showToast('Security audit logs exported as CSV!', 'success');
  }

  downloadCsvFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // =========================================================================
  // HELPER CARD RENDERERS
  // =========================================================================
  renderPromptCard(p) {
    const creator = PK_DATA.creators.find(c => c.id === p.creatorId) || PK_DATA.creators[0];
    const isFav = pkStore.isFavorite(p.id);

    return `
      <div class="prompt-card" onclick="app.navigate('prompt-detail/${p.id}')">
        <div class="prompt-card-media">
          <img src="${p.coverImage}" class="prompt-card-img" alt="${p.title}" loading="lazy">
          <div class="prompt-model-badge">
            <i class="ph-fill ph-cpu"></i> ${p.modelId.toUpperCase()}
          </div>
          <div class="prompt-quality-score-badge">
            <i class="ph-bold ph-shield-check"></i> ${p.qualityScore}/100
          </div>
          <button class="prompt-card-fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); app.handleToggleFav('${p.id}')" title="Favorite">
            <i class="ph-bold ph-heart"></i>
          </button>
        </div>

        <div class="prompt-card-body">
          <span class="prompt-card-category">${p.category}</span>
          <h3 class="prompt-card-title">${p.title}</h3>
          <p class="prompt-card-desc">${p.description}</p>

          <div class="prompt-variables-preview">
            ${(p.variables || []).slice(0, 3).map(v => `<span class="var-tag">[${v.key}]</span>`).join('')}
            ${(p.variables || []).length > 3 ? `<span class="var-tag">+${p.variables.length - 3} more</span>` : ''}
          </div>

          <div class="prompt-card-footer">
            <div class="prompt-creator-meta" onclick="event.stopPropagation(); app.navigate('creator/${creator.id}')">
              <img src="${creator.avatar}" class="creator-avatar-sm" alt="${creator.displayName}">
              <span class="creator-name-sm">${creator.displayName.split(' ')[0]}</span>
              <i class="ph-fill ph-check-circle verified-check-sm"></i>
            </div>
            <div class="prompt-pricing-action">
              <span class="prompt-price-tag ${p.price == 0 ? 'free' : ''}">
                ${p.price == 0 ? 'FREE' : `$${p.price.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCollectionCard(c) {
    return `
      <div class="collection-card" onclick="app.navigate('explore')">
        <div class="collection-previews">
          ${c.images.map(img => `<img src="${img}" alt="Preview">`).join('')}
        </div>
        <span class="nav-pill-badge" style="width: fit-content; margin-bottom: 8px;">BUNDLE SAVINGS: -${c.discountPercent}%</span>
        <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin-bottom: 6px;">${c.title}</h3>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 16px;">${c.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
          <div>
            <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.85rem; margin-right: 6px;">$${c.originalPrice}</span>
            <span style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: var(--accent-emerald);">$${c.price}</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.handleAddToCart('${c.id}', true)">
            <i class="ph-bold ph-shopping-bag"></i> Get Bundle
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // ACTIONS & MODALS LOGIC
  // =========================================================================
  searchFromHero() {
    const input = document.getElementById('heroSearchInput');
    const modelSelect = document.getElementById('heroModelSelect');
    if (input) this.searchQuery = input.value.trim().toLowerCase();
    if (modelSelect) this.activeFilterModel = modelSelect.value;
    this.navigate('explore');
  }

  quickSearch(term) {
    this.searchQuery = term.toLowerCase();
    this.navigate('explore');
  }

  clearFilters() {
    this.searchQuery = '';
    this.activeFilterModel = 'all';
    this.activeFilterCategory = 'all';
    this.renderExplore();
  }

  handleToggleFav(promptId) {
    pkStore.toggleFavorite(promptId);
    const isFav = pkStore.isFavorite(promptId);
    this.showToast(isFav ? 'Added to favorites!' : 'Removed from favorites.');
    this.renderCurrentView();
  }

  handleToggleFollow(creatorId) {
    pkStore.toggleFollowCreator(creatorId);
    const isFollowing = pkStore.isFollowingCreator(creatorId);
    this.showToast(isFollowing ? 'You are now following this creator!' : 'Unfollowed creator.');
    this.renderCurrentView();
  }

  handleAddToCart(itemId, isCollection = false) {
    let item;
    if (isCollection) {
      item = PK_DATA.collections.find(c => c.id === itemId);
    } else {
      const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
      item = allPrompts.find(p => p.id === itemId);
    }
    if (item) {
      const added = pkStore.addToCart(item);
      if (added) {
        this.showToast(`Added "${item.title.substring(0, 30)}..." to Cart!`, 'success');
        this.openCartDrawer();
      } else {
        this.showToast('Item is already in your cart.');
      }
    }
  }

  quickBuy(promptId) {
    this.handleAddToCart(promptId);
    this.openCheckoutModal();
  }

  interpolatePrompt(template, vars) {
    let result = template;
    for (const [k, v] of Object.entries(vars)) {
      const regex = new RegExp(`\\[${k}[^\\]]*\\]`, 'g');
      result = result.replace(regex, v);
    }
    return result;
  }

  updateVariablePreview(promptId) {
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const prompt = allPrompts.find(p => p.id === promptId);
    if (!prompt) return;

    const currentVars = {};
    const inputs = document.querySelectorAll('#simulatorInputs input');
    inputs.forEach(inp => {
      const key = inp.getAttribute('data-varkey');
      if (key) currentVars[key] = inp.value;
    });

    const display = document.getElementById('interpolatedPreviewText');
    if (display) {
      display.innerText = this.interpolatePrompt(prompt.template, currentVars);
    }
  }

  copyPromptToClipboard(promptId) {
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const prompt = allPrompts.find(p => p.id === promptId);
    if (prompt) {
      navigator.clipboard.writeText(prompt.template);
      this.showToast('Prompt copied to clipboard!', 'success');
    }
  }

  copySimulatedPreview() {
    const previewEl = document.getElementById('interpolatedPreviewText');
    if (previewEl) {
      navigator.clipboard.writeText(previewEl.innerText);
      this.showToast('Live preview text copied to clipboard!', 'success');
    }
  }

  openInPlayground(promptId) {
    const allPrompts = [...PK_DATA.prompts, ...pkStore.state.customPrompts];
    const prompt = allPrompts.find(p => p.id === promptId);
    this.navigate('playground');
    setTimeout(() => {
      const input = document.getElementById('playgroundPromptInput');
      if (input && prompt) {
        input.value = prompt.template;
        this.updateQualityMeter(prompt.template);
      }
    }, 100);
  }

  switchDetailImage(thumbEl, src) {
    const main = document.getElementById('mainDetailImage');
    if (main) main.src = src;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
  }

  // --- Cart Drawer & Checkout ---
  openCartDrawer() {
    this.renderCartDrawerContent();
    document.getElementById('cartDrawerBackdrop')?.classList.add('open');
    document.getElementById('cartDrawer')?.classList.add('open');
  }

  renderCartDrawerContent() {
    const itemsContainer = document.getElementById('cartDrawerItems');
    const footerContainer = document.getElementById('cartDrawerFooter');
    const cart = pkStore.state.cart;
    const { subtotal, discount, total } = pkStore.getCartTotal();

    if (!itemsContainer || !footerContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="ph-bold ph-shopping-bag" style="font-size: 3rem; margin-bottom: 12px;"></i>
          <p>Your cart is empty.</p>
        </div>
      `;
      footerContainer.innerHTML = '';
      return;
    }

    itemsContainer.innerHTML = cart.map(item => `
      <div style="display: flex; gap: 12px; padding: 12px; background: var(--bg-primary); border-radius: var(--radius-md); margin-bottom: 10px; border: 1px solid var(--border-subtle);">
        <img src="${item.coverImage || (item.images && item.images[0])}" style="width: 54px; height: 54px; border-radius: var(--radius-sm); object-fit: cover;" alt="Cover">
        <div style="flex: 1;">
          <h4 style="font-size: 0.88rem; font-weight: 700; line-height: 1.3; margin-bottom: 4px;">${item.title}</h4>
          <span style="font-family: var(--font-display); font-weight: 800; color: var(--accent-emerald);">$${parseFloat(item.price).toFixed(2)}</span>
        </div>
        <button class="icon-btn btn-sm" onclick="app.handleRemoveFromCart('${item.id}')" title="Remove">
          <i class="ph-bold ph-trash"></i>
        </button>
      </div>
    `).join('');

    footerContainer.innerHTML = `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <input type="text" id="cartCouponInput" class="var-input-field" placeholder="Coupon Code (e.g. VIP20)" value="${pkStore.state.appliedCoupon ? pkStore.state.appliedCoupon.code : ''}">
          <button class="btn btn-secondary btn-sm" onclick="app.handleApplyCoupon()">Apply</button>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;">
          <span style="color: var(--text-secondary);">Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        ${discount > 0 ? `
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--accent-emerald); margin-bottom: 4px;">
            <span>Discount:</span>
            <span>-$${discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
          <span>Total:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="app.openCheckoutModal()">
        Proceed to Checkout <i class="ph-bold ph-lock-key"></i>
      </button>
    `;
  }

  handleRemoveFromCart(id) {
    pkStore.removeFromCart(id);
    this.renderCartDrawerContent();
  }

  handleApplyCoupon() {
    const input = document.getElementById('cartCouponInput');
    if (!input) return;
    const res = pkStore.applyCoupon(input.value);
    this.showToast(res.message, res.success ? 'success' : 'error');
    this.renderCartDrawerContent();
  }

  openCheckoutModal() {
    const total = pkStore.getCartTotal().total;
    const modalBody = document.getElementById('checkoutModalBody');
    if (!modalBody) return;
    const formattedTotal = `$${total.toFixed(2)}`;

    modalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: var(--bg-card); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glow); text-align: center;">
          <div style="font-size: 0.85rem; color: var(--text-muted);">Total Amount Due</div>
          <div style="font-family: var(--font-display); font-size: 2.4rem; font-weight: 900; color: var(--accent-emerald);">${formattedTotal}</div>
          <span style="font-size: 0.78rem; color: var(--accent-cyan); font-weight: 700;">Zero Transaction Fees · Instant Vault Delivery</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <label style="font-weight: 700; font-size: 0.9rem;">Choose Global or Local Payment Gateway:</label>
          
          <!-- M-Pesa Tanzania / Kenya -->
          <button class="btn btn-secondary" style="justify-content: flex-start; padding: 14px 20px; border-color: rgba(16,185,129,0.4);" onclick="app.handleMpesaCheckout()">
            <span style="font-size: 1.4rem; margin-right: 8px;">🇹🇿 🇰🇪</span>
            <div style="text-align: left;">
              <strong style="display: block; color: var(--accent-emerald);">M-Pesa / Tigo Pesa / Airtel Money</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Instant Mobile STK Push PIN prompt</span>
            </div>
          </button>

          <!-- Crypto USDT / Web3 -->
          <button class="btn btn-secondary" style="justify-content: flex-start; padding: 14px 20px;" onclick="app.processCheckout('Crypto Web3 USDT')">
            <i class="ph-bold ph-currency-eth" style="color: var(--accent-cyan); font-size: 1.4rem; margin-right: 8px;"></i>
            <div style="text-align: left;">
              <strong style="display: block;">Web3 Crypto Wallet (USDT / Solana / ETH)</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Pay directly from Phantom, MetaMask, or Binance</span>
            </div>
          </button>

          <!-- Credit Card Stripe -->
          <button class="btn btn-secondary" style="justify-content: flex-start; padding: 14px 20px;" onclick="app.processCheckout('Stripe Card')">
            <i class="ph-bold ph-credit-card" style="color: var(--accent-primary); font-size: 1.4rem; margin-right: 8px;"></i>
            <div style="text-align: left;">
              <strong style="display: block;">Credit / Debit Card (Stripe Instant)</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Visa, MasterCard, American Express</span>
            </div>
          </button>

          <!-- Apple Pay / Google Pay -->
          <button class="btn btn-secondary" style="justify-content: flex-start; padding: 14px 20px;" onclick="app.processCheckout('Apple Pay / Google Pay')">
            <i class="ph-bold ph-apple-logo" style="color: #cbd5e1; font-size: 1.4rem; margin-right: 8px;"></i>
            <div style="text-align: left;">
              <strong style="display: block;">Apple Pay / Google Pay 1-Click</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Biometric 1-click checkout</span>
            </div>
          </button>
        </div>
      </div>
    `;
    this.openModal('checkoutModal');
  }

  handleMpesaCheckout() {
    const phone = prompt('Enter your M-Pesa / Mobile Money Phone Number (e.g. +255 754 123 456 or +254 712 345 678):', '+255 754 000 111');
    if (!phone) return;
    this.showToast(`Sending STK Push PIN prompt to ${phone}... Please enter your M-Pesa PIN on your phone.`, 'info');
    setTimeout(() => {
      this.processCheckout(`M-Pesa Mobile Money (${phone})`);
    }, 1200);
  }

  processCheckout(gatewayName) {
    const cart = pkStore.state.cart;
    cart.forEach(item => {
      pkStore.unlockPrompt(item.id, gatewayName);
    });
    pkStore.clearCart();
    this.closeModal('checkoutModal');
    this.showToast(`Payment verified via ${gatewayName}! Master prompts unlocked in your Digital Vault.`, 'success');
    this.navigate('library');
  }

  // --- Form & Modal Handlers ---
  handleWizardSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('wizTitle').value;
    const modelId = document.getElementById('wizModel').value;
    const category = document.getElementById('wizCategory').value;
    const price = parseFloat(document.getElementById('wizPrice').value) || 0;
    const template = document.getElementById('wizTemplate').value;
    const coverImage = document.getElementById('wizCover').value;
    const instructions = document.getElementById('wizInstructions').value;

    pkStore.createSellerPrompt({
      title,
      modelId,
      category,
      price,
      template,
      coverImage,
      instructions,
      description: `Newly submitted verified prompt for ${modelId.toUpperCase()}.`
    });

    this.closeModal('promptWizardModal');
    this.showToast('Master prompt submitted for Admin Review & Published!', 'success');
    this.renderSellerDashboard(document.getElementById('appContent'));
  }

  handleKycSubmit(e) {
    e.preventDefault();
    if (pkStore.state.user) {
      pkStore.state.user.kycStatus = 'verified';
      pkStore.saveState();
    }
    this.closeModal('kycModal');
    this.showToast('KYC Verification credentials updated & verified.', 'success');
  }

  handlePayoutSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('payoutAmountInput').value);
    const method = document.getElementById('payoutMethodSelect').value;
    const details = document.getElementById('payoutDetailsInput').value;

    if (amount <= 0 || amount > pkStore.state.sellerAnalytics.pendingPayout) {
      this.showToast('Invalid withdrawal amount.', 'error');
      return;
    }

    pkStore.state.sellerAnalytics.pendingPayout -= amount;
    pkStore.state.sellerAnalytics.payoutMethod = `${method} (${details})`;
    pkStore.saveState();

    this.closeModal('payoutModal');
    this.showToast(`Payout request of $${amount.toFixed(2)} via ${method} submitted.`, 'success');
    this.renderSellerDashboard(document.getElementById('appContent'));
  }

  handleCreateCouponSubmit(e) {
    e.preventDefault();
    const code = document.getElementById('newCouponCode').value;
    const discount = document.getElementById('newCouponDiscount').value;
    const maxUses = document.getElementById('newCouponMaxUses').value;

    pkStore.addSellerCoupon(code, discount, maxUses);
    this.closeModal('couponModal');
    this.showToast(`Promotional coupon ${code} created successfully!`, 'success');
    this.renderSellerDashboard(document.getElementById('appContent'));
  }

  handleToggleCoupon(id) {
    pkStore.toggleSellerCoupon(id);
    this.showToast('Coupon status updated.', 'success');
    this.renderSellerDashboard(document.getElementById('appContent'));
  }

  openTipModal(creatorId) {
    window.currentTipCreatorId = creatorId;
    this.openModal('tipModal');
  }

  handleSendTip() {
    const amount = document.getElementById('tipAmountInput').value;
    pkStore.sendTip(window.currentTipCreatorId, amount);
    this.closeModal('tipModal');
    this.showToast(`Thank you! Tip of $${amount} sent to creator.`, 'success');
  }

  openAddReviewModal(promptId) {
    document.getElementById('reviewPromptId').value = promptId;
    this.openModal('reviewModal');
  }

  handleReviewSubmit(e) {
    e.preventDefault();
    const promptId = document.getElementById('reviewPromptId').value;
    const rating = document.getElementById('reviewRatingSelect').value;
    const comment = document.getElementById('reviewCommentInput').value;

    pkStore.addReview(promptId, rating, comment);
    this.closeModal('reviewModal');
    this.showToast('Your community review has been published!', 'success');
    this.renderPromptDetail(document.getElementById('appContent'), promptId);
  }

  handleUpvoteReview(promptId, reviewId) {
    pkStore.upvoteReview(promptId, reviewId);
    this.showToast('Upvoted review as helpful!', 'success');
    this.renderPromptDetail(document.getElementById('appContent'), promptId);
  }

  handleRefundSubmit(e) {
    e.preventDefault();
    const reason = document.getElementById('refundReasonSelect').value;
    pkStore.requestRefund('ord_98214', 'ChatGPT-4o Million-Dollar SaaS Landing Page', 0.00, reason);
    this.closeModal('refundModal');
    this.showToast('Refund request submitted to Admin mediation.', 'success');
    this.navigate('library');
  }

  handlePostBountySubmit(e) {
    e.preventDefault();
    const title = document.getElementById('bountyTitleInput').value;
    const budget = parseFloat(document.getElementById('bountyBudgetInput').value);
    const modelTarget = document.getElementById('bountyModelInput').value;
    const description = document.getElementById('bountyDescInput').value;

    pkStore.state.bounties.unshift({
      id: 'b_' + Date.now(),
      number: Math.floor(Math.random() * 9000) + 1000,
      title,
      status: 'open',
      budget,
      submissionsCount: 0,
      buyerName: pkStore.state.user ? pkStore.state.user.name : 'Jordan Sterling',
      buyerAvatar: pkStore.state.user ? pkStore.state.user.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      description,
      deadline: 'In 5 days',
      modelTarget
    });
    pkStore.saveState();
    this.closeModal('postBountyModal');
    this.showToast('Bounty published on board!', 'success');
    this.renderBounties(document.getElementById('appContent'));
  }

  openSubmitSolutionModal(bountyId) {
    document.getElementById('targetBountyId').value = bountyId;
    this.openModal('submitBountySolutionModal');
  }

  handleSubmitBountySolution(e) {
    e.preventDefault();
    const bountyId = document.getElementById('targetBountyId').value;
    const template = document.getElementById('bountySolutionTemplate').value;
    const image = document.getElementById('bountySolutionImage').value;

    pkStore.submitBountyProposal(bountyId, template, image);
    this.closeModal('submitBountySolutionModal');
    this.showToast('Solution proposal submitted to bounty owner!', 'success');
    this.renderBounties(document.getElementById('appContent'));
  }

  handleAiStudioBatchSubmit(e) {
    e.preventDefault();
    const niche = document.getElementById('aiStudioNiche').value;
    const count = parseInt(document.getElementById('aiStudioCount').value);
    const model = document.getElementById('aiStudioModel').value;

    for (let i = 1; i <= count; i++) {
      pkStore.createSellerPrompt({
        title: `${niche} - Master Variation #${i}`,
        category: 'cyberpunk-3d',
        modelId: model,
        price: 3.99,
        coverImage: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80',
        description: `Batch generated via Admin AI Studio autonomous pipeline for ${niche}.`,
        template: `Ultra-detailed 8K ${niche} [subject] [lighting] shot on 85mm f/1.2 lens --v 6.1 --ar 16:9`
      });
    }

    this.closeModal('aiStudioBatchModal');
    this.showToast(`Admin AI Studio published ${count} new master prompts!`, 'success');
    this.renderAdminDashboard(document.getElementById('appContent'));
  }

  // --- Live Chat Drawer ---
  openChatDrawer() {
    this.renderChatMessages();
    document.getElementById('chatDrawerBackdrop')?.classList.add('open');
    document.getElementById('chatDrawer')?.classList.add('open');
  }

  openChatWithCreator(creatorId) {
    this.openChatDrawer();
  }

  renderChatMessages() {
    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;
    const conv = pkStore.state.chatConversations[0];
    if (!conv) return;

    container.innerHTML = conv.messages.map(m => `
      <div style="align-self: ${m.sender === 'buyer' ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${m.sender === 'buyer' ? 'var(--grad-primary)' : 'var(--bg-tertiary)'}; color: #fff; padding: 10px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4;">
        <div>${m.text}</div>
        <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 4px; text-align: right;">${m.time}</div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }

  handleSendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chatInputBox');
    if (!input || !input.value.trim()) return;
    pkStore.sendMessage('conv_1', input.value.trim());
    input.value = '';
    this.renderChatMessages();
  }

  openNotificationsDrawer() {
    const notifsContainer = document.getElementById('notifDrawerItems');
    if (notifsContainer) {
      notifsContainer.innerHTML = pkStore.state.notifications.map(n => `
        <div style="padding: 14px; background: var(--bg-primary); border-radius: var(--radius-md); margin-bottom: 10px; border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="font-size: 0.9rem;">${n.icon} ${n.title}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${n.time}</span>
          </div>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">${n.desc}</p>
        </div>
      `).join('');
    }
    document.getElementById('notifDrawerBackdrop')?.classList.add('open');
    document.getElementById('notifDrawer')?.classList.add('open');
  }

  closeDrawers() {
    document.querySelectorAll('.drawer-backdrop, .drawer-pane').forEach(el => el.classList.remove('open'));
  }

  openModal(modalId) {
    document.getElementById(modalId)?.classList.add('open');
  }

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('open');
  }

  updateQualityMeter(val) {
    const score = pkStore.calculatePromptQuality(val);
    const scoreVal = document.getElementById('meterScoreValue');
    const bar = document.getElementById('meterProgressBar');
    if (scoreVal) scoreVal.innerText = `${score}/100`;
    if (bar) bar.style.width = `${score}%`;
  }

  magicOptimizePlaygroundPrompt() {
    const input = document.getElementById('playgroundPromptInput');
    const modelSelect = document.getElementById('playgroundModelSelect');
    if (!input) return;
    const optimized = pkStore.magicExpandPrompt(input.value || 'hyper-realistic portrait of futuristic astronaut', modelSelect ? modelSelect.value : 'midjourney');
    input.value = optimized;
    this.updateQualityMeter(optimized);
    this.showToast('Prompt expanded with optimal master parameters!', 'success');
  }

  runPlaygroundGeneration() {
    if (!pkStore.state.user || pkStore.state.user.credits < 2) {
      this.showToast('Insufficient credits! Upgrade or get Select VIP for 500 free credits.', 'error');
      return;
    }

    pkStore.deductCredits(2);
    const btn = document.getElementById('btnRunPlayground');
    if (btn) btn.innerHTML = '<i class="ph-bold ph-spinner"></i> Generating...';

    setTimeout(() => {
      if (btn) btn.innerHTML = '<i class="ph-bold ph-play"></i> Run Live Generation (2⚡)';
      const outputImg = document.getElementById('playgroundResultImg');
      const sampleImages = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
      ];
      const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      if (outputImg) outputImg.src = randomImg;

      pkStore.state.playgroundHistory.unshift({
        id: 'run_' + Date.now(),
        model: 'FLUX.1 Pro',
        prompt: 'Generated in session',
        outputImage: randomImg,
        time: 'Just now',
        cost: 2
      });
      pkStore.saveState();
      this.showToast('Generation complete! 2 credits deducted.', 'success');
    }, 1000);
  }

  clearPlayground() {
    const input = document.getElementById('playgroundPromptInput');
    if (input) input.value = '';
    this.updateQualityMeter('');
  }

  // =========================================================================
  // 1. AI AGENT MULTI-STEP WORKFLOWS & DAG PIPELINES (#workflows)
  // =========================================================================
  renderWorkflows(container) {
    const workflows = PK_DATA.workflows || [];
    const credits = pkStore.state.user ? pkStore.state.user.credits : 0;

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 70px;">
        <div class="section-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="nav-pill-badge" style="background: rgba(99,102,241,0.2); color: var(--accent-primary); font-weight: 800;">AUTONOMOUS AGENT CHAINS</span>
              <span style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700;">● 38,400+ Enterprise Pipeline Runs</span>
            </div>
            <h1 class="section-title"><i class="ph-fill ph-git-commit" style="color: var(--accent-primary);"></i> Multi-Step AI Agent Workflows & DAG Pipelines</h1>
            <p class="section-subtitle">Chained multi-model pipelines connecting DeepSeek research, Claude copywriting, Midjourney visuals, and ChatGPT code execution.</p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn btn-secondary btn-sm" onclick="app.showToast('Visual DAG Pipeline Flow Builder loaded in memory.', 'info')">
              <i class="ph-bold ph-plus-circle"></i> + Build Custom DAG
            </button>
            <span class="nav-pill-badge" style="background: rgba(16,185,129,0.15); color: var(--accent-emerald); padding: 5px 12px;">
              ⚡ Available: ${credits} Credits
            </span>
          </div>
        </div>

        <!-- Live Interactive Workflow Execution Simulator -->
        <div id="workflowLiveRunner" class="admin-tool-card" style="margin-bottom: 36px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                <i class="ph-fill ph-play-circle" style="color: var(--accent-cyan);"></i> Live Agent Pipeline Execution Engine
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Select a pipeline below or trigger a test simulation to watch multi-model data flow in real time.</p>
            </div>
            <button class="btn btn-primary btn-sm" id="btnTriggerChainRun" onclick="app.handleRunWorkflow('wf_1')">
              <i class="ph-bold ph-lightning"></i> Test Run Autonomous Chain (4⚡)
            </button>
          </div>

          <div id="wfProgressContainer" style="display: none; padding: 18px; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span id="wfProgressStepText" style="font-weight: 800; color: var(--accent-cyan); font-size: 0.9rem;">Step 1/4: DeepSeek Intelligence & Market Extraction...</span>
              <span id="wfProgressPercent" style="font-family: var(--font-mono); font-weight: 800;">25%</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div id="wfProgressBar" style="width: 25%; height: 100%; background: var(--grad-primary); transition: width 0.4s ease;"></div>
            </div>

            <!-- 4-Step Pipeline Node Visualizer -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;" id="wfStepNodes">
              <div class="wf-node active" id="nodeStep1" style="background: var(--bg-card); border: 1px solid var(--accent-cyan); border-radius: var(--radius-sm); padding: 10px; font-size: 0.8rem;">
                <strong style="display: block; color: var(--accent-cyan);">1. DeepSeek</strong>
                <span>Market Extraction</span>
              </div>
              <div class="wf-node" id="nodeStep2" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; font-size: 0.8rem;">
                <strong style="display: block; color: var(--text-muted);">2. Claude</strong>
                <span>PAS Copy & Hooks</span>
              </div>
              <div class="wf-node" id="nodeStep3" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; font-size: 0.8rem;">
                <strong style="display: block; color: var(--text-muted);">3. Midjourney</strong>
                <span>3D 8K Hero Visuals</span>
              </div>
              <div class="wf-node" id="nodeStep4" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; font-size: 0.8rem;">
                <strong style="display: block; color: var(--text-muted);">4. ChatGPT</strong>
                <span>Next.js Code Assembly</span>
              </div>
            </div>
          </div>

          <div id="wfOutputCard" style="display: none; background: var(--bg-card); border: 1px solid var(--accent-emerald); border-radius: var(--radius-md); padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="color: var(--accent-emerald); font-weight: 800; font-size: 0.9rem;"><i class="ph-bold ph-check-circle"></i> Pipeline Synthesized Successfully!</span>
              <button class="btn btn-secondary btn-sm" onclick="app.showToast('Downloaded full artifact ZIP bundle (PDF + Code + 8K Renders).', 'success')"><i class="ph-bold ph-download-simple"></i> Download Bundle (.ZIP)</button>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0;">
              <strong>Generated Deliverable:</strong> Full SaaS Landing Page Architecture with 4 PAS copy variants, 3 raytraced 3D visual mockups, and sanitized React Tailwind code ready for deployment.
            </p>
          </div>
        </div>

        <!-- Workflow Packages Catalog -->
        <h2 style="font-size: 1.3rem; font-weight: 900; margin-bottom: 20px;">Featured Certified Agent Pipelines</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
          ${workflows.map(wf => `
            <div class="settings-card" style="display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border-subtle); transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseenter="this.style.borderColor='var(--border-glow)'" onmouseleave="this.style.borderColor='var(--border-subtle)'">
              <div style="height: 160px; position: relative; overflow: hidden;">
                <img src="${wf.coverImage}" style="width: 100%; height: 100%; object-fit: cover;" alt="${wf.title}">
                <span class="nav-pill-badge" style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); color: var(--accent-cyan); font-weight: 800;">
                  ${wf.badge}
                </span>
                <span style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); color: var(--accent-emerald); font-weight: 800; padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.9rem;">
                  ${pkStore.formatPrice(wf.price)}
                </span>
              </div>

              <div style="padding: 20px; display: flex; flex-direction: column; flex: 1;">
                <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 8px; line-height: 1.4;">${wf.title}</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">${wf.description}</p>

                <!-- Steps Pills -->
                <div style="margin-bottom: 20px; background: var(--bg-primary); padding: 12px; border-radius: var(--radius-sm);">
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 8px;">Pipeline Step Sequence:</span>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${wf.steps.map(s => `
                      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
                        <span style="width: 18px; height: 18px; border-radius: 50%; background: var(--accent-primary); color: #fff; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; font-weight: 800;">${s.stepNum}</span>
                        <strong style="color: var(--accent-cyan);">${s.engine}:</strong>
                        <span style="color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.name}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-muted);">
                    <i class="ph-fill ph-star" style="color: #f59e0b;"></i> ${wf.rating} (${wf.salesCount} runs)
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="app.handleRunWorkflow('${wf.id}')">
                      <i class="ph-bold ph-play"></i> Run Chain
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="app.handleQuickBuyWorkflow('${wf.id}', '${wf.title}', ${wf.price})">
                      Acquire DAG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  handleRunWorkflow(wfId) {
    const progressContainer = document.getElementById('wfProgressContainer');
    const progressBar = document.getElementById('wfProgressBar');
    const stepText = document.getElementById('wfProgressStepText');
    const percentText = document.getElementById('wfProgressPercent');
    const outputCard = document.getElementById('wfOutputCard');

    if (!progressContainer) return;
    progressContainer.style.display = 'block';
    if (outputCard) outputCard.style.display = 'none';

    let currentStep = 1;
    const steps = [
      { text: 'Step 1/4: DeepSeek Intelligence & Market Scraping...', percent: 25, node: 'nodeStep1' },
      { text: 'Step 2/4: Claude PAS Copywriting & Strategic Hooks...', percent: 50, node: 'nodeStep2' },
      { text: 'Step 3/4: Midjourney Volumetric 3D Hero Rendering...', percent: 75, node: 'nodeStep3' },
      { text: 'Step 4/4: ChatGPT Next.js Production Code Assembly...', percent: 100, node: 'nodeStep4' }
    ];

    const runInterval = setInterval(() => {
      if (currentStep <= 4) {
        const s = steps[currentStep - 1];
        if (stepText) stepText.innerText = s.text;
        if (progressBar) progressBar.style.width = s.percent + '%';
        if (percentText) percentText.innerText = s.percent + '%';

        document.querySelectorAll('.wf-node').forEach(n => {
          n.style.borderColor = 'var(--border-subtle)';
        });
        const activeNode = document.getElementById(s.node);
        if (activeNode) activeNode.style.borderColor = 'var(--accent-cyan)';

        currentStep++;
      } else {
        clearInterval(runInterval);
        if (outputCard) outputCard.style.display = 'block';
        this.showToast('Workflow Pipeline execution complete! Deliverable generated.', 'success');
      }
    }, 700);
  }

  handleQuickBuyWorkflow(wfId, title, price) {
    pkStore.state.cart.push({
      id: wfId,
      title: title,
      price: price,
      modelId: 'agent-skills',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    });
    pkStore.saveState();
    this.updateCounters();
    this.showToast(`Added "${title}" to cart!`, 'success');
    this.openCartDrawer();
  }

  // =========================================================================
  // 2. PROMPT ARENA & BLIND ELO BATTLES (#arena)
  // =========================================================================
  renderArena(container) {
    const matches = PK_DATA.arenaMatches || [];
    const leaderboard = PK_DATA.arenaLeaderboard || [];
    const currentMatch = matches[0];
    const userVote = pkStore.state.arenaVotes ? pkStore.state.arenaVotes[currentMatch.id] : null;

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 70px;">
        <div class="section-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="nav-pill-badge" style="background: rgba(244,63,94,0.2); color: #f43f5e; font-weight: 800;">COMMUNITY BLIND ARENA</span>
              <span style="font-size: 0.8rem; color: var(--accent-amber); font-weight: 700;">● ELO Rating Tournament</span>
            </div>
            <h1 class="section-title"><i class="ph-fill ph-sword" style="color: #f43f5e;"></i> Prompt Arena: Blind Side-by-Side Battles</h1>
            <p class="section-subtitle">Vote on blind prompt outputs to determine the world's highest-ranking prompt architectures and engineering masterminds.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="app.showToast('Submission opened: Submit your prompt to next week\'s Arena match!', 'info')">
            <i class="ph-bold ph-plus"></i> Submit Arena Matchup
          </button>
        </div>

        <!-- Blind Battle Stage -->
        <div class="admin-tool-card" style="margin-bottom: 40px; border: 1px solid var(--border-glow); background: var(--bg-card);">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase;">Current Live Matchup #${currentMatch.id}</span>
            <h2 style="font-size: 1.4rem; font-weight: 900; margin-top: 4px; margin-bottom: 8px;">${currentMatch.title}</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 720px; margin: 0 auto; background: var(--bg-primary); padding: 10px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-family: var(--font-mono);">
              <strong>Common Seed:</strong> "${currentMatch.seed}"
            </p>
          </div>

          <!-- Side-by-Side Outputs -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <!-- Output A -->
            <div style="background: var(--bg-primary); border-radius: var(--radius-md); overflow: hidden; border: 2px solid ${userVote === 'A' ? 'var(--accent-emerald)' : 'var(--border-subtle)'};">
              <div style="height: 320px; position: relative;">
                <img src="${currentMatch.promptA.preview}" style="width: 100%; height: 100%; object-fit: cover;" alt="Candidate A">
                <span class="nav-pill-badge" style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); color: #fff; font-size: 0.9rem; font-weight: 900;">
                  CANDIDATE A
                </span>
                ${userVote ? `
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); padding: 12px; text-align: center;">
                    <strong style="color: var(--accent-cyan); display: block; font-size: 0.95rem;">Engine: ${currentMatch.promptA.model}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Engineered by @${currentMatch.promptA.creator}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Output B -->
            <div style="background: var(--bg-primary); border-radius: var(--radius-md); overflow: hidden; border: 2px solid ${userVote === 'B' ? 'var(--accent-emerald)' : 'var(--border-subtle)'};">
              <div style="height: 320px; position: relative;">
                <img src="${currentMatch.promptB.preview}" style="width: 100%; height: 100%; object-fit: cover;" alt="Candidate B">
                <span class="nav-pill-badge" style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); color: #fff; font-size: 0.9rem; font-weight: 900;">
                  CANDIDATE B
                </span>
                ${userVote ? `
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); padding: 12px; text-align: center;">
                    <strong style="color: var(--accent-primary); display: block; font-size: 0.95rem;">Engine: ${currentMatch.promptB.model}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Engineered by @${currentMatch.promptB.creator}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Voting Action Buttons -->
          ${!userVote ? `
            <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
              <button class="btn btn-primary btn-lg" onclick="app.handleArenaVote('${currentMatch.id}', 'A')">
                <i class="ph-bold ph-trophy"></i> Vote Candidate A is Better
              </button>
              <button class="btn btn-primary btn-lg" onclick="app.handleArenaVote('${currentMatch.id}', 'B')">
                <i class="ph-bold ph-trophy"></i> Vote Candidate B is Better
              </button>
              <button class="btn btn-secondary btn-lg" onclick="app.handleArenaVote('${currentMatch.id}', 'Tie')">
                🤝 Both are Incredible / Tie
              </button>
            </div>
          ` : `
            <div style="text-align: center; padding: 16px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-md);">
              <h4 style="color: var(--accent-emerald); font-weight: 800; font-size: 1.1rem; margin-bottom: 4px;">
                <i class="ph-bold ph-check-circle"></i> Vote Recorded! Blind Identities Unmasked Above
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0;">
                Calculated ELO adjustments applied to Global Prompt Leaderboard (+18 ELO).
              </p>
            </div>
          `}
        </div>

        <!-- Global ELO Leaderboard Table -->
        <h2 style="font-size: 1.3rem; font-weight: 900; margin-bottom: 20px;"><i class="ph-fill ph-crown" style="color: #f59e0b;"></i> Global Prompt Engineering ELO Leaderboard</h2>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Prompt Engineer Master</th>
                <th>ELO Rating</th>
                <th>Win Rate</th>
                <th>Arena Matches</th>
                <th>Mastery Tier</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboard.map(u => `
                <tr>
                  <td style="font-weight: 900; font-size: 1.1rem; color: ${u.rank === 1 ? '#f59e0b' : u.rank === 2 ? '#cbd5e1' : u.rank === 3 ? '#d97706' : 'var(--text-muted)'};">
                    #${u.rank}
                  </td>
                  <td style="font-weight: 700;">
                    <div>${u.name}</div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">@${u.username}</span>
                  </td>
                  <td style="font-family: var(--font-mono); font-weight: 900; color: var(--accent-cyan); font-size: 1.05rem;">
                    ${u.elo}
                  </td>
                  <td style="font-weight: 800; color: var(--accent-emerald);">${u.winRate}</td>
                  <td>${u.totalBattles}</td>
                  <td><span class="nav-pill-badge">${u.badge}</span></td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.navigate('profile')">View Prompts</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  handleArenaVote(matchId, choice) {
    pkStore.voteArenaMatch(matchId, choice);
    this.showToast(`Vote for candidate ${choice} submitted! Model architectures unmasked.`, 'success');
    this.renderArena(document.getElementById('appContent'));
  }

  // =========================================================================
  // 3. AI TOKEN COST OPTIMIZER & PROMPT COMPRESSOR (#optimizer)
  // =========================================================================
  renderOptimizer(container) {
    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 70px;">
        <div class="section-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="nav-pill-badge" style="background: rgba(16,185,129,0.2); color: var(--accent-emerald); font-weight: 800;">MAGIC COST REDUCER</span>
              <span style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700;">● 40% - 60% Token Compression</span>
            </div>
            <h1 class="section-title"><i class="ph-fill ph-lightning" style="color: var(--accent-emerald);"></i> AI Token Cost Optimizer & Prompt Compressor</h1>
            <p class="section-subtitle">Compress verbose ChatGPT and Claude system instructions into ultra-dense few-shot token structures to cut API inference costs in half.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px;">
          <!-- Left: Verbose Input -->
          <div class="settings-card">
            <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 12px; display: flex; justify-content: space-between;">
              <span>Verbose Prompt Input</span>
              <span id="optOrigTokens" style="color: #f59e0b; font-family: var(--font-mono); font-size: 0.85rem;">248 Tokens</span>
            </h3>
            <textarea id="optInputPrompt" class="form-textarea" style="min-height: 220px; font-family: var(--font-mono); font-size: 0.85rem;" placeholder="Paste your lengthy system prompt here..." oninput="app.updateOptimizerStats(this.value)">You are an expert full stack senior software architect. When I ask you to write code, please make sure you write clean code without any errors. You should make sure that you include all imports, handle all edge cases, and provide comprehensive comments explaining what each section does. Do not use any deprecated functions or libraries. Ensure all TypeScript types are explicitly specified and never use any. Return only clean code inside markdown blocks without conversational fluff or pleasantries.</textarea>
            
            <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Est. Cost per 10k calls: <strong>$7.44</strong></span>
              <button class="btn btn-primary" onclick="app.handleOptimizePrompt()">
                <i class="ph-fill ph-sparkle"></i> Compress & Optimize (Magic -52%)
              </button>
            </div>
          </div>

          <!-- Right: Compressed Dense Output -->
          <div class="settings-card" style="border-color: var(--border-glow);">
            <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 12px; display: flex; justify-content: space-between;">
              <span style="color: var(--accent-emerald);"><i class="ph-bold ph-check-circle"></i> Optimized Dense Tokens</span>
              <span id="optNewTokens" style="color: var(--accent-emerald); font-family: var(--font-mono); font-size: 0.85rem;">118 Tokens (-52.4%)</span>
            </h3>
            <textarea id="optOutputPrompt" class="form-textarea" style="min-height: 220px; font-family: var(--font-mono); font-size: 0.85rem; background: var(--bg-primary);" readonly>[Role: Senior Full-Stack Architect]
[Constraints: Strict TypeScript, zero 'any', complete imports, exhaustive edge-case handling, no deprecations]
[Format: Markdown code only, no conversational preamble]
[OutputStyle: Production-ready, inline docstrings]</textarea>

            <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.8rem; color: var(--accent-emerald);"><strong>Saves $3.90 per 10k API calls</strong></span>
              <button class="btn btn-secondary btn-sm" onclick="app.copyCompressedPrompt()">
                <i class="ph-bold ph-copy"></i> Copy Compressed Prompt
              </button>
            </div>
          </div>
        </div>

        <!-- Savings Calculator Box -->
        <div class="admin-metric-grid">
          <div class="admin-metric-card">
            <span class="admin-metric-label">Tokens Reduced</span>
            <div class="admin-metric-val" style="color: var(--accent-emerald);">-52.4%</div>
            <span class="stat-delta positive">Zero loss in semantic quality</span>
          </div>
          <div class="admin-metric-card">
            <span class="admin-metric-label">Monthly Cloud API Savings</span>
            <div class="admin-metric-val text-gradient">$390.00 / mo</div>
            <span class="stat-delta positive">Based on 1M token monthly workload</span>
          </div>
          <div class="admin-metric-card">
            <span class="admin-metric-label">Inference Latency Drop</span>
            <div class="admin-metric-val" style="color: var(--accent-cyan);">-320ms</div>
            <span class="stat-delta positive">Faster time-to-first-token (TTFT)</span>
          </div>
        </div>
      </div>
    `;
  }

  updateOptimizerStats(val) {
    const tokens = Math.max(1, Math.round(val.length / 3.8));
    const tokenDisplay = document.getElementById('optOrigTokens');
    if (tokenDisplay) tokenDisplay.innerText = `${tokens} Tokens`;
  }

  handleOptimizePrompt() {
    const input = document.getElementById('optInputPrompt').value;
    const outputArea = document.getElementById('optOutputPrompt');
    const newTokensDisplay = document.getElementById('optNewTokens');

    const compressed = `[Role: Senior Principal Architect]
[Directives: Production-ready code only, strict explicit TypeScript types, zero conversational filler]
[Rules: Handle all boundary conditions, zero deprecations, exhaustively commented modules]
[Execution: Return markdown code fence output immediately]`;

    if (outputArea) outputArea.value = compressed;
    if (newTokensDisplay) newTokensDisplay.innerText = `68 Tokens (-62.1%)`;
    this.showToast('Prompt compressed! Token consumption reduced by 62.1%.', 'success');
  }

  copyCompressedPrompt() {
    const outputArea = document.getElementById('optOutputPrompt');
    if (outputArea) {
      navigator.clipboard.writeText(outputArea.value);
      this.showToast('Compressed prompt copied to clipboard!', 'success');
    }
  }

  // =========================================================================
  // 4. ENTERPRISE DEVELOPER API & WEBHOOKS HUB (#developer)
  // =========================================================================
  renderDeveloper(container) {
    const apiKeys = pkStore.state.apiKeys || [];

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 70px;">
        <div class="section-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="nav-pill-badge" style="background: rgba(0,240,255,0.2); color: var(--accent-cyan); font-weight: 800;">REST API & SDK</span>
              <span style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700;">● v1 API Gateway Ready</span>
            </div>
            <h1 class="section-title"><i class="ph-fill ph-code" style="color: var(--accent-cyan);"></i> Enterprise Developer API & Webhooks Hub</h1>
            <p class="section-subtitle">Integrate marketplace prompt executions directly into your applications, SaaS backends, and AI agent workflows.</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="app.handleCreateApiKeyModal()">
            <i class="ph-bold ph-key"></i> + Generate New API Key
          </button>
        </div>

        <!-- API Keys Table -->
        <div class="admin-tool-card" style="margin-bottom: 36px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">Active Developer Secret API Keys</h3>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Key Name</th>
                  <th>API Token Secret</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th>API Calls</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${apiKeys.map(k => `
                  <tr>
                    <td style="font-weight: 700;">${k.name}</td>
                    <td><code>${k.key.substring(0, 12)}••••••••••••</code></td>
                    <td style="color: var(--text-muted);">${k.created}</td>
                    <td style="color: var(--text-muted);">${k.lastUsed}</td>
                    <td style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-cyan);">${k.calls}</td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn btn-sm btn-secondary" onclick="navigator.clipboard.writeText('${k.key}'); app.showToast('Copied API key to clipboard!', 'success');">Copy</button>
                        <button class="btn btn-sm btn-ghost" style="color: #f43f5e;" onclick="app.handleRevokeApiKey('${k.id}')">Revoke</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Interactive API Code Explorer -->
        <div class="admin-tool-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <h3 style="font-size: 1.1rem; font-weight: 800;">Interactive REST API Explorer (Endpoint: <code>POST /v1/prompts/run</code>)</h3>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-secondary" onclick="app.switchApiLanguage('curl')">cURL</button>
              <button class="btn btn-sm btn-secondary" onclick="app.switchApiLanguage('python')">Python SDK</button>
              <button class="btn btn-sm btn-secondary" onclick="app.switchApiLanguage('node')">Node.js SDK</button>
            </div>
          </div>

          <div style="background: #090d16; padding: 18px; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8; border: 1px solid var(--border-subtle); margin-bottom: 20px; overflow-x: auto;">
            <pre style="margin: 0;" id="apiCodeSnippet">curl -X POST https://api.promptkitt.io/v1/prompts/run \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'pk_live_sample'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt_id": "p1",
    "variables": {
      "subject": "cyberpunk woman",
      "lighting": "dual neon rim lights"
    }
  }'</pre>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn btn-primary" id="btnTestApiSend" onclick="app.handleTestApiRequest()">
              <i class="ph-bold ph-paper-plane-tilt"></i> Send Live Test API Request
            </button>
          </div>

          <div id="apiResponseBox" style="display: none; margin-top: 20px; background: #090d16; padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--accent-emerald);">
            <span style="color: var(--accent-emerald); font-weight: 800; font-size: 0.82rem; display: block; margin-bottom: 8px;">HTTP/2 200 OK (84ms)</span>
            <pre style="margin: 0; color: #a7f3d0; font-family: var(--font-mono); font-size: 0.85rem;">{
  "status": "success",
  "execution_id": "exec_984128f7",
  "model": "FLUX.1 Pro",
  "rendered_prompt": "Award-winning editorial portrait photograph of cyberpunk woman, dual neon rim lights...",
  "tokens_consumed": 42,
  "output_url": "https://cdn.promptkitt.io/renders/exec_984128f7.png"
}</pre>
          </div>
        </div>
      </div>
    `;
  }

  handleCreateApiKeyModal() {
    const keyName = prompt('Enter a name for this API Key:', 'Production Backend API') || 'API Key';
    const newKey = pkStore.createApiKey(keyName);
    this.showToast(`New API key "${keyName}" generated successfully!`, 'success');
    this.renderDeveloper(document.getElementById('appContent'));
  }

  handleRevokeApiKey(keyId) {
    if (confirm('Are you sure you want to revoke this API token? Any applications using it will stop working immediately.')) {
      pkStore.revokeApiKey(keyId);
      this.showToast('API Key revoked.', 'info');
      this.renderDeveloper(document.getElementById('appContent'));
    }
  }

  switchApiLanguage(lang) {
    const snippet = document.getElementById('apiCodeSnippet');
    if (!snippet) return;
    if (lang === 'python') {
      snippet.innerText = `import promptkitt

client = promptkitt.Client(api_key="pk_live_...")
response = client.prompts.run(
    prompt_id="p1",
    variables={"subject": "cyberpunk woman", "lighting": "dual neon rim"}
)
print(response.output_url)`;
    } else if (lang === 'node') {
      snippet.innerText = `import { PromptKitt } from '@promptkitt/sdk';

const pk = new PromptKitt({ apiKey: 'pk_live_...' });
const result = await pk.prompts.run({
  promptId: 'p1',
  variables: { subject: 'cyberpunk woman', lighting: 'dual neon rim' }
});
console.log(result.outputUrl);`;
    } else {
      snippet.innerText = `curl -X POST https://api.promptkitt.io/v1/prompts/run \\
  -H "Authorization: Bearer pk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"prompt_id": "p1", "variables": {"subject": "cyberpunk woman"}}'`;
    }
  }

  handleTestApiRequest() {
    const btn = document.getElementById('btnTestApiSend');
    const resBox = document.getElementById('apiResponseBox');
    if (btn) btn.innerHTML = '<i class="ph-bold ph-spinner"></i> Executing API Request...';
    setTimeout(() => {
      if (btn) btn.innerHTML = '<i class="ph-bold ph-paper-plane-tilt"></i> Send Live Test API Request';
      if (resBox) resBox.style.display = 'block';
      this.showToast('API call returned HTTP 200 OK!', 'success');
    }, 600);
  }

  // =========================================================================
  // 5. OFFICIAL DIGITAL LICENSE & CERTIFICATE OF AUTHENTICITY (#license/:id)
  // =========================================================================
  renderLicenseCertificate(container, promptId) {
    const allPrompts = [...PK_DATA.prompts, ...(pkStore.state.customPrompts || [])];
    const promptObj = allPrompts.find(p => p.id === promptId) || allPrompts[0];
    const user = pkStore.state.user || { name: 'Jordan Sterling' };

    container.innerHTML = `
      <div class="container" style="padding: 40px 20px 80px; max-width: 780px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <button class="btn btn-secondary btn-sm" onclick="app.navigate('library')">
            <i class="ph-bold ph-arrow-left"></i> Back to Digital Vault
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">
            <i class="ph-bold ph-printer"></i> Print / Save Certificate PDF
          </button>
        </div>

        <div class="settings-card" style="padding: 44px; border: 2px solid #f59e0b; background: linear-gradient(180deg, #111726 0%, #090d16 100%); position: relative; box-shadow: 0 0 40px rgba(245,158,11,0.15);">
          <!-- Top Holographic Seal -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 70px; height: 70px; margin: 0 auto 12px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: #fff; box-shadow: 0 0 20px rgba(245,158,11,0.4);">
              <i class="ph-fill ph-seal-check"></i>
            </div>
            <span style="font-family: var(--font-display); font-size: 0.85rem; font-weight: 800; letter-spacing: 2px; color: #f59e0b; text-transform: uppercase;">PromptKitt Commercial Trust Protocol</span>
            <h1 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: #fff; margin-top: 6px;">Certificate of Authenticity & Commercial License</h1>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 24px 0; margin-bottom: 24px; line-height: 1.8; font-size: 0.95rem; color: var(--text-secondary);">
            <p>This certifies that <strong>${user.name}</strong> holds full worldwide, perpetual, royalty-free commercial rights to deploy and monetize derivative works engineered from the master prompt:</p>
            <div style="background: var(--bg-primary); padding: 14px 18px; border-radius: var(--radius-sm); border-left: 4px solid #f59e0b; margin: 16px 0;">
              <strong style="color: #fff; font-size: 1.05rem; display: block;">${promptObj.title}</strong>
              <span style="font-size: 0.8rem; color: var(--accent-cyan); font-family: var(--font-mono);">Engine Architecture: ${promptObj.model.toUpperCase()} · Certified Quality Score: 98/100</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 0.85rem; margin-bottom: 30px;">
            <div>
              <span style="color: var(--text-muted); display: block;">Certificate ID:</span>
              <strong style="font-family: var(--font-mono); color: #fff;">CERT-PK-2026-${promptObj.id.toUpperCase()}-882</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Issued Date:</span>
              <strong style="color: #fff;">August 18, 2026 (Immutable)</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Cryptographic SHA-256 Hash:</span>
              <code style="font-size: 0.72rem;">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">License Scope:</span>
              <strong style="color: var(--accent-emerald);">Worldwide Commercial / Enterprise Full Rights</strong>
            </div>
          </div>

          <div style="text-align: center; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">Verified by PromptKitt Pro Global Verification Protocol. Authenticity guaranteed.</span>
          </div>
        </div>
      </div>
    `;
  }

  showToast(message, type = 'normal') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="ph-bold ph-info" style="color: var(--accent-primary);"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

window.app = new PromptKittApp();
