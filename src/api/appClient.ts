import { runMockFunction, runMockInvokeLLM } from "@/api/mockFunctions";

type AnyRecord = Record<string, any>;

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210");
const STORAGE_PREFIX = "kisan_saathi_entity_";
const AUTH_USER_KEY = "kisan_saathi_auth_user";
const AUTH_FLAG_KEY = "kisan_saathi_is_authenticated";

const nowIso = () => new Date().toISOString();

const safeJsonParse = (value: string | null, fallback: any) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const readStore = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  return safeJsonParse(window.localStorage.getItem(key), fallback);
};

const writeStore = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const readCollection = (entityName: string): AnyRecord[] =>
  readStore(`${STORAGE_PREFIX}${entityName}`, []);

const writeCollection = (entityName: string, rows: AnyRecord[]) =>
  writeStore(`${STORAGE_PREFIX}${entityName}`, rows);

const sortRows = (rows: AnyRecord[], sortBy = "-created_date") => {
  const direction = sortBy.startsWith("-") ? -1 : 1;
  const key = sortBy.replace(/^-/, "");
  return [...rows].sort((a, b) => {
    const av = a?.[key];
    const bv = b?.[key];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return av > bv ? direction : -direction;
  });
};

const normalizeFunctionResponse = (payload: AnyRecord) => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return { data: payload };
  }
  return { data: { success: true, data: payload } };
};

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const err: AnyRecord = new Error(
      typeof data === "object" && data?.error ? String(data.error) : response.statusText,
    );
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

const postJson = async (url: string, payload: AnyRecord = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

const functionEndpoints = (name: string) => {
  const fromBase = API_BASE_URL
    ? [`${API_BASE_URL}/functions/${name}`, `${API_BASE_URL}/api/functions/${name}`]
    : [];
  const local = [`/functions/${name}`, `/api/functions/${name}`];
  return [...new Set([...fromBase, ...local])];
};

const makeEntityApi = (entityName: string) => ({
  async list(sortBy = "-created_date", limit = 50) {
    const rows = sortRows(readCollection(entityName), sortBy);
    return rows.slice(0, limit);
  },
  async filter(criteria: AnyRecord = {}) {
    const rows = readCollection(entityName);
    return rows.filter((row) =>
      Object.entries(criteria).every(([key, value]) => row?.[key] === value),
    );
  },
  async create(payload: AnyRecord) {
    const rows = readCollection(entityName);
    const row = {
      id: payload?.id || crypto.randomUUID(),
      created_date: nowIso(),
      updated_date: nowIso(),
      ...payload,
    };
    rows.push(row);
    writeCollection(entityName, rows);
    return row;
  },
  async update(id: string, payload: AnyRecord) {
    const rows = readCollection(entityName);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      throw new Error(`${entityName} record not found`);
    }
    rows[index] = {
      ...rows[index],
      ...payload,
      updated_date: nowIso(),
    };
    writeCollection(entityName, rows);
    return rows[index];
  },
  async delete(id: string) {
    const rows = readCollection(entityName).filter((row) => row.id !== id);
    writeCollection(entityName, rows);
    return { success: true };
  },
  async bulkCreate(items: AnyRecord[] = []) {
    const rows = readCollection(entityName);
    const created = items.map((item) => ({
      id: item?.id || crypto.randomUUID(),
      created_date: item?.created_date || nowIso(),
      updated_date: nowIso(),
      ...item,
    }));
    writeCollection(entityName, [...rows, ...created]);
    return created;
  },
});

const entities: AnyRecord = new Proxy(
  {},
  {
    get(_, property: string) {
      return makeEntityApi(String(property));
    },
  },
);

const readAuthState = () => {
  const rawUser = readStore(AUTH_USER_KEY, null);
  const isAuthenticated = readStore(AUTH_FLAG_KEY, true);
  const fallbackUser = {
    id: "local-user",
    role: "farmer",
    name: "Kisan Saathi User",
    phone: "",
  };
  return {
    isAuthenticated,
    user: rawUser || fallbackUser,
  };
};

const writeAuthState = (isAuthenticated: boolean, user?: AnyRecord) => {
  writeStore(AUTH_FLAG_KEY, isAuthenticated);
  if (user) {
    writeStore(AUTH_USER_KEY, user);
  }
};

const auth = {
  async isAuthenticated() {
    return readAuthState().isAuthenticated;
  },
  async me() {
    const state = readAuthState();
    if (!state.isAuthenticated) {
      const err: AnyRecord = new Error("Authentication required");
      err.status = 401;
      throw err;
    }
    return state.user;
  },
  logout(redirectUrl?: string) {
    writeAuthState(false);
    if (redirectUrl && typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
  },
  redirectToLogin(redirectUrl?: string) {
    writeAuthState(true);
    if (redirectUrl && typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
  },
};

const functions = {
  async invoke(name: string, payload: AnyRecord = {}) {
    // Try real backend endpoints first so farmers get live weather/market/scheme data when available.
    const endpoints = functionEndpoints(name);
    for (const endpoint of endpoints) {
      try {
        const response = await postJson(endpoint, payload);
        return normalizeFunctionResponse(response as AnyRecord);
      } catch {
        continue;
      }
    }

    // Fallback keeps the app usable in low-connectivity areas and local demos.
    const mocked = (await runMockFunction(name, payload)) as AnyRecord;
    if (name === "checkAlerts" && Array.isArray(mocked.notifications) && mocked.notifications.length > 0) {
      // Persist generated alerts so users can read them later from Notification Center.
      await entities.FarmerNotification.bulkCreate(mocked.notifications);
    }
    return normalizeFunctionResponse(mocked);
  },
};

const fileToDataUrl = async (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });

const integrations = {
  Core: {
    async InvokeLLM(payload: AnyRecord = {}) {
      const candidates = API_BASE_URL
        ? [`${API_BASE_URL}/api/llm/invoke`, `${API_BASE_URL}/llm/invoke`]
        : [];

      for (const endpoint of candidates) {
        try {
          return await postJson(endpoint, payload);
        } catch {
          continue;
        }
      }

      return runMockInvokeLLM(payload);
    },
    async UploadFile({ file }: { file: File }) {
      if (!file) {
        throw new Error("File is required");
      }

      const uploadEndpoint = String(import.meta.env.VITE_UPLOAD_ENDPOINT || "");
      if (uploadEndpoint) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(uploadEndpoint, { method: "POST", body: formData });
        const payload = await parseResponse(response);
        if (payload?.file_url) return payload;
      }

      const fileUrl = await fileToDataUrl(file);
      return { file_url: fileUrl };
    },
    async SendEmail(payload: AnyRecord = {}) {
      return { success: false, message: "Email endpoint is not configured.", payload };
    },
    async SendSMS(payload: AnyRecord = {}) {
      return { success: false, message: "SMS endpoint is not configured.", payload };
    },
    async GenerateImage(payload: AnyRecord = {}) {
      return { success: false, message: "Image generation endpoint is not configured.", payload };
    },
    async ExtractDataFromUploadedFile(payload: AnyRecord = {}) {
      return { success: false, message: "File extraction endpoint is not configured.", payload };
    },
  },
};

const appLogs = {
  async logUserInApp(_pageName: string) {
    return { success: true };
  },
};

const agents = {
  getWhatsAppConnectURL(agentName = "KisanSaathi") {
    const text = encodeURIComponent(`Hi ${agentName}, I need help with farming advice.`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  },
};

export const appClient: AnyRecord = {
  auth,
  entities,
  functions,
  integrations,
  appLogs,
  agents,
  asServiceRole: { entities },
};

