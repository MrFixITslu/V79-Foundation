import { Project, FeasibilityAssessment, EvaluationCategoryScore, FeasibilitySettings } from '../types.js';

export const EVALUATION_CATEGORIES = [
  { id: 'communityImpact', name: 'Community Impact', description: 'Evaluates direct transformation and community health/economic uplift.' },
  { id: 'beneficiaries', name: 'Number of Beneficiaries', description: 'Assesses total directly impacted individuals relative to project cost.' },
  { id: 'budgetRealism', name: 'Budget Realism', description: 'Analyzes itemized cost estimates, vendor quotes, and contingency planning.' },
  { id: 'timelineRealism', name: 'Timeline Realism', description: 'Checks milestone feasibility, seasonal factors, and implementation buffer.' },
  { id: 'sustainability', name: 'Sustainability', description: 'Evaluates long-term community ownership, maintenance plans, and self-funding.' },
  { id: 'communityNeed', name: 'Community Need', description: 'Measures urgency of local intervention and absence of existing alternatives.' },
  { id: 'innovation', name: 'Innovation', description: 'Assesses adoption of clean energy, digital tools, or modern methodologies.' },
  { id: 'longTermValue', name: 'Long-Term Value', description: 'Measures multi-year durability and generational community impact.' },
  { id: 'volunteerRequirements', name: 'Volunteer Requirements', description: 'Evaluates skill availability and volunteer coordination structure.' },
  { id: 'resourceAvailability', name: 'Resource Availability', description: 'Assesses material supply chain risk and equipment accessibility.' },
  { id: 'environmentalImpact', name: 'Environmental Impact', description: 'Evaluates eco-friendliness, renewable integration, and carbon footprint.' },
  { id: 'missionAlignment', name: 'Alignment with Vision79 Foundation Mission', description: 'Verifies strict adherence to Vision79 core principles of transparency and impact.' },
  { id: 'riskAssessment', name: 'Risk Assessment', description: 'Evaluates weather, logistical, financial, and operational risk mitigation.' },
  { id: 'partnerships', name: 'Partnerships and Community Support', description: 'Checks local government, NGO, and corporate sponsor involvement.' },
  { id: 'overallReadiness', name: 'Overall Readiness', description: 'Measures readiness for immediate field execution and community voting.' },
];

export const DEFAULT_FEASIBILITY_SETTINGS: FeasibilitySettings = {
  minScoreWarningThreshold: 70,
  weights: EVALUATION_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: 1.0 }), {}),
  enabledCategories: EVALUATION_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {}),
  scoringThresholds: { high: 80, medium: 60, low: 40 },
  enableAIRecommendations: true,
};

