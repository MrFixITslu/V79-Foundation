import { Project, Sponsor, VolunteerApplication, GalleryMedia, BeneficiaryStory, CMSContent, AuditLog, AppNotification, User, HeroConfig, ImpactHubConfig, ImpactTimelineEvent, LiveActivityItem, FoundationScorecard, FoundationHealthData, FoundationAnalyticsData, CommunityLevel, Badge, PointRule, UserReputation, ProjectFeedback, AnnualCommunityAward, CorporateAccount, SponsorshipPackage, CorporateReport } from '../types.js';

export const initialImpactHubConfig: ImpactHubConfig = {
  refreshIntervalSeconds: 10,
  featuredProjectId: '',
  publicStatsEnabled: true,
  healthScorePublic: true,
  widgetsOrder: [
    'pinned_announcement',
    'live_metrics',
    'featured_project',
    'impact_map',
    'timeline',
    'activity_feed',
    'scorecard',
    'success_stories',
    'health_indicator',
  ],
  pinnedAnnouncement: {
    id: 'ann-1',
    title: 'Welcome to Vision79 Foundation',
    message: 'Explore our community projects, submit needs, donate, or volunteer to support grassroots initiatives.',
    date: new Date().toISOString().split('T')[0],
    type: 'event',
    link: '#',
    active: true,
  },
  metricsConfig: [
    { id: 'communities_served', label: 'Communities Served', value: 0, prefix: '', suffix: ' Districts', enabled: true, order: 1, category: 'community' },
    { id: 'lives_impacted', label: 'Lives Impacted', value: 0, prefix: '', suffix: '+', enabled: true, order: 2, category: 'community' },
    { id: 'active_projects', label: 'Active Projects', value: 0, prefix: '', suffix: '', enabled: true, order: 3, category: 'projects' },
    { id: 'completed_projects', label: 'Completed Projects', value: 0, prefix: '', suffix: '', enabled: true, order: 4, category: 'projects' },
    { id: 'planning_projects', label: 'Projects in Planning', value: 0, prefix: '', suffix: '', enabled: true, order: 5, category: 'projects' },
    { id: 'proposals', label: 'Community Proposals', value: 0, prefix: '', suffix: '', enabled: true, order: 6, category: 'community' },
    { id: 'votes_cast', label: 'Community Votes Cast', value: 0, prefix: '', suffix: '', enabled: true, order: 7, category: 'community' },
    { id: 'volunteers_registered', label: 'Volunteers Registered', value: 0, prefix: '', suffix: '', enabled: true, order: 8, category: 'volunteers' },
    { id: 'volunteer_hours', label: 'Volunteer Hours Logged', value: 0, prefix: '', suffix: ' hrs', enabled: true, order: 9, category: 'volunteers' },
    { id: 'sponsors', label: 'Active Corporate Sponsors', value: 0, prefix: '', suffix: '', enabled: true, order: 10, category: 'financial' },
    { id: 'donors', label: 'Individual Donors', value: 0, prefix: '', suffix: '', enabled: true, order: 11, category: 'financial' },
    { id: 'cash_donations', label: 'Cash Donations Received', value: 0, prefix: 'EC$', suffix: '', enabled: true, order: 12, category: 'financial' },
    { id: 'inkind_donations', label: 'In-Kind Goods Value', value: 0, prefix: 'EC$', suffix: '', enabled: true, order: 13, category: 'financial' },
    { id: 'funds_this_month', label: 'Funds Raised This Month', value: 0, prefix: 'EC$', suffix: '', enabled: true, order: 14, category: 'financial' },
    { id: 'lifetime_funds', label: 'Total Lifetime Funds Raised', value: 0, prefix: 'EC$', suffix: '', enabled: true, order: 15, category: 'financial' },
    { id: 'funding_distributed', label: 'Funding Distributed', value: 0, prefix: 'EC$', suffix: '', enabled: true, order: 16, category: 'financial' },
    { id: 'trees_planted', label: 'Trees & Mangroves Planted', value: 0, prefix: '', suffix: '', enabled: true, order: 17, category: 'social_environmental' },
    { id: 'scholarships_awarded', label: 'Scholarships Awarded', value: 0, prefix: '', suffix: '', enabled: true, order: 18, category: 'social_environmental' },
    { id: 'students_trained', label: 'Youth Students Trained', value: 0, prefix: '', suffix: '', enabled: true, order: 19, category: 'social_environmental' },
    { id: 'families_assisted', label: 'Families Assisted', value: 0, prefix: '', suffix: '', enabled: true, order: 20, category: 'community' },
    { id: 'emergency_responses', label: 'Emergency Responses', value: 0, prefix: '', suffix: '', enabled: true, order: 21, category: 'community' },
    { id: 'meals_distributed', label: 'Nutritional Meals Shared', value: 0, prefix: '', suffix: '', enabled: true, order: 22, category: 'social_environmental' },
    { id: 'events_hosted', label: 'Community Events Hosted', value: 0, prefix: '', suffix: '', enabled: true, order: 23, category: 'community' },
  ],
};

