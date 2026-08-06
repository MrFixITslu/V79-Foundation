import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Project, NeedItem, Donation, VolunteerApplication, GalleryMedia, BeneficiaryStory, CMSContent, Sponsor, AppNotification, HeroConfig, ImpactHubConfig, ImpactTimelineEvent, LiveActivityItem, FoundationScorecard, FoundationHealthData, FoundationAnalyticsData, ImpactMetricConfig, UserReputation, LeaderboardEntry, ProjectFeedback, AnnualCommunityAward, CommunityLevel, Badge, PointRule, CorporateAccount, SponsorshipPackage, CorporateReport } from '../types.js';
import { useToast } from './ToastContext.tsx';

export interface ImpactHubPayload {
  config: ImpactHubConfig;
  timelineEvents: ImpactTimelineEvent[];
  liveActivity: LiveActivityItem[];
  scorecard: FoundationScorecard;
  healthData: FoundationHealthData;
  analyticsData: FoundationAnalyticsData;
  calculatedMetrics: (ImpactMetricConfig & { computedValue: number })[];
}

interface TransparencyData {
  totalRaised: number;
  totalSpent: number;
  totalApprovedBudget: number;
  outstandingPledges: number;
  totalBeneficiaries: number;
  totalVolunteerHours: number;
  completedProjectsCount: number;
  activeProjectsCount: number;
  totalProjectsCount: number;
}

interface AppDataContextType {
  projects: Project[];
  needs: NeedItem[];
  donations: Donation[];
  volunteers: VolunteerApplication[];
  sponsors: Sponsor[];
  gallery: GalleryMedia[];
  beneficiaries: BeneficiaryStory[];
  cms: CMSContent | null;
  heroConfig: HeroConfig | null;
  impactHubData: ImpactHubPayload | null;
  transparency: TransparencyData | null;
  notifications: AppNotification[];
  userReputations: UserReputation[];
  currentUserReputation: UserReputation | null;
  leaderboard: LeaderboardEntry[];
  annualAwards: AnnualCommunityAward[];
  reputationConfig: { levels: CommunityLevel[]; badges: Badge[]; pointRules: PointRule[] } | null;
  projectCategories: string[];
  addProjectCategory: (name: string) => Promise<boolean>;
  updateProjectCategory: (oldName: string, newName: string) => Promise<boolean>;
  deleteProjectCategory: (name: string) => Promise<boolean>;
  loading: boolean;
  refreshAll: () => Promise<void>;