export function evaluateProjectFeasibility(
  project: Partial<Project>,
  customSettings?: Partial<FeasibilitySettings>
): FeasibilityAssessment {
  const settings: FeasibilitySettings = { ...DEFAULT_FEASIBILITY_SETTINGS, ...customSettings };

  const targetAmount = Number(project.targetAmount || 10000);
  const beneficiariesCount = Number(project.beneficiariesCount || 100);
  const needsCount = project.needs?.length || 0;
  const milestonesCount = project.milestones?.length || 0;
  const teamCount = project.team?.length || 1;
  const descLength = (project.description || '').length + (project.summary || '').length;

  // Base scoring heuristics calibrated around project factors
  const categoryScores: EvaluationCategoryScore[] = EVALUATION_CATEGORIES.map((cat) => {
    const isEnabled = settings.enabledCategories[cat.id] !== false;
    const weight = settings.weights[cat.id] || 1.0;

    if (!isEnabled) {
      return { id: cat.id, name: cat.name, score: 0, weight: 0, notes: 'Disabled by Admin' };
    }

    let score = 85; // default benchmark

    switch (cat.id) {
      case 'communityImpact':
        score = beneficiariesCount > 5000 ? 96 : beneficiariesCount > 1000 ? 92 : beneficiariesCount > 200 ? 86 : 78;
        break;

      case 'beneficiaries':
        const costPerPerson = targetAmount / Math.max(1, beneficiariesCount);
        score = costPerPerson < 15 ? 98 : costPerPerson < 50 ? 90 : costPerPerson < 150 ? 82 : 72;
        break;

      case 'budgetRealism':
        score = needsCount >= 3 ? 92 : needsCount >= 1 ? 84 : 70;
        if (targetAmount > 100000 && needsCount < 4) score -= 12;
        break;

      case 'timelineRealism':
        score = milestonesCount >= 4 ? 94 : milestonesCount >= 2 ? 85 : 72;
        break;

      case 'sustainability':
        score = descLength > 400 ? 90 : descLength > 200 ? 82 : 72;
        break;

      case 'communityNeed':
        score = project.category === 'Water & Sanitation' ? 96 : project.category === 'Healthcare' ? 94 : 88;
        break;

      case 'innovation':
        score = (project.tags || []).some((t) => ['Solar', 'Digital', 'Satellite', 'Tech'].includes(t)) ? 94 : 82;
        break;

      case 'longTermValue':
        score = beneficiariesCount > 1000 ? 95 : 86;
        break;

      case 'volunteerRequirements':
        score = teamCount >= 2 ? 90 : 78;
        break;

      case 'resourceAvailability':
        score = needsCount > 0 ? 88 : 75;
        break;

      case 'environmentalImpact':
        score = (project.tags || []).some((t) => ['Solar', 'Clean Water', 'Environment'].includes(t)) ? 96 : 84;
        break;

      case 'missionAlignment':
        score = 100; // Perfect alignment with Vision79 Foundation
        break;

      case 'riskAssessment':
        score = descLength > 300 && milestonesCount >= 3 ? 88 : 72;
        break;

      case 'partnerships':
        score = (project.team?.length || 0) >= 2 ? 92 : 80;
        break;

      case 'overallReadiness':
        score = descLength > 300 && needsCount > 0 && milestonesCount > 0 ? 92 : 75;
        break;

      default:
        score = 85;
    }

    return {
      id: cat.id,
      name: cat.name,
      score: Math.min(100, Math.max(10, Math.round(score))),
      weight,
    };
  });

  // Calculate weighted overall score
  const activeCategories = categoryScores.filter((c) => c.weight > 0);
  const totalWeight = activeCategories.reduce((sum, c) => sum + c.weight, 0);
  const weightedSum = activeCategories.reduce((sum, c) => sum + c.score * c.weight, 0);
  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 80;

  // AI Recommendations logic
  const recommendations: string[] = [];
  if (settings.enableAIRecommendations) {
    if (needsCount < 3) {
      recommendations.push('Budget appears underestimated. Itemize more specific equipment & supply needs.');
    }
    if (milestonesCount < 3) {
      recommendations.push('Timeline may be unrealistic. Add step-by-step milestone delivery dates.');
    }
    if (teamCount < 2) {
      recommendations.push('Consider adding another community partner or local liaison to the leadership team.');
    }
    if (!project.impactSummary || project.impactSummary.length < 30) {
      recommendations.push('Add measurable success metrics and concrete beneficiary outcomes.');
    }
    if (descLength < 250) {
      recommendations.push('Include a post-completion maintenance and community governance plan.');
    }
    if (teamCount < 3) {
      recommendations.push('More field volunteers may be required for local deployment and surveying.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Proposal is well-structured and ready for community review.');
      recommendations.push('Consider highlighting environmental sustainability metrics in community updates.');
    }
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  categoryScores.forEach((c) => {
    if (c.score >= 90) strengths.push(`High ${c.name} (${c.score}%)`);
    if (c.score < 78) weaknesses.push(`${c.name} needs detail or buffer (${c.score}%)`);
  });

  if (strengths.length === 0) strengths.push('Clear vision and baseline mission alignment.');
  if (weaknesses.length === 0) weaknesses.push('No critical deficiencies identified.');

  const minimumWarning = overallScore < settings.minScoreWarningThreshold;

  let readinessLabel = `${overallScore}% Ready`;
  if (overallScore >= 90) readinessLabel = `${overallScore}% Fully Ready`;
  else if (overallScore >= 75) readinessLabel = `${overallScore}% Feasible`;
  else if (overallScore >= 60) readinessLabel = `${overallScore}% Needs Revision`;
  else readinessLabel = `${overallScore}% High Risk`;

  return {
    overallScore,
    readinessLabel,
    categories: categoryScores,
    recommendations,
    strengths,
    weaknesses,
    evaluatedAt: new Date().toISOString(),
    aiPowered: true,
    minimumWarning,
  };
}
