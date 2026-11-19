type Choice = "allow" | "decline";
const preferenceCookie = "plot_cookie_choice";
const campaignKey = "plot-campaign-v1";
const fields = ["utm_source", "utm_medium", "utm_campaign"] as const;
type Campaign = Partial<Record<(typeof fields)[number] | "landing_path", string>>;

export function cookieChoice(): Choice | null {
  try {
    const entry = document.cookie.split("; ").find(item => item.startsWith(preferenceCookie + "="));
    const choice = entry?.slice(preferenceCookie.length + 1);
    return choice === "allow" || choice === "decline" ? choice : null;
  } catch {
    return null;
  }
}

export function saveCookieChoice(choice: Choice) {
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = preferenceCookie + "=" + choice + "; Path=/; Max-Age=15552000; SameSite=Lax" + secure;
  } catch { /* Browsing and forms also work when cookies are disabled. */ }
  if (choice === "decline") clearCampaign();
}

function clearCampaign() {
  try { sessionStorage.removeItem(campaignKey); } catch { /* Storage unavailable. */ }
}

export function campaignFields(): Campaign {
  if (cookieChoice() !== "allow") {
    clearCampaign();
    return {};
  }

  try {
    const raw = sessionStorage.getItem(campaignKey);
    if (raw) {
      const stored = JSON.parse(raw);
      const campaign: Campaign = {};
      for (const key of fields) {
        if (typeof stored?.[key] === "string" && stored[key]) campaign[key] = stored[key].slice(0, 150);
      }
      if (Object.keys(campaign).length) {
        if (typeof stored.landing_path === "string") campaign.landing_path = stored.landing_path.slice(0, 200);
        return campaign;
      }
    }
    const tags = new URLSearchParams(location.search);
    const campaign: Campaign = {};
    for (const key of fields) {
      const value = tags.get(key)?.trim().slice(0, 150);
      if (value) campaign[key] = value;
    }
    if (Object.keys(campaign).length) {
      campaign.landing_path = location.pathname.slice(0, 200);
      sessionStorage.setItem(campaignKey, JSON.stringify(campaign));
    }
    return campaign;
  } catch {
    clearCampaign();
    return {};
  }
}

export function refreshCampaign() {
  // Discard data from the older implementation, which had no preference check.
  try { sessionStorage.removeItem("plot-attribution"); } catch { /* Storage unavailable. */ }
  campaignFields();
}