export const initialTimelineEvents: ImpactTimelineEvent[] = [];

export const initialLiveActivity: LiveActivityItem[] = [];

export const initialScorecard: FoundationScorecard = {
  projectsOnTimePct: 0,
  budgetPerformancePct: 0,
  volunteerSatisfactionRating: 0,
  communitySatisfactionRating: 0,
  fundingSuccessRatePct: 0,
  proposalApprovalRatePct: 0,
  avgProjectDurationDays: 0,
  avgCommunityRating: 0,
  trends: [],
};

export const initialHealthData: FoundationHealthData = {
  financialHealthScore: 100,
  volunteerCapacityScore: 100,
  projectCompletionScore: 100,
  fundingPipelineScore: 100,
  sponsorEngagementScore: 100,
  communityParticipationScore: 100,
  overallHealthScore: 100,
  publicVisibility: true,
};

export const initialAnalyticsData: FoundationAnalyticsData = {
  homepageViews: 0,
  mostViewedProjects: [],
  donationConversionRate: 0,
  volunteerConversionRate: 0,
  proposalSubmissionsThisMonth: 0,
  votingParticipationCount: 0,
  returningVisitorsPct: 0,
  sponsorEngagementRate: 0,
  monthlyDonationTrend: [],
};

export const initialHeroConfig: HeroConfig = {
  activeSlideId: 'hero-slide-1',
  autoRotate: false,
  rotateIntervalSeconds: 8,
  reducedMotion: false,
  slides: [
    {
      id: 'hero-slide-1',
      title: 'Main Foundation Mission',
      headline: 'Empowering Communities Through Direct Action & Radical Transparency.',
      subheading: 'Vision79 Foundation bridges resources and field execution across Saint Lucia with itemized audits, real-time needs boards, and local community leadership.',
      missionStatement: 'Transforming lives through clean water, healthcare infrastructure, and sustainable educational centers across Saint Lucia & Caribbean communities.',
      mediaType: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80',
      posterImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80',
      primaryCtaText: 'Make a Donation',
      primaryCtaAction: 'donate',
      secondaryCtaText: 'View Audit Ledger',
      secondaryCtaAction: 'transparency',
      overlayOpacity: 70,
      overlayGradient: 'brand',
      stats: [
        { label: 'Funds Raised', value: 0, prefix: 'EC$' },
        { label: 'Projects Completed', value: 0 },
        { label: 'Active Volunteers', value: 0 },
        { label: 'Lives Impacted', value: 0 },
      ],
      enabled: true,
      campaignType: 'standard',
      seoHeading: 'Vision79 Foundation | Direct Action & Radical Transparency in Saint Lucia',
      seoMetaDescription: 'Official website of Vision79 Foundation. Track community projects, itemized supply requests, and audited financial statements in real-time.',
      socialShareImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=630',
    },
  ],
};

export const initialUsers: User[] = [
  {
    id: 'usr_admin',
    name: 'Vision79 Director',
    email: 'admin@vision79.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    verified: true,
    createdAt: new Date().toISOString(),
    passwordHash: '$2b$10$HTRzW/qDE/uXkFODBpEWzunBC8B3CWmseLAEkRSM2yxgoacG9zu2m',
    failedLoginAttempts: 0,
  },
];

export const initialProjects: Project[] = [];

export const initialSponsors: Sponsor[] = [];

export const initialDonations = [];

export const initialVolunteers: VolunteerApplication[] = [];

