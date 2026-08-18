/**
 * PromptKitt Pro - Mock Database & Rich Initial Seed Data
 * Contains comprehensive seed datasets for prompts, models, categories, creators, bounties, collections, and reviews.
 */

const PK_DATA = {
  // Supported AI Models & Engines
  models: [
    { id: 'midjourney', name: 'Midjourney', badge: 'Midjourney', icon: '🎨', color: '#ff5c5c', category: 'image' },
    { id: 'flux', name: 'FLUX', badge: 'FLUX', icon: '⚡', color: '#00f0ff', category: 'image' },
    { id: 'chatgpt', name: 'ChatGPT', badge: 'ChatGPT', icon: '🤖', color: '#10a37f', category: 'text' },
    { id: 'claude', name: 'Claude', badge: 'Claude', icon: '🧠', color: '#d97706', category: 'text' },
    { id: 'dalle', name: 'DALL·E', badge: 'DALL·E', icon: '🖼️', color: '#8b5cf6', category: 'image' },
    { id: 'gemini', name: 'Gemini', badge: 'Gemini', icon: '✨', color: '#3b82f6', category: 'multimodal' },
    { id: 'stablediffusion', name: 'Stable Diffusion', badge: 'Stable Diffusion', icon: '🔮', color: '#ec4899', category: 'image' },
    { id: 'deepseek', name: 'DeepSeek', badge: 'DeepSeek', icon: '🐋', color: '#0284c7', category: 'code' },
    { id: 'runway', name: 'Runway', badge: 'Runway', icon: '🎬', color: '#06b6d4', category: 'video' },
    { id: 'suno', name: 'Suno', badge: 'Suno', icon: '🎵', color: '#f43f5e', category: 'audio' },
    { id: 'agent-skills', name: 'Agent Workflows', badge: 'Agent Workflows', icon: '⚙️', color: '#6366f1', category: 'code' }
  ],

  // Categories
  categories: [
    { id: 'photorealistic', name: 'Photorealistic Portraits', icon: '📸', count: 142, slug: 'photorealistic', desc: 'Studio lighting, 8k textures, natural skin tones, and high-fashion aesthetics.' },
    { id: 'cyberpunk-3d', name: '3D & Cyberpunk Art', icon: '🌆', count: 98, slug: 'cyberpunk-3d', desc: 'Futuristic cityscapes, volumetric neon lighting, and isolated isometric props.' },
    { id: 'marketing-copy', name: 'High-Converting Copy', icon: '📈', count: 86, slug: 'marketing-copy', desc: 'Direct-response sales letters, viral threads, and high-converting landing pages.' },
    { id: 'code-dev', name: 'Full-Stack Architecture', icon: '💻', count: 64, slug: 'code-dev', desc: 'Production-ready React, Next.js, TypeScript, and distributed systems.' },
    { id: 'logo-branding', name: 'Vector Logo & Brand Kits', icon: '✨', count: 110, slug: 'logo-branding', desc: 'Minimalist vector logos, mascot emblems, and corporate brand guidelines.' },
    { id: 'anime-concept', name: 'Anime & Concept Art', icon: '🗡️', count: 75, slug: 'anime-concept', desc: 'Makoto Shinkai aesthetic, fantasy character design, and environment sheets.' },
    { id: 'cinematic-video', name: 'Cinematic Video Prompts', icon: '🎥', count: 42, slug: 'cinematic-video', desc: 'Camera movement cues, depth-of-field timing, and video storyboard scripts.' },
    { id: 'music-lyrics', name: 'Hit Song & Beat Prompts', icon: '🎧', count: 39, slug: 'music-lyrics', desc: 'Genre-fused Suno / Udio audio generation prompts and lyrical structures.' }
  ],

  // Goals / Use Cases
  goals: [
    { id: 'ecommerce', title: 'Boost E-Commerce Sales', icon: '🛍️', desc: 'Prompts tailored for product photography, Amazon listings & high-converting ad copy.' },
    { id: 'game-assets', title: 'Generate AAA Game Assets', icon: '🎮', desc: 'Textures, 3D isometric sprites, UI inventory icons, and character sheets.' },
    { id: 'saas-landing', title: 'Build SaaS Landing Pages', icon: '🚀', desc: 'Copywriting formulas & code prompts with zero placeholders.' },
    { id: 'social-growth', title: 'Go Viral on Social Media', icon: '🔥', desc: 'Retention-optimized hooks, TikTok/Shorts storyboards, and click-worthy thumbnails.' }
  ],

  // Creators
  creators: [
    {
      id: 'c1',
      username: 'NeuralAlchemist',
      displayName: 'Alex Rivers (Neural Alchemist)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'PRO MASTER',
      verified: true,
      bio: 'Pioneer in photorealistic Midjourney & FLUX lighting architectures. Over 15,000 prompt sales globally.',
      rating: 4.98,
      salesCount: 4820,
      promptsCount: 42,
      followersCount: 1280,
      location: 'San Francisco, CA',
      joinedDate: 'Member since Jan 2025'
    },
    {
      id: 'c2',
      username: 'SyntaxSorcerer',
      displayName: 'Maya Chen (Staff AI Architect)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'TOP SELLER',
      verified: true,
      bio: 'Senior AI Engineer creating production-ready Claude & ChatGPT agent system workflows and prompts.',
      rating: 4.95,
      salesCount: 3190,
      promptsCount: 29,
      followersCount: 940,
      location: 'Toronto, Canada',
      joinedDate: 'Member since March 2025'
    },
    {
      id: 'c3',
      username: 'NeonDreamer',
      displayName: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'VERIFIED CREATOR',
      verified: true,
      bio: 'Cinematic 3D render specialist, hyper-detailed futuristic cyberpunk cityscapes and vehicle designs.',
      rating: 4.88,
      salesCount: 1950,
      promptsCount: 18,
      followersCount: 620,
      location: 'Berlin, Germany',
      joinedDate: 'Member since Nov 2024'
    }
  ],

  // Prompts Collection (Master Seed Data)
  prompts: [
    {
      id: 'p1',
      slug: 'ultra-realistic-8k-cinematic-portrait',
      title: 'Ultra-Realistic 8K Cinematic Cyber-Fashion Portrait Generator',
      category: 'photorealistic',
      modelId: 'midjourney',
      price: 4.99,
      isFree: false,
      isFeatured: true,
      rating: 4.97,
      reviewsCount: 184,
      salesCount: 1240,
      creatorId: 'c1',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Generates studio-grade, hyper-realistic portraits with cinematic volumetric lighting, raytraced reflections, and customizable haute couture outfits. Tested on Midjourney with consistent 99% hit rate.',
      qualityScore: 98,
      scoreBreakdown: { clarity: 'Exceptional (99%)', params: 'Optimized (--ar 16:9, --style raw)', tokens: 'Zero Fluff (97%)', versatility: 'High (5 Variables)' },
      variables: [
        { key: 'subject', label: 'Subject / Model', defaultVal: 'cyberpunk warrior woman with iridescent braided hair' },
        { key: 'lighting', label: 'Lighting Mood', defaultVal: 'dual neon teal and magenta volumetric rim lighting' },
        { key: 'wardrobe', label: 'Wardrobe Style', defaultVal: 'high-collar holographic obsidian jacket with fiber optics' },
        { key: 'lens', label: 'Camera & Lens', defaultVal: 'Hasselblad H6D-100c, 85mm f/1.2 lens, shallow depth of field' },
        { key: 'aspect_ratio', label: 'Aspect Ratio', defaultVal: '16:9' }
      ],
      template: 'Award-winning editorial portrait photograph of [subject], wearing [wardrobe], [lighting], shot on [lens], ultra-fine skin pores, photorealistic texture, raytraced reflections, 8k resolution, cinematic color grading --ar [aspect_ratio] --style raw --stylize 250',
      instructions: '1. Replace the bracketed variables with your desired style.\n2. Use in Midjourney discord server or web app.\n3. Recommended stylize range: 150 - 350 for optimum photorealism.',
      tags: ['midjourney', 'portrait', 'cyberpunk', 'fashion', 'cinematic', '8k'],
      reviews: [
        { id: 'rev_1', author: 'Elena Rostova', rating: 5, time: '2 days ago', comment: 'Incredible skin texture coherence! The rim lighting variables gave me exactly the look I needed for my lookbook.', upvotes: 18 },
        { id: 'rev_2', author: 'Liam S.', rating: 5, time: '5 days ago', comment: 'Best Midjourney portrait prompt on the marketplace. Works every single roll without fail.', upvotes: 12 }
      ]
    },
    {
      id: 'p2',
      slug: 'flux-photoreal-hyper-detailed-interior',
      title: 'FLUX Scandinavian Minimalist Architecture & Interior Suite',
      category: 'photorealistic',
      modelId: 'flux',
      price: 3.99,
      isFree: false,
      isFeatured: true,
      rating: 4.95,
      reviewsCount: 142,
      salesCount: 890,
      creatorId: 'c1',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Ultra-realistic architectural renders with precise lighting, soft morning sunbeams, marble and oak textures. Built specifically to leverage FLUX prompt coherence.',
      qualityScore: 96,
      scoreBreakdown: { clarity: 'Exceptional (97%)', params: 'FLUX Native CFG 3.5', tokens: 'Precise (96%)', versatility: 'High' },
      variables: [
        { key: 'room_type', label: 'Room Type', defaultVal: 'luxury penthouse living room with floor-to-ceiling glass walls' },
        { key: 'view', label: 'Outside View', defaultVal: 'misty pine forest and tranquil lake at dawn' },
        { key: 'materials', label: 'Materials & Furniture', defaultVal: 'brushed travertine marble fireplace, minimalist curved boucle sofa' },
        { key: 'time_of_day', label: 'Lighting / Time', defaultVal: 'golden hour soft diffused sunlight casting gentle shadows' }
      ],
      template: 'Architectural Digest photograph of [room_type], overlooking [view], featuring [materials], [time_of_day], photorealistic interior design, 35mm f/2.8 architectural photography, neutral tones, hyper-detailed textures, unreal engine 5 render realism.',
      instructions: 'Works best on FLUX with Guidance Scale 3.5 and 28 steps.',
      tags: ['flux', 'architecture', 'interior', 'minimalist', 'luxury'],
      reviews: [
        { id: 'rev_3', author: 'Carlos Mendonza', rating: 5, time: '1 week ago', comment: 'The travertine and oak textures look indistinguishable from real architectural photography. Worth every cent.', upvotes: 9 }
      ]
    },
    {
      id: 'p3',
      slug: 'claude-fullstack-production-code-architect',
      title: 'Claude Senior Full-Stack System Architect & Code Auditor',
      category: 'code-dev',
      modelId: 'claude',
      price: 5.99,
      isFree: false,
      isFeatured: true,
      rating: 4.99,
      reviewsCount: 310,
      salesCount: 2450,
      creatorId: 'c2',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Turn Claude into a Principal Staff Software Architect. Outputs bug-free, fully typed, production-ready React/TypeScript/Next.js/Node code with unit test suites and architectural diagrams.',
      qualityScore: 99,
      scoreBreakdown: { clarity: 'Flawless (100%)', params: 'Artifacts & Markdown Structured', tokens: 'Engineered (98%)', versatility: 'Endless' },
      variables: [
        { key: 'tech_stack', label: 'Tech Stack', defaultVal: 'Next.js App Router, TypeScript, TailwindCSS, Supabase, Prisma' },
        { key: 'feature_requirement', label: 'Feature Spec', defaultVal: 'Real-time collaborative kanban board with optimistic UI updates and undo/redo' },
        { key: 'constraint', label: 'Performance / Security Constraints', defaultVal: 'Strict zero bundle bloat, zero any types, enterprise OWASP security compliance' }
      ],
      template: `You are a Principal Staff Software Architect with 15+ years of experience in distributed systems and [tech_stack].

Your mission is to architect and deliver a production-grade, enterprise-ready implementation for:
[feature_requirement]

CONSTRAINTS & RULES:
1. Strict Type Safety: [constraint].
2. Provide full, working drop-in files without placeholders like '// rest of code here'.
3. Include error boundaries, optimistic updates, and clean modular directory structure.
4. Provide comprehensive Jest/Vitest unit tests covering edge cases.

Respond systematically with:
- Architecture Decisions & Data Schema
- Complete Production Source Files
- Unit & Integration Tests`,
      instructions: 'Paste into Claude (Projects or Chat). For best output, enable Artifacts.',
      tags: ['claude', 'coding', 'typescript', 'react', 'nextjs', 'system-design'],
      reviews: [
        { id: 'rev_4', author: 'Devin K.', rating: 5, time: '3 days ago', comment: 'Generated a full Supabase auth + Stripe webhooks flow with zero type errors. Saved me 3 days of work.', upvotes: 31 }
      ]
    },
    {
      id: 'p4',
      slug: 'gpt-high-converting-saas-copywriter',
      title: 'ChatGPT Million-Dollar SaaS Landing Page & Cold Email Engine',
      category: 'marketing-copy',
      modelId: 'chatgpt',
      price: 0.00,
      isFree: true,
      isFeatured: true,
      rating: 4.92,
      reviewsCount: 520,
      salesCount: 3800,
      creatorId: 'c2',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'FREE high-converting copy generator utilizing psychological hooks from Cialdini & Ogilvy. Generates hero sections, feature benefit bullet points, objection destroyers, and 5 cold email sequences.',
      qualityScore: 94,
      scoreBreakdown: { clarity: 'High (95%)', params: 'Multi-Step Execution', tokens: 'High Density', versatility: 'Extreme' },
      variables: [
        { key: 'product_name', label: 'Product Name', defaultVal: 'FlowPulse AI' },
        { key: 'target_audience', label: 'Target Audience', defaultVal: 'B2B SaaS Founders and Marketing Leads' },
        { key: 'pain_point', label: 'Core Pain Point', defaultVal: 'Spending 20+ hours a week manually qualifying inbound leads' },
        { key: 'unique_mechanism', label: 'Unique Solution Mechanism', defaultVal: 'Autonomous AI sales agent that enriches and chats with leads 24/7' }
      ],
      template: `Act as a legendary direct-response copywriter (Eugene Schwartz + David Ogilvy level). 

Product: [product_name]
Audience: [target_audience]
Frustration/Pain: [pain_point]
Secret Sauce / Unique Mechanism: [unique_mechanism]

Execute the following 3 deliverables:
1. High-Converting Landing Page Hero & Value Proposition (3 Hook Variations + Subhead + Primary CTA).
2. "Before vs After" Pain Transformation Bridge.
3. 3-Touchpoint Personalized Cold Outreach Email Sequence with irresistible open rates.`,
      instructions: 'Works flawlessly on ChatGPT, Claude, and Gemini.',
      tags: ['chatgpt', 'copywriting', 'marketing', 'saas', 'free', 'cold-email'],
      reviews: [
        { id: 'rev_5', author: 'Samantha Rae', rating: 5, time: '2 weeks ago', comment: 'Used this for our product relaunch and our conversion rate jumped from 2.1% to 5.4%!', upvotes: 45 }
      ]
    },
    {
      id: 'p5',
      slug: 'midjourney-3d-isometric-game-assets-pack',
      title: 'Midjourney 3D Isometric Cyberpunk Game Asset & Icon Forge',
      category: 'cyberpunk-3d',
      modelId: 'midjourney',
      price: 3.49,
      isFree: false,
      isFeatured: false,
      rating: 4.90,
      reviewsCount: 94,
      salesCount: 620,
      creatorId: 'c3',
      coverImage: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Generates ultra-crisp, isolated 3D isometric game assets, sci-fi props, UI inventory icons, and building tiles on a pure dark or transparent-ready background.',
      qualityScore: 95,
      scoreBreakdown: { clarity: 'Clean (96%)', params: 'Midjourney', tokens: 'Isolated', versatility: 'High' },
      variables: [
        { key: 'game_item', label: 'Item / Building', defaultVal: 'futuristic quantum data server terminal with glowing holographic crystals' },
        { key: 'palette', label: 'Color Palette', defaultVal: 'cyan, deep violet, and matte graphite' },
        { key: 'lighting', label: 'Light FX', defaultVal: 'neon emissive glow, soft ambient occlusion' }
      ],
      template: '3D isometric game asset icon of [game_item], [palette], [lighting], stylized Unreal Engine 5 render, Blender 3D, raytraced ambient occlusion, isolated on solid dark studio background, ultra-sharp edges, high fidelity UI game icon --ar 1:1 --style raw',
      instructions: 'Ideal for game developers and UI designers creating asset packs.',
      tags: ['midjourney', 'game-dev', 'isometric', '3d', 'icons', 'cyberpunk'],
      reviews: [
        { id: 'rev_6', author: 'IndieGameDev99', rating: 5, time: '4 days ago', comment: 'Crisp transparent-friendly assets on every roll. Saved me hours in Blender.', upvotes: 14 }
      ]
    }
  ],

  // Bundles / Collections
  collections: [
    {
      id: 'col1',
      slug: 'cyberpunk-mastery-bundle',
      title: 'Ultimate Cyberpunk & Sci-Fi 3D Master Suite (5 Prompts)',
      creatorId: 'c1',
      price: 12.99,
      originalPrice: 22.95,
      discountPercent: 43,
      promptsCount: 5,
      salesCount: 310,
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80'
      ],
      description: 'Everything you need to create jaw-dropping futuristic character art, vehicles, cities, and game props in Midjourney and FLUX.'
    },
    {
      id: 'col2',
      slug: 'ai-software-engineering-vault',
      title: 'AI Software Engineer & Tech Lead Master Toolkit (6 Prompts)',
      creatorId: 'c2',
      price: 14.99,
      originalPrice: 28.00,
      discountPercent: 46,
      promptsCount: 6,
      salesCount: 420,
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80'
      ],
      description: 'Claude & ChatGPT expert blueprints for system architectures, automated testing, code migrations, and debugging complex distributed systems.'
    }
  ],

  // Custom Prompt Bounties
  bounties: [
    {
      id: 'b1',
      number: 1042,
      title: 'Photorealistic Luxury Watch Photography in Midjourney with custom engravings',
      status: 'open',
      budget: 35.00,
      submissionsCount: 4,
      buyerName: 'David K. (Watchmaker Brand)',
      buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      description: 'Looking for a prompt template that can consistently generate Swiss luxury mechanical chronographs with intricate macro dials, sapphire crystal glare, and realistic leather strap stitching.',
      deadline: 'In 3 days',
      modelTarget: 'Midjourney'
    },
    {
      id: 'b2',
      number: 1043,
      title: 'Claude prompt to convert raw Figma tokens JSON into Tailwind CSS theme configuration',
      status: 'open',
      budget: 50.00,
      submissionsCount: 7,
      buyerName: 'Sarah Jenkins (Frontend Lead)',
      buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      description: 'Need an airtight system prompt for Claude to take nested Figma design tokens JSON and transform it cleanly into Tailwind CSS custom properties without errors.',
      deadline: 'In 5 days',
      modelTarget: 'Claude'
    },
    {
      id: 'b3',
      number: 1040,
      title: 'FLUX Consistent Character Sheet with 8 Emotional Angles',
      status: 'closed',
      budget: 75.00,
      submissionsCount: 12,
      buyerName: 'PixelStudio Game Director',
      buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      description: 'Awarded to @NeuralAlchemist! Excellent seed consistency across multiple lighting angles.',
      deadline: 'Closed & Paid',
      modelTarget: 'FLUX'
    }
  ],

  // Subscription Plans
  plans: [
    {
      id: 'plan_monthly',
      name: 'PromptKitt Select VIP',
      badge: 'MOST POPULAR',
      price: 19.99,
      interval: 'month',
      perks: [
        '15 Free Premium Prompt Unlocks every month',
        '25% Flat Discount across all marketplace purchases',
        'Unlimited AI Playground Runs & Variable Testing',
        'Early Access to new Model Prompts (FLUX, Sora, Midjourney)',
        'VIP Member Gold Badge on profile & reviews'
      ]
    },
    {
      id: 'plan_annual',
      name: 'Select Creator Studio VIP',
      badge: 'BEST VALUE (SAVE 35%)',
      price: 149.00,
      interval: 'year',
      perks: [
        'Unlimited Prompt Unlocks from Select Vault',
        'Zero Seller Commission (Keep 100% of your earnings)',
        '5,000 AI Playground generation credits',
        'Featured placement on marketplace homepage',
        'Priority 24/7 dedicated support & Discord VIP role'
      ]
    }
  ],

  // Currency Conversion Matrix
  currencyRates: {
    USD: { symbol: '$', rate: 1.0, name: 'USD (United States Dollar)' },
    TZS: { symbol: 'TSh ', rate: 2650.0, name: 'TZS (Tanzanian Shilling)' },
    KES: { symbol: 'KSh ', rate: 132.0, name: 'KES (Kenyan Shilling)' },
    EUR: { symbol: '€', rate: 0.92, name: 'EUR (Euro)' },
    GBP: { symbol: '£', rate: 0.78, name: 'GBP (British Pound)' },
    USDT: { symbol: '₮ ', rate: 1.0, name: 'USDT (Tether USD Crypto)' }
  },

  // 1. AI Agent Multi-Step Workflow Pipelines
  workflows: [
    {
      id: 'wf_1',
      title: 'Autonomous SaaS Product Launcher & Marketing Agent Pipeline',
      badge: 'ENTERPRISE PIPELINE',
      category: 'saas-landing',
      price: 29.99,
      rating: 4.98,
      salesCount: 384,
      creatorId: 'c2',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      description: 'End-to-end 4-step autonomous agent chain that performs deep competitor intelligence, writes landing page copy, drafts Next.js React components, and generates 4K 3D marketing hero renders.',
      steps: [
        { stepNum: 1, engine: 'DeepSeek', name: 'Market Intelligence & Competitor Audit', action: 'Scrapes niche domain, maps value propositions, and identifies market gaps.' },
        { stepNum: 2, engine: 'Claude', name: 'High-Converting Copywriting & Hook Generator', action: 'Generates PAS framework sales copy, headline matrix, and feature bullets.' },
        { stepNum: 3, engine: 'Midjourney', name: '3D Isometric Hero Visuals & Product Mockups', action: 'Synthesizes 8K raytraced software UI renders with volumetric studio lighting.' },
        { stepNum: 4, engine: 'ChatGPT', name: 'Production-Ready React & Tailwind Code Assembly', action: 'Assembles fully typed, responsive Next.js landing page code with dark mode.' }
      ]
    },
    {
      id: 'wf_2',
      title: 'E-Commerce Viral Video Ad & Storyboard Production Chain',
      badge: 'VIRAL PIPELINE',
      category: 'ecommerce',
      price: 24.99,
      rating: 4.95,
      salesCount: 512,
      creatorId: 'c1',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      description: 'Automated creative pipeline for TikTok & Instagram Reels. Produces viral hook scripts, shot-by-shot Runway Gen-3 video prompts, and Suno background beats.',
      steps: [
        { stepNum: 1, engine: 'ChatGPT', name: 'Viral Hook & 3-Act Script Formulation', action: 'Drafts high-retention 15-second TikTok video scripts with psychological triggers.' },
        { stepNum: 2, engine: 'Runway', name: 'Cinematic Video Shot Prompts & Motion Vectoring', action: 'Generates camera pan, tilt, and lighting cues for photorealistic product B-roll.' },
        { stepNum: 3, engine: 'Suno', name: 'Upbeat Lo-Fi Hip Hop Audio Beat Soundtrack', action: 'Composes commercial royalty-free background beat synchronized to video transitions.' }
      ]
    },
    {
      id: 'wf_3',
      title: 'Enterprise Cyber Threat Intelligence & Microservice Security Auditor',
      badge: 'SECURITY DAG',
      category: 'code-dev',
      price: 34.99,
      rating: 5.0,
      salesCount: 198,
      creatorId: 'c3',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      description: 'Comprehensive cybersecurity audit chain. Analyzes infrastructure YAMLs, runs STRIDE threat modeling, and outputs certified remediation pull requests.',
      steps: [
        { stepNum: 1, engine: 'DeepSeek', name: 'Vulnerability Signature Parsing', action: 'Scans architectural manifests for OWASP Top 10 vulnerabilities & insecure endpoints.' },
        { stepNum: 2, engine: 'Claude', name: 'Formal Threat Model & STRIDE Matrix Generation', action: 'Generates enterprise compliance risk tables (SOC2 / ISO 27001 aligned).' },
        { stepNum: 3, engine: 'ChatGPT', name: 'Automated Zero-Trust Remediation Code Generator', action: 'Produces hardened Kubernetes security policies and sanitized API middleware.' }
      ]
    }
  ],

  // 2. Prompt Arena & Blind Battle ELO Rankings
  arenaMatches: [
    {
      id: 'match_01',
      title: 'Photorealistic Cyber-Goth High Fashion Portrait',
      seed: 'Editorial portrait of futuristic warrior woman, dual neon volumetric rim lighting, Hasselblad 85mm f/1.2, 8k raw',
      promptA: {
        model: 'Midjourney',
        preview: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        creator: 'NeuralAlchemist',
        votes: 1420
      },
      promptB: {
        model: 'FLUX',
        preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        creator: 'QuantumRenderer',
        votes: 1385
      }
    },
    {
      id: 'match_02',
      title: 'Full-Stack Distributed Cache Architecture Prompt',
      seed: 'Design a Redis-backed multi-region distributed caching layer in Go with circuit breaking',
      promptA: {
        model: 'Claude',
        preview: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        creator: 'SyntaxSorcerer',
        votes: 980
      },
      promptB: {
        model: 'DeepSeek',
        preview: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        creator: 'QuantEngineer',
        votes: 1040
      }
    }
  ],

  arenaLeaderboard: [
    { rank: 1, name: 'Alex Rivers (Neural Alchemist)', username: 'NeuralAlchemist', elo: 2480, winRate: '78.4%', totalBattles: 1420, badge: 'GRANDMASTER' },
    { rank: 2, name: 'Maya Chen (Syntax Sorcerer)', username: 'SyntaxSorcerer', elo: 2395, winRate: '74.2%', totalBattles: 1180, badge: 'MASTER' },
    { rank: 3, name: 'Quantum Renderer', username: 'QuantumRenderer', elo: 2310, winRate: '71.0%', totalBattles: 940, badge: 'ELITE' },
    { rank: 4, name: 'Marcus Vance', username: 'NeonDreamer', elo: 2180, winRate: '68.5%', totalBattles: 760, badge: 'PRO' },
    { rank: 5, name: 'Elena Rostova', username: 'elena_design', elo: 2090, winRate: '64.9%', totalBattles: 620, badge: 'PRO' }
  ]
};

window.PK_DATA = PK_DATA;

