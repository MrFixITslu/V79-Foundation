export type Role = 'guest' | 'donor' | 'volunteer' | 'sponsor' | 'beneficiary' | 'admin';

export type ProjectStatus = 'Planning' | 'Fundraising' | 'Active' | 'Completed' | 'Cancelled';

export type SponsorTier = 'Community Partner' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Bronze Sponsor' | 'Silver Sponsor' | 'Gold Sponsor' | 'Platinum Sponsor';

export interface CorporateDocument {
  id: string;
  title: string;
  type: 'Tax Certificate 501c3' | 'MoU Agreement' | 'Impact Report' | 'Receipt' | 'Audit Report';
  date: string;
  size: string;
  receiptNumber?: string;
  url?: string;
}

export interface CorporateBenefit {
  key: string;
  name: string;
  category: 'Recognition' | 'Marketing' | 'Project Access' | 'Reporting';
  status: 'Active' | 'Delivered' | 'Pending' | 'Scheduled';
  details: string;
}

export interface SponsoredProjectRef {
  projectId: string;
  projectName: string;
  amountContributed: number;
  date: string;
  impactMetricText?: string;
  status?: string;
}

export interface CorporateAccount {
  id: string;
  companyName: string;
  businessRegistrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  industry: string;
  logo: string;
  companyDescription: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected';
  tier: SponsorTier;
  corporateInterests: string[];
  budgetMin: number;
  budgetMax: number;
  totalContributed: number;
  joinedDate: string;
  sponsoredProjects: SponsoredProjectRef[];
  documents: CorporateDocument[];
  benefits: CorporateBenefit[];
}

export interface SponsorshipPackage {
  id: string;
  tier: 'Community Partner' | 'Bronze Sponsor' | 'Silver Sponsor' | 'Gold Sponsor' | 'Platinum Sponsor';
  name: string;
  minContribution: number;
  contributionRequirements: string;
  recognitionBenefits: string[];
  marketingBenefits: string[];
  projectAccess: string[];
  reportingBenefits: string[];
  badgeColor: string;
}

