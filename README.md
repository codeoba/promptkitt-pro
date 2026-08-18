# 🐱 PromptKitt Pro - Next-Gen AI Prompt Marketplace, Creator Economy & Sandbox

**PromptKitt Pro** is a world-class enterprise AI prompt marketplace, autonomous prompt engineering suite, and creator economy platform supporting all evergreen AI models (**Midjourney, FLUX, Claude, ChatGPT, DeepSeek, Gemini, Stable Diffusion, Runway, and Suno**).

![PromptKitt Pro Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 1. 🛒 Next-Gen Marketplace & Discovery
- **Evergreen Multi-Model Engine**: Clean, versionless AI model taxonomy for Midjourney, FLUX, Claude, ChatGPT, DeepSeek, Gemini, Stable Diffusion, Runway, and Suno.
- **Smart Filtering & Sorting**: Filter by AI Model, Category, Project Goal, and sort by Price, Rating, Sales, and Quality Score.
- **Dynamic Variable Injection Sandbox**: Test prompt variables (`[subject]`, `[lighting]`, `[camera]`) in real time before acquiring.

### 2. 🔗 Autonomous Agent Workflows & DAG Pipelines (`#workflows`)
- **Multi-Step Agent Chains**: Chained multi-model pipelines connecting DeepSeek research, Claude copywriting, Midjourney visuals, and ChatGPT code assembly.
- **Visual DAG Flow Runner**: Live animated multi-node execution engine with downloadable deliverable ZIP bundles.

### 3. ⚔️ Prompt Arena & Blind ELO Battles (`#arena`)
- **Blind Side-by-Side Prompt Battles**: Vote on blind outputs to determine the world's best prompt architectures.
- **Global ELO Leaderboard**: Real-time ELO rating and win-rate rankings for top prompt engineers.

### 4. ⚡ AI Token Cost Optimizer & Prompt Compressor (`#optimizer`)
- **Token Compression Engine**: Reduce verbose ChatGPT/Claude system prompts by **40% to 62%** using dense Few-Shot tags.
- **Inference Cost Calculator**: Real-time monthly API savings projection in USD.

### 5. 💻 Enterprise Developer API & Webhooks Hub (`#developer`)
- **REST API Gateway**: Interactive endpoint explorer with `POST /v1/prompts/run` examples in cURL, Python SDK, and Node.js SDK.
- **Secret Key Management**: Instant API Key generation (`pk_live_...`), revocation, and token metering.

### 6. 🛡️ Super Admin Control Center Suite (`#admin-dashboard`)
- **Moderation Queue**: Dynamic review items, prompt inspector, 1-click Approve, Feature, and Reject.
- **Autonomous Batch Studio**: Synthesizes and publishes batch master prompt suites with live progress bars.
- **User & RBAC Directory**: Role permissions, account suspensions, and credit grants (+500⚡).
- **Creator KYC Approvals**: Verified ID document review with 99.4% biometric match scoring.
- **Financial Ledger & CSV Exporter**: Payout disbursements with real-time CSV ledger download.
- **Platform Economics Engine**: Interactive commission slider (5% to 30%) and global promo coupon manager.
- **Security Audit Logs**: Live CLI terminal displaying immutable system events with CSV export.

### 7. 🌍 Multi-Currency & Local/Global Checkout
- **Currency Switcher**: Real-time currency conversion for **USD ($), TZS (TSh), KES (KSh), EUR (€), GBP (£), and USDT (₮)**.
- **Global & Regional Gateways**: Support for **M-Pesa / Tigo Pesa Mobile STK Push**, **Web3 Crypto USDT Wallet**, **Stripe Credit Card**, and **Apple Pay**.

### 8. 📜 Digital Certificate of Authenticity (`#license/:id`)
- Cryptographically signed Commercial License with Gold Holographic Seal, SHA-256 hash, and PDF printing.

---

## 🚀 How to Install & Deploy on aaPanel (Quick Step-by-Step Guide)

PromptKitt Pro is engineered with clean, modern Vanilla HTML5, CSS3, and JavaScript with client-side reactive state persistence (`localStorage`). It runs blazing-fast on **Nginx**, **Apache**, or **OpenLiteSpeed** with zero heavy server dependencies!

### Step 1: Create a Website in aaPanel
1. Log in to your **aaPanel Dashboard**.
2. Navigate to **Website** in the left menu $\rightarrow$ Click **Add site**.
3. Enter your **Domain Name** (e.g. `prompts.yourdomain.com` or your server IP).
4. Choose **PHP: Static** or **PHP 7.4 / 8.0+** (PHP is not required since the app is pure high-performance static frontend).
5. Click **Submit**.

### Step 2: Upload or Clone the Repository
#### Option A: Clone via Git (Recommended)
1. In aaPanel, click **Terminal** or SSH into your server:
```bash
cd /www/wwwroot/yourdomain.com
git clone https://github.com/codeoba/promptkitt-pro.git .
```

#### Option B: Upload via aaPanel File Manager
1. In aaPanel, go to **Files** $\rightarrow$ Navigate to `/www/wwwroot/yourdomain.com/`.
2. Upload the project files (`index.html`, `css/`, `js/`, etc.) or upload a `.zip` file and click **Unzip**.

### Step 3: Configure Nginx / URL Rewrites (Optional for SPAs)
In aaPanel, click on your site name $\rightarrow$ Go to **URL rewrite** $\rightarrow$ Select `try_files` or paste the following Nginx snippet:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Step 4: Enable Free SSL (HTTPS)
1. In aaPanel, click on your site name $\rightarrow$ Go to **SSL** tab.
2. Select **Let's Encrypt** $\rightarrow$ Select your domain $\rightarrow$ Click **Apply**.
3. Toggle on **Force HTTPS**.

🎉 **Your PromptKitt Pro marketplace is now live, ultra-fast, and secure!**

---

## 💻 Tech Stack
- **Structure**: Semantic HTML5 with SPA Hash Router
- **Styles**: Vanilla CSS3 with Custom Design Tokens & Dark Glassmorphism Themes
- **Logic**: Vanilla ES6+ JavaScript Reactive State Store (`pkStore`)
- **Icons**: Phosphor Icons Core Library
- **Typography**: Outfit & Plus Jakarta Sans & JetBrains Mono (Google Fonts)

---

## 📄 License
Commercial License - Engineered for **codeoba**. All Rights Reserved.