export const initialGallery: GalleryMedia[] = [];

export const initialBeneficiaryStories: BeneficiaryStory[] = [];

export const initialCMSContent: CMSContent = {
  aboutMission: 'Vision79 Foundation is dedicated to empowering rural and underserved communities through sustainable infrastructure, digital education, accessible healthcare, and transparent grassroots impact.',
  aboutVision: 'A world where every community has reliable access to clean water, quality education, essential healthcare, and equal opportunity to thrive.',
  aboutHistory: 'Founded by a coalition of community leaders, educators, and healthcare professionals to drive direct Caribbean community empowerment.',
  faqList: [
    { question: 'How much of my donation goes directly to field projects?', answer: '100% of public donations directly fund project execution. Operational and administrative overhead is fully subsidized by our corporate founding partners.' },
    { question: 'Can I request a tax deductible receipt?', answer: 'Yes! All donations receive an immediate official tax receipt with a unique serial code downloadable in your profile or sent via email.' },
    { question: 'How do I sign up as a volunteer?', answer: 'Visit our Volunteer page, browse open opportunities, select your skills, and submit an application.' },
    { question: 'What is the Needs Board?', answer: 'The Needs Board breaks down every active project into tangible equipment, materials, and supplies so donors and partners can pledge exact physical items or funds directly.' },
  ],
  policies: [
    { title: 'Transparency Policy', content: 'Every dollar received is publicly logged on our Transparency Dashboard alongside verified vendor invoices and expense reports.' },
    { title: 'Data Privacy & Security', content: 'We protect user data with end-to-end encryption and strict compliance standards.' },
    { title: 'Child Protection & Safeguarding', content: 'All volunteers and field staff undergo background checks and safeguarding training prior to working in school or health environments.' },
  ],
  contactEmail: 'contact@vision79.org',
  contactPhone: '+1 (800) 555-V790',
  contactAddress: '79 Innovation Way, Suite 400, Capital District, V79 2026',
};

export const initialCommunityLevels: CommunityLevel[] = [
  { levelNumber: 1, title: 'Community Member', minPoints: 0, maxPoints: 99, color: '#94A3B8', badgeIcon: 'User' },
  { levelNumber: 2, title: 'Community Supporter', minPoints: 100, maxPoints: 299, color: '#38BDF8', badgeIcon: 'Heart' },
  { levelNumber: 3, title: 'Community Champion', minPoints: 300, maxPoints: 699, color: '#A855F7', badgeIcon: 'Award' },
  { levelNumber: 4, title: 'Community Builder', minPoints: 700, maxPoints: 1499, color: '#F27D26', badgeIcon: 'Zap' },
  { levelNumber: 5, title: 'Foundation Ambassador', minPoints: 1500, maxPoints: 999999, color: '#10B981', badgeIcon: 'Crown' },
];

export const initialBadges: Badge[] = [
  { id: 'b_first_step', name: 'First Step', description: 'Completed first verified contribution.', icon: 'Footprints', category: 'contribution' },
  { id: 'b_community_hero', name: 'Community Hero', description: 'Logged over 100 volunteer service hours in field missions.', icon: 'Shield', category: 'volunteering' },
  { id: 'b_project_champion', name: 'Project Champion', description: 'Actively participated in completing a community project.', icon: 'Trophy', category: 'project' },
  { id: 'b_foundation_builder', name: 'Foundation Builder', description: 'Supported 10 or more verified foundation projects.', icon: 'Building2', category: 'project' },
  { id: 'b_early_supporter', name: 'Early Supporter', description: 'Joined and contributed during Foundation launch phase.', icon: 'Sparkles', category: 'special' },
  { id: 'b_community_organizer', name: 'Community Organizer', description: 'Successfully led or co-organized a community initiative.', icon: 'Users', category: 'engagement' },
  { id: 'b_env_champion', name: 'Environmental Champion', description: 'Supported coastal restoration & clean energy projects.', icon: 'TreePine', category: 'project' },
  { id: 'b_edu_advocate', name: 'Education Advocate', description: 'Supported youth literacy, digital labs & STEM programs.', icon: 'GraduationCap', category: 'project' },
  { id: 'b_sports_partner', name: 'Sports Development Partner', description: 'Supported youth athletic facilities and sports drives.', icon: 'Dumbbell', category: 'project' },
  { id: 'b_order_merit', name: 'Order of Merit', description: 'Highest distinction awarded manually by Foundation Board.', icon: 'Medal', category: 'honour', isManualAward: true },
];