  createProject: (p: Partial<Project>) => Promise<boolean>;
  updateProject: (id: string, p: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  cloneProject: (id: string) => Promise<boolean>;
  makeDonation: (data: any) => Promise<boolean>;
  pledgeNeed: (needId: string, quantity: number, name?: string, email?: string) => Promise<boolean>;
  applyVolunteer: (data: any) => Promise<boolean>;
  addExpense: (projectId: string, exp: any) => Promise<boolean>;
  updateExpenseStatus: (projectId: string, expId: string, status: 'Approved' | 'Pending' | 'Flagged') => Promise<boolean>;
  addUpdate: (projectId: string, upd: any) => Promise<boolean>;
  likeUpdate: (updateId: string) => Promise<void>;
  addComment: (updateId: string, text: string, name: string, role: string) => Promise<boolean>;

  // Impact Hub handlers
  updateImpactHubConfig: (cfg: ImpactHubConfig) => Promise<boolean>;
  saveTimelineEvent: (event: Partial<ImpactTimelineEvent>) => Promise<boolean>;
  deleteTimelineEvent: (id: string) => Promise<boolean>;
  updateScorecard: (sc: Partial<FoundationScorecard>) => Promise<boolean>;
  updateHealthData: (hd: Partial<FoundationHealthData>) => Promise<boolean>;
  refreshImpactHub: () => Promise<void>;

  // Feature 16 Reputation & Recognition Handlers
  fetchUserReputation: (userId: string) => Promise<UserReputation | null>;
  fetchLeaderboard: (category?: string) => Promise<LeaderboardEntry[]>;
  fetchProjectFeedback: (projectId: string) => Promise<{ feedback: ProjectFeedback[]; averageRating: number; reviewsCount: number; satisfactionScore: number }>;
  submitProjectFeedback: (data: Partial<ProjectFeedback>) => Promise<boolean>;
  adjustUserPoints: (userId: string, points: number, category: string, reason: string) => Promise<boolean>;
  awardUserBadge: (userId: string, badgeId: string, reason?: string) => Promise<boolean>;
  updatePrivacySettings: (userId: string, settings: { leaderboardVisibility?: string; showDonations?: boolean }) => Promise<boolean>;
  createAnnualAward: (award: Partial<AnnualCommunityAward>) => Promise<boolean>;
  deleteAnnualAward: (id: string) => Promise<boolean>;
  updateReputationConfig: (cfg: { levels?: CommunityLevel[]; badges?: Badge[]; pointRules?: PointRule[] }) => Promise<boolean>;
  refreshReputationData: () => Promise<void>;

  // Feature 18 Corporate Partner Portal Handlers
  corporateAccounts: CorporateAccount[];
  sponsorshipPackages: SponsorshipPackage[];
  activeCorporateAccount: CorporateAccount | null;
  setActiveCorporateAccountId: (id: string) => void;
  registerCorporateAccount: (data: Partial<CorporateAccount>) => Promise<CorporateAccount | null>;
  updateCorporateAccount: (id: string, data: Partial<CorporateAccount>) => Promise<boolean>;
  verifyCorporateAccount: (id: string, status: 'Verified' | 'Pending Verification' | 'Rejected') => Promise<boolean>;
  sponsorProjectAsCorporate: (companyId: string, projectId: string, amount: number, notes?: string) => Promise<boolean>;
  fetchProjectMatches: (companyId: string) => Promise<any[]>;
  generateCorporateReport: (companyId: string, title?: string, reportType?: string, period?: string) => Promise<CorporateReport | null>;
  refreshCorporateData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType>({} as any);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [needs, setNeeds] = useState<NeedItem[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [gallery, setGallery] = useState<GalleryMedia[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryStory[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
  const [impactHubData, setImpactHubData] = useState<ImpactHubPayload | null>(null);
  const [transparency, setTransparency] = useState<TransparencyData | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [userReputations, setUserReputations] = useState<UserReputation[]>([]);
  const [currentUserReputation, setCurrentUserReputation] = useState<UserReputation | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [annualAwards, setAnnualAwards] = useState<AnnualCommunityAward[]>([]);
  const [reputationConfig, setReputationConfig] = useState<{ levels: CommunityLevel[]; badges: Badge[]; pointRules: PointRule[] } | null>(null);
  const [projectCategories, setProjectCategories] = useState<string[]>([]);
  const [corporateAccounts, setCorporateAccounts] = useState<CorporateAccount[]>([]);
  const [sponsorshipPackages, setSponsorshipPackages] = useState<SponsorshipPackage[]>([]);
  const [activeCorporateAccountId, setActiveCorporateAccountIdState] = useState<string>('corp-1');
  const [activeCorporateAccount, setActiveCorporateAccount] = useState<CorporateAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshCorporateData = useCallback(async () => {
    try {
      const [accsRes, pkgsRes] = await Promise.all([
        fetch('/api/corporate/accounts'),
        fetch('/api/corporate/packages'),
      ]);
      let loadedAccounts: CorporateAccount[] = [];
      if (accsRes.ok) {
        const accs = await accsRes.json();
        setCorporateAccounts(accs);
        loadedAccounts = accs;
      }
      if (pkgsRes.ok) {
        setSponsorshipPackages(await pkgsRes.json());
      }
      if (loadedAccounts.length > 0) {
        const found = loadedAccounts.find((a) => a.id === activeCorporateAccountId) || loadedAccounts[0];
        setActiveCorporateAccount(found);
      } else {
        setActiveCorporateAccount(null);
      }
    } catch (e) {
      console.error('Failed to fetch corporate data', e);
    }
  }, [activeCorporateAccountId]);

  const setActiveCorporateAccountId = useCallback((id: string) => {
    setActiveCorporateAccountIdState(id);
  }, []);

  useEffect(() => {
    if (corporateAccounts.length > 0) {
      const found = corporateAccounts.find((a) => a.id === activeCorporateAccountId) || corporateAccounts[0];
      setActiveCorporateAccount(found);
    }
  }, [activeCorporateAccountId, corporateAccounts]);

  const refreshReputationData = useCallback(async () => {
    try {
      const [uRes, lRes, aRes, cRes] = await Promise.all([
        fetch('/api/reputation/users'),
        fetch('/api/reputation/leaderboard'),
        fetch('/api/awards'),
        fetch('/api/reputation/config'),
      ]);

      if (uRes.ok) {
        const uData = await uRes.json();
        setUserReputations(uData);
        if (uData.length > 0) {
          // Default to Neil .V or first verified user
          const defaultUser = uData.find((r: UserReputation) => r.userName.includes('Neil')) || uData[0];
          setCurrentUserReputation(defaultUser);
        }
      }
      if (lRes.ok) setLeaderboard(await lRes.json());
      if (aRes.ok) setAnnualAwards(await aRes.json());
      if (cRes.ok) setReputationConfig(await cRes.json());
    } catch (e) {
      console.error('Failed to fetch reputation data', e);
    }
  }, []);

  const refreshImpactHub = useCallback(async () => {
    try {
      const res = await fetch('/api/impact-hub');
      if (res.ok) {
        const data = await res.json();
        setImpactHubData(data);
      }
    } catch (e) {
      console.error('Failed to fetch impact hub data', e);
    }
  }, []);

  const addProjectCategory = useCallback(async (name: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjectCategories(data.categories);
        showToast('Project category added successfully!', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to add category', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to add category', 'error');
      return false;
    }
  }, [showToast]);

  const updateProjectCategory = useCallback(async (oldName: string, newName: string) => {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjectCategories(data.categories);
        await refreshAll();
        showToast('Project category updated successfully!', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to update category', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to update category', 'error');
      return false;
    }
  }, [showToast]);

  const deleteProjectCategory = useCallback(async (name: string) => {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setProjectCategories(data.categories);
        showToast('Project category deleted successfully!', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to delete category', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to delete category', 'error');
      return false;
    }
  }, [showToast]);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [pRes, nRes, dRes, vRes, sRes, gRes, bRes, cRes, hRes, tRes, notifRes, hubRes, catRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/needs'),
        fetch('/api/donations'),
        fetch('/api/volunteers'),
        fetch('/api/sponsors'),
        fetch('/api/gallery'),
        fetch('/api/beneficiaries'),
        fetch('/api/cms'),
        fetch('/api/hero'),
        fetch('/api/transparency'),
        fetch('/api/notifications'),
        fetch('/api/impact-hub'),
        fetch('/api/categories'),
      ]);