export interface CorporateReport {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  reportType: 'Sponsorship Report' | 'Impact Report' | 'Contribution Report' | 'CSR Compliance Report';
  period: string;
  generatedDate: string;
  totalContribution: number;
  projectsCount: number;
  beneficiariesReached: number;
  summary: string;
  executiveKeyTakeaways?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  volunteerHours?: number;
  badges?: string[];
  verified?: boolean;
  createdAt: string;
  // Security Hardening fields
  passwordHash?: string;
  failedLoginAttempts?: number;
  lockoutUntil?: string;
  passwordHistory?: string[];
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

export interface NeedItem {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  category: string;
  quantityNeeded: number;
  quantityPledged: number;
  quantityReceived: number;
  unit: string; // e.g. "laptops", "bags", "books", "hours", "sets"
  estimatedCostPerUnit: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'Planned' | 'Funded' | 'In Progress' | 'Completed' | 'Impact Review';
}

export interface ExpenseItem {
  id: string;
  projectId: string;
  category: string;
  description: string;
  approvedBudget: number;
  actualSpent: number;
  vendor?: string;
  receiptUrl?: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Flagged';
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  title: string;
  content: string;
  mediaUrls?: string[];
  videoUrl?: string;
  date: string;
  isPinned?: boolean;
  likesCount: number;
  comments: ProjectComment[];
}

export interface ProjectComment {
  id: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  content: string;
  date: string;
}

export interface EvaluationCategoryScore {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number;
  notes?: string;
}

export interface FeasibilityAssessment {
  overallScore: number; // 0 - 100
  readinessLabel: string; // e.g. "92% Ready"
  categories: EvaluationCategoryScore[];
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  evaluatedAt: string;
  aiPowered: boolean;
  minimumWarning: boolean;
}

export interface CommunityVotes {
  upvotes: number;
  downvotes: number;
  votedUsers?: Record<string, 'up' | 'down'>;
}

export interface FeasibilitySettings {
  minScoreWarningThreshold: number; // default 70
  weights: Record<string, number>;
  enabledCategories: Record<string, boolean>;
  scoringThresholds: { high: number; medium: number; low: number };
  enableAIRecommendations: boolean;
}

export interface FeasibilityAnalyticsData {
  averageProposalScore: number;
  highestScoringProjects: { id: string; title: string; score: number; status: string }[];
  lowestScoringProjects: { id: string; title: string; score: number; status: string }[];
  averageFundingSuccessByScore: { tier: string; successRate: number; avgFundingPercent: number }[];
  averageCompletionRateByScore: { tier: string; completionRate: number }[];
  feasibilityDeliveryCorrelation: { scoreRange: string; onTimeDeliveryRate: number; budgetAdherenceRate: number }[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string; // Education, Healthcare, Water & Sanitation, Environment, Community Care
  tags: string[];
  location: {
    city: string;
    region: string;
    lat: number;
    lng: number;
  };
  coverImage: string;
  galleryImages: string[];
  documents?: { name: string; url: string; size: string }[];
  targetAmount: number;
  raisedAmount: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  team: { name: string; role: string; avatar: string }[];
  needs: NeedItem[];
  milestones: Milestone[];
  expenses: ExpenseItem[];
  updates: ProjectUpdate[];
  beneficiariesCount: number;
  impactSummary: string;
  featured?: boolean;
  followersCount: number;
  feasibilityAssessment?: FeasibilityAssessment;
  communityVotes?: CommunityVotes;
  estimatedVolunteerHours?: number;
  estimatedImpactRating?: string;
  fundingConfidenceRating?: number;
}

export interface Donation {
  id: string;
  projectId?: string;
  projectName?: string;
  donorName: string;
  donorEmail: string;
  donorRole?: Role;
  amount: number;
  type: 'Cash' | 'In-Kind' | 'Corporate' | 'Recurring';
  inKindDescription?: string;
  isAnonymous: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually';
  date: string;
  receiptNumber: string;
  status: 'Completed' | 'Pending' | 'Failed';
  txHash?: string;
  prevTxHash?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  tier: SponsorTier;
  totalContributed: number;
  sponsoredProjectIds: string[];
  joinedDate: string;
  taxReceiptsCount: number;
}

export interface VolunteerApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  projectId: string;
  projectName: string;
  skills: string[];
  availability: string;
  emergencyContact: { name: string; phone: string; relation: string };
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  loggedHours: number;
  attendanceQrToken?: string;
}

export interface GalleryMedia {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  caption: string;
  type: 'image' | 'video' | 'before_after';
  url: string;
  beforeUrl?: string;
  afterUrl?: string;
  album: string;
  tags: string[];
  date: string;
}

export interface BeneficiaryStory {
  id: string;
  projectId: string;
  projectName: string;
  beneficiaryName: string;
  photoUrl: string;
  quote: string;
  fullStory: string;
  location: string;
  date: string;
}

export interface CMSContent {
  aboutMission: string;
  aboutVision: string;
  aboutHistory: string;
  faqList: { question: string; answer: string }[];
  policies: { title: string; content: string }[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'donation' | 'project' | 'volunteer' | 'admin' | 'system';
  date: string;
  read: boolean;
  link?: string;
}

export interface HeroStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface HeroSlide {
  id: string;
  title: string; // Slide internal title/name
  headline: string;
  subheading: string;
  missionStatement: string;
  mediaType: 'video' | 'image' | 'animated';
  videoUrl?: string;
  imageUrl?: string;
  posterImage?: string;
  fallbackImage?: string;
  primaryCtaText: string;
  primaryCtaAction: 'donate' | 'projects' | 'volunteer' | 'transparency' | 'suggest';
  secondaryCtaText: string;
  secondaryCtaAction: 'donate' | 'projects' | 'volunteer' | 'transparency' | 'suggest';
  overlayOpacity: number; // 0 - 100
  overlayGradient: 'dark' | 'brand' | 'radial' | 'minimal';
  stats: HeroStat[];
  enabled: boolean;
  campaignType?: 'standard' | 'seasonal' | 'emergency' | 'event';
  eventCountdownDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  seoHeading?: string;
  seoMetaDescription?: string;
  socialShareImage?: string;
}

export interface HeroConfig {
  activeSlideId: string;
  autoRotate: boolean;
  rotateIntervalSeconds: number;
  reducedMotion: boolean;
  slides: HeroSlide[];
}

export interface ImpactMetricConfig {
  id: string;
  label: string;
  value: number;
  customValue?: number;
  prefix?: string;
  suffix?: string;
  enabled: boolean;
  order: number;
  category: 'community' | 'projects' | 'volunteers' | 'financial' | 'social_environmental';
}

export interface ImpactTimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'project_started' | 'project_completed' | 'milestone' | 'funding_goal' | 'volunteer_event' | 'celebration' | 'award' | 'media';
  projectId?: string;
  imageUrl?: string;
  linkUrl?: string;
}

export interface LiveActivityItem {
  id: string;
  timestamp: string;
  actorName: string;
  actionText: string;
  type: 'donation' | 'pledge' | 'sponsor' | 'funding_milestone' | 'project_completed' | 'volunteer_signup' | 'vote';
  isAnonymous?: boolean;
  amount?: number;
  projectId?: string;
}

export interface FoundationScorecard {
  projectsOnTimePct: number;
  budgetPerformancePct: number;
  volunteerSatisfactionRating: number;
  communitySatisfactionRating: number;
  fundingSuccessRatePct: number;
  proposalApprovalRatePct: number;
  avgProjectDurationDays: number;
  avgCommunityRating: number;
  trends: { metric: string; direction: 'up' | 'down' | 'stable'; changePct: number }[];
}

export interface FoundationHealthData {
  financialHealthScore: number;
  volunteerCapacityScore: number;
  projectCompletionScore: number;
  fundingPipelineScore: number;
  sponsorEngagementScore: number;
  communityParticipationScore: number;
  overallHealthScore: number;
  publicVisibility: boolean;
}

export interface PinnedAnnouncement {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'urgent' | 'event';
  link?: string;
  active: boolean;
}

export interface ImpactHubConfig {
  pinnedAnnouncement?: PinnedAnnouncement;
  featuredProjectId?: string; // Admin manual override
  refreshIntervalSeconds: number;
  metricsConfig: ImpactMetricConfig[];
  widgetsOrder: string[];
  publicStatsEnabled: boolean;
  healthScorePublic: boolean;
}

export interface FoundationAnalyticsData {
  homepageViews: number;
  mostViewedProjects: { projectId: string; title: string; views: number }[];
  donationConversionRate: number;
  volunteerConversionRate: number;
  proposalSubmissionsThisMonth: number;
  votingParticipationCount: number;
  returningVisitorsPct: number;
  sponsorEngagementRate: number;
  monthlyDonationTrend: { month: string; amount: number }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name or emoji
  category: 'contribution' | 'volunteering' | 'project' | 'engagement' | 'honour' | 'special';
  isManualAward?: boolean;
  unlockedAt?: string;
}

export interface CommunityLevel {
  levelNumber: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  badgeIcon: string;
}

export interface UserReputation {
  userId: string;
  userName: string;
  userEmail: string;
  avatar?: string;
  role: Role;
  verified: boolean;
  score: number;
  levelNumber: number;
  levelTitle: string;
  badges: Badge[];
  trustIndicators: string[]; // e.g. ["Verified Member", "Long-Time Contributor", "Community Volunteer", "Project Contributor", "Foundation Partner"]
  projectsSupportedCount: number;
  volunteerHours: number;
  totalDonatedEC: number;
  projectsProposedCount: number;
  completedContributionsCount: number;
  privacySettings: {
    leaderboardVisibility: 'public' | 'anonymous' | 'hidden';
    showDonations: boolean;
  };
  createdAt: string;
}

export interface ReputationPointLog {
  id: string;
  userId: string;
  userName: string;
  points: number; // positive or negative
  category: 'donation' | 'volunteering' | 'proposal' | 'engagement' | 'inkind' | 'admin_adjust' | 'penalty' | 'decay';
  reason: string;
  timestamp: string;
}

export interface PointRule {
  id: string;
  actionKey: string;
  actionName: string;
  points: number;
  category: 'donation' | 'volunteering' | 'proposal' | 'engagement' | 'inkind' | 'penalty';
  description: string;
}

export interface ProjectFeedback {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevelTitle: string;
  ratings: {
    impact: number; // 1-5
    communication: number; // 1-5
    transparency: number; // 1-5
    execution: number; // 1-5
    communityBenefit: number; // 1-5
  };
  overallScore: number;
  comment: string;
  createdAt: string;
}

export interface AnnualCommunityAward {
  id: string;
  year: number;
  category: 'Volunteer of the Year' | 'Community Champion' | 'Youth Leader' | 'Corporate Partner of the Year' | 'Most Impactful Project' | 'Innovation Award' | string;
  winnerName: string;
  winnerUserId?: string;
  winnerRoleOrOrg?: string;
  winnerAvatar?: string;
  projectTitle?: string;
  description: string;
  quote?: string;
  dateAwarded: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar?: string;
  verified: boolean;
  score: number;
  levelTitle: string;
  levelNumber: number;
  value: number; // metric value e.g. volunteer hours, total donated, score
  rank: number;
  badgesCount: number;
  badgeIcons: string[];
}

export interface FFPro2SyncRecord {
  id: string;
  projectId: string;
  projectName: string;
  lastSyncedAt: string;
  status: 'synced' | 'failed' | 'pending';
  errorMessage?: string;
  externalProjectId: string;
  tasksSyncedCount: number;
  milestonesSyncedCount: number;
  retryAttempts: number;
  auditLogId?: string;
}