export const initialPointRules: PointRule[] = [
  { id: 'pr_1', actionKey: 'first_donation', actionName: 'First Donation', points: 50, category: 'donation', description: 'Awarded upon making your first verified donation' },
  { id: 'pr_2', actionKey: 'donation_over_100', actionName: 'Donation over EC$100', points: 25, category: 'donation', description: 'Awarded for contributions exceeding EC$100' },
  { id: 'pr_3', actionKey: 'recurring_donation', actionName: 'Recurring Monthly Donation', points: 100, category: 'donation', description: 'Awarded when setting up a monthly pledge' },
  { id: 'pr_4', actionKey: 'major_sponsor', actionName: 'Major Project Sponsor', points: 250, category: 'donation', description: 'Awarded for major corporate or individual sponsorships' },
  { id: 'pr_5', actionKey: 'vol_register', actionName: 'Volunteer Registration', points: 20, category: 'volunteering', description: 'Awarded when completing volunteer profile vetting' },
  { id: 'pr_6', actionKey: 'vol_attendance', actionName: 'Volunteer Event Attendance', points: 50, category: 'volunteering', description: 'Awarded for attending a field volunteer event' },
  { id: 'pr_7', actionKey: 'vol_10_hours', actionName: '10 Volunteer Hours Logged', points: 100, category: 'volunteering', description: 'Awarded every 10 logged volunteer hours' },
  { id: 'pr_8', actionKey: 'vol_100_hours', actionName: '100 Volunteer Hours Logged', points: 500, category: 'volunteering', description: 'Major milestone for 100 volunteer hours' },
  { id: 'pr_9', actionKey: 'submit_proposal', actionName: 'Submit Project Proposal', points: 50, category: 'proposal', description: 'Awarded when submitting a detailed community proposal' },
  { id: 'pr_10', actionKey: 'proposal_approved', actionName: 'Proposal Approved for Voting', points: 100, category: 'proposal', description: 'Awarded when proposal passes feasibility review' },
  { id: 'pr_11', actionKey: 'project_completed', actionName: 'Successful Project Completion', points: 250, category: 'proposal', description: 'Awarded when a proposed project reaches 100% completion' },
  { id: 'pr_12', actionKey: 'helpful_comment', actionName: 'Helpful Community Comment', points: 5, category: 'engagement', description: 'Awarded for constructive field updates and discussions' },
  { id: 'pr_13', actionKey: 'positive_feedback', actionName: 'Positive Community Feedback', points: 10, category: 'engagement', description: 'Awarded when community upvotes your comments or updates' },
  { id: 'pr_14', actionKey: 'inkind_item', actionName: 'Provide Needed Goods (In-Kind)', points: 50, category: 'inkind', description: 'Awarded for fulfilling items on the Needs Board' },
  { id: 'pr_15', actionKey: 'large_equipment', actionName: 'Large Equipment Donation', points: 200, category: 'inkind', description: 'Awarded for donating solar pumps, laptops, or heavy tools' },
];

export const initialUserReputations: UserReputation[] = [];

export const initialProjectFeedback: ProjectFeedback[] = [];

export const initialAnnualAwards: AnnualCommunityAward[] = [];

export const initialAuditLogs: AuditLog[] = [];

export const initialNotifications: AppNotification[] = [];