      if (pRes.ok) setProjects(await pRes.json());
      if (nRes.ok) setNeeds(await nRes.json());
      if (dRes.ok) setDonations(await dRes.json());
      if (vRes.ok) setVolunteers(await vRes.json());
      if (sRes.ok) setSponsors(await sRes.json());
      if (gRes.ok) setGallery(await gRes.json());
      if (bRes.ok) setBeneficiaries(await bRes.json());
      if (cRes.ok) setCms(await cRes.json());
      if (hRes.ok) setHeroConfig(await hRes.json());
      if (tRes.ok) setTransparency(await tRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
      if (hubRes.ok) setImpactHubData(await hubRes.json());
      if (catRes.ok) setProjectCategories(await catRes.json());
      await refreshReputationData();
      await refreshCorporateData();
    } catch (err) {
      console.error('Error refreshing app data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Set up auto-polling interval for Live Dashboard updates
  useEffect(() => {
    const intervalSec = impactHubData?.config?.refreshIntervalSeconds || 10;
    const timer = setInterval(() => {
      refreshImpactHub();
    }, Math.max(5, intervalSec) * 1000);
    return () => clearInterval(timer);
  }, [impactHubData?.config?.refreshIntervalSeconds, refreshImpactHub]);


  const createProject = async (p: Partial<Project>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        showToast('Project created successfully!', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to create project', 'error');
    return false;
  };

  const updateProject = async (id: string, p: Partial<Project>) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        showToast('Project updated!', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to update project', 'error');
    return false;
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Project deleted', 'info');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to delete project', 'error');
    return false;
  };

  const cloneProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}/clone`, { method: 'POST' });
      if (res.ok) {
        showToast('Project cloned as Draft!', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to clone project', 'error');
    return false;
  };

  const makeDonation = async (data: any) => {
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('Thank you for your generous contribution!', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Donation failed', 'error');
    return false;
  };

  const pledgeNeed = async (needId: string, quantity: number, name?: string, email?: string) => {
    try {
      const res = await fetch('/api/needs/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ needId, pledgeQuantity: quantity, pledgerName: name, pledgerEmail: email }),
      });
      if (res.ok) {
        showToast('Need item pledged successfully!', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Pledge failed', 'error');
    return false;
  };

  const applyVolunteer = async (data: any) => {
    try {
      const res = await fetch('/api/volunteers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('Volunteer application submitted!', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Volunteer application failed', 'error');
    return false;
  };

  const addExpense = async (projectId: string, exp: any) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      });
      if (res.ok) {
        showToast('Expense added and logged', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to add expense', 'error');
    return false;
  };

  const updateExpenseStatus = async (projectId: string, expId: string, status: 'Approved' | 'Pending' | 'Flagged') => {
    try {
      const res = await fetch(`/api/projects/${projectId}/expenses/${expId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Expense updated to ${status}`, 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to update expense status', 'error');
    return false;
  };

  const addUpdate = async (projectId: string, upd: any) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upd),
      });
      if (res.ok) {
        showToast('Timeline update posted!', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to post update', 'error');
    return false;
  };

  const likeUpdate = async (updateId: string) => {
    try {
      await fetch(`/api/updates/${updateId}/like`, { method: 'POST' });
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (updateId: string, text: string, name: string, role: string) => {
    try {
      const res = await fetch(`/api/updates/${updateId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, userName: name, userRole: role }),
      });
      if (res.ok) {
        showToast('Comment posted', 'success');
        await refreshAll();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    showToast('Failed to add comment', 'error');
    return false;
  };

  const updateImpactHubConfig = async (cfg: ImpactHubConfig) => {
    try {
      const res = await fetch('/api/impact-hub/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (res.ok) {
        showToast('Impact Hub settings saved!', 'success');
        await refreshImpactHub();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to update Impact Hub settings', 'error');
    return false;
  };

  const saveTimelineEvent = async (event: Partial<ImpactTimelineEvent>) => {
    try {
      const res = await fetch('/api/impact-hub/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (res.ok) {
        showToast('Timeline event saved!', 'success');
        await refreshImpactHub();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to save timeline event', 'error');
    return false;
  };

  const deleteTimelineEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/impact-hub/timeline/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Timeline event removed', 'success');
        await refreshImpactHub();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to delete timeline event', 'error');
    return false;
  };

  const updateScorecard = async (sc: Partial<FoundationScorecard>) => {
    try {
      const res = await fetch('/api/impact-hub/scorecard', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sc),
      });
      if (res.ok) {
        showToast('Scorecard KPIs updated', 'success');
        await refreshImpactHub();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to update scorecard', 'error');
    return false;
  };

  const updateHealthData = async (hd: Partial<FoundationHealthData>) => {
    try {
      const res = await fetch('/api/impact-hub/health', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hd),
      });
      if (res.ok) {
        showToast('Foundation health scores updated', 'success');
        await refreshImpactHub();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to update health scores', 'error');
    return false;
  };

  // Feature 16 Handlers
  const fetchUserReputation = async (userId: string): Promise<UserReputation | null> => {
    try {
      const res = await fetch(`/api/reputation/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        return data.reputation;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const fetchLeaderboard = async (category = 'score'): Promise<LeaderboardEntry[]> => {
    try {
      const res = await fetch(`/api/reputation/leaderboard?category=${category}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const fetchProjectFeedback = async (projectId: string) => {
    try {
      const res = await fetch(`/api/feedback/project/${projectId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    return { feedback: [], averageRating: 0, reviewsCount: 0, satisfactionScore: 100 };
  };

  const submitProjectFeedback = async (data: Partial<ProjectFeedback>): Promise<boolean> => {
    try {
      const res = await fetch('/api/feedback/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('Community feedback submitted (+10 Points Earned!)', 'success');
        await refreshReputationData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to submit feedback', 'error');
    return false;
  };

  const adjustUserPoints = async (userId: string, points: number, category: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/reputation/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points, category, reason }),
      });
      if (res.ok) {
        showToast(`Points adjusted (${points > 0 ? '+' : ''}${points} pts)`, 'success');
        await refreshReputationData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to adjust user points', 'error');
    return false;
  };

  const awardUserBadge = async (userId: string, badgeId: string, reason?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/reputation/award-badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, badgeId, reason }),
      });
      if (res.ok) {
        showToast('Achievement badge awarded successfully!', 'success');
        await refreshReputationData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to award badge', 'error');
    return false;
  };

  const updatePrivacySettings = async (userId: string, settings: { leaderboardVisibility?: string; showDonations?: boolean }): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${userId}/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Privacy preferences saved', 'success');
        await refreshReputationData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to update privacy settings', 'error');
    return false;
  };

  const createAnnualAward = async (award: Partial<AnnualCommunityAward>): Promise<boolean> => {
    try {
      const res = await fetch('/api/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(award),
      });
      if (res.ok) {
        showToast('Annual Award created and published!', 'success');
        await refreshReputationData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to create award', 'error');
    return false;
  };

  const deleteAnnualAward = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/awards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Award removed', 'info');
        await refreshReputationData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to remove award', 'error');
    return false;
  };

  const updateReputationConfig = async (cfg: { levels?: CommunityLevel[]; badges?: Badge[]; pointRules?: PointRule[] }): Promise<boolean> => {
    try {
      const res = await fetch('/api/reputation/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (res.ok) {
        showToast('Reputation configuration saved', 'success');
        await refreshReputationData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to update config', 'error');
    return false;
  };

  const registerCorporateAccount = async (data: Partial<CorporateAccount>): Promise<CorporateAccount | null> => {
    try {
      const res = await fetch('/api/corporate/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newAcc = await res.json();
        showToast('Corporate registration submitted successfully!', 'success');
        setActiveCorporateAccountIdState(newAcc.id);
        await refreshCorporateData();
        await refreshAll();
        return newAcc;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to register corporate partner', 'error');
    return null;
  };

  const updateCorporateAccount = async (id: string, data: Partial<CorporateAccount>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/corporate/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('Corporate profile updated', 'success');
        await refreshCorporateData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to update corporate profile', 'error');
    return false;
  };

  const verifyCorporateAccount = async (id: string, status: 'Verified' | 'Pending Verification' | 'Rejected'): Promise<boolean> => {
    try {
      const res = await fetch(`/api/corporate/accounts/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Partner status updated to: ${status}`, 'info');
        await refreshCorporateData();
        await refreshAll();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to update verification status', 'error');
    return false;
  };

  const sponsorProjectAsCorporate = async (companyId: string, projectId: string, amount: number, notes?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/corporate/sponsor-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, projectId, amount, notes }),
      });
      if (res.ok) {
        showToast(`Thank you! EC$${amount.toLocaleString()} corporate sponsorship received!`, 'success');
        await refreshCorporateData();
        await refreshAll();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Sponsorship submission failed', 'error');
    return false;
  };

  const fetchProjectMatches = async (companyId: string): Promise<any[]> => {
    try {
      const res = await fetch(`/api/corporate/matching/${companyId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const generateCorporateReport = async (companyId: string, title?: string, reportType?: string, period?: string): Promise<CorporateReport | null> => {
    try {
      const res = await fetch('/api/corporate/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, title, reportType, period }),
      });
      if (res.ok) {
        showToast('Corporate Report generated and saved!', 'success');
        await refreshCorporateData();
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Failed to generate report', 'error');
    return null;
  };

  return (
    <AppDataContext.Provider
      value={{
        projects,
        needs,
        donations,
        volunteers,
        sponsors,
        gallery,
        beneficiaries,
        cms,
        heroConfig,
        impactHubData,
        transparency,
        notifications,
        userReputations,
        currentUserReputation,
        leaderboard,
        annualAwards,
        reputationConfig,
        corporateAccounts,
        sponsorshipPackages,
        activeCorporateAccount,
        setActiveCorporateAccountId,
        registerCorporateAccount,
        updateCorporateAccount,
        verifyCorporateAccount,
        sponsorProjectAsCorporate,
        fetchProjectMatches,
        generateCorporateReport,
        refreshCorporateData,
        loading,
        refreshAll,
        createProject,
        updateProject,
        deleteProject,
        cloneProject,
        makeDonation,
        pledgeNeed,
        applyVolunteer,
        addExpense,
        updateExpenseStatus,
        addUpdate,
        likeUpdate,
        addComment,
        updateImpactHubConfig,
        saveTimelineEvent,
        deleteTimelineEvent,
        updateScorecard,
        updateHealthData,
        refreshImpactHub,
        fetchUserReputation,
        fetchLeaderboard,
        fetchProjectFeedback,
        submitProjectFeedback,
        adjustUserPoints,
        awardUserBadge,
        updatePrivacySettings,
        createAnnualAward,
        deleteAnnualAward,
        updateReputationConfig,
        refreshReputationData,
        projectCategories,
        addProjectCategory,
        updateProjectCategory,
        deleteProjectCategory,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);