export const initialSponsorshipPackages: SponsorshipPackage[] = [
  {
    id: 'pkg-community',
    tier: 'Community Partner',
    name: 'Community Partner',
    minContribution: 2500,
    contributionRequirements: 'EC$2,500 - EC$4,999 annual contribution or equivalent in-kind goods',
    recognitionBenefits: [
      'Listing on Vision79 Foundation Corporate Partners Web Directory',
      'Digital Community Supporter Badge for company website',
      'Mention in quarterly community newsletter',
    ],
    marketingBenefits: [
      'Permission to use Vision79 Foundation "Community Partner" logo',
      'Social media welcome announcement post',
    ],
    projectAccess: [
      'Invitation to general public project ribbon-cutting ceremonies',
      'Quarterly newsletter project updates',
    ],
    reportingBenefits: [
      'Annual tax-deductible 501(c)(3) contribution receipt',
      'Standard annual impact summary certificate',
    ],
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  },
  {
    id: 'pkg-bronze',
    tier: 'Bronze Sponsor',
    name: 'Bronze Sponsor',
    minContribution: 5000,
    contributionRequirements: 'EC$5,000 - EC$14,999 annual funding or high-value equipment grant',
    recognitionBenefits: [
      'Medium logo placement on Corporate Partners Wall',
      'Bronze Supporter commemorative glass plaque',
      'Press release co-branding mention',
    ],
    marketingBenefits: [
      'Company profile in Vision79 Annual Impact Review',
      '2 social media feature posts per year',
    ],
    projectAccess: [
      'Access to field site visit opportunities for company leadership',
      'Direct co-funding option for specific project needs',
    ],
    reportingBenefits: [
      'Semi-annual financial expenditure breakdown',
      'Verified beneficiary headcount metric statements',
    ],
    badgeColor: 'border-amber-700/40 bg-amber-900/20 text-amber-400',
  },
  {
    id: 'pkg-silver',
    tier: 'Silver Sponsor',
    name: 'Silver Sponsor',
    minContribution: 15000,
    contributionRequirements: 'EC$15,000 - EC$49,999 annual pledge or technical services provision',
    recognitionBenefits: [
      'Prominent logo on Homepage & Project Detail pages',
      'Co-branded field signage at sponsored project sites',
      'Custom silver trophy & framed certificate',
    ],
    marketingBenefits: [
      'Dedicated company spotlight story on Vision79 Blog',
      'Co-branded video clip for internal CSR communications',
    ],
    projectAccess: [
      'Priority employee volunteer field days',
      'Quarterly executive briefing with Vision79 Project Directors',
    ],
    reportingBenefits: [
      'Quarterly trans-audited financial and impact dossier',
      'Customized CSR metrics aligned with UN SDGs',
    ],
    badgeColor: 'border-slate-400/50 bg-slate-800/40 text-slate-200',
  },
  {
    id: 'pkg-gold',
    tier: 'Gold Sponsor',
    name: 'Gold Sponsor',
    minContribution: 50000,
    contributionRequirements: 'EC$50,000 - EC$99,999 annual strategic investment',
    recognitionBenefits: [
      'Header/Hero placement on Vision79 Corporate Portal & Main Site',
      'Permanent plaque on field infrastructure facilities',
      'Annual Community Honors Awards VIP presentation seat',
    ],
    marketingBenefits: [
      'Full media kit & co-branded promotional campaign',
      'Executive interview in regional media publications',
    ],
    projectAccess: [
      'Seat on Community Project Steering Advisory Committee',
      'Tailored employee volunteer immersion program',
    ],
    reportingBenefits: [
      'Monthly real-time financial expenditure ledger access',
      'Custom impact metric reporting',
    ],
    badgeColor: 'border-amber-500/80 bg-amber-950/40 text-amber-300',
  },
  {
    id: 'pkg-platinum',
    tier: 'Platinum Sponsor',
    name: 'Platinum Founding Partner',
    minContribution: 100000,
    contributionRequirements: 'EC$100,000+ multi-year transformational endowment or anchor fund',
    recognitionBenefits: [
      'Title Co-Naming Rights on flagship facilities',
      'Top-tier logo placement across media, signage, and press releases',
      'Custom Founding Partner Award',
    ],
    marketingBenefits: [
      'Dedicated mini-documentary feature film produced by Vision79',
      'Global PR distribution & CSR thought-leadership placement',
    ],
    projectAccess: [
      'Direct co-conception of new community projects from planning phase',
      'Direct access to Board of Directors & Government Liaisons',
    ],
    reportingBenefits: [
      'Dedicated Account Manager & 24/7 audit ledger portal access',
      'Bespoke ESG / CSR Compliance Audit Package for corporate filings',
    ],
    badgeColor: 'border-emerald-500/80 bg-emerald-950/40 text-emerald-300',
  },
];

export const initialCorporateAccounts: CorporateAccount[] = [];

export const initialCorporateReports: CorporateReport[] = [];
