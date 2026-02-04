const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const getToken = () => localStorage.getItem("token");

async function apiRequest(
    endpoint,
    method = "GET",
    body
) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data;
}

export const authAPI = {
    register: (name, email, password) =>
        apiRequest(
            "/auth/register",
            "POST",
            { name, email, password }
        ),
    login: (email, password) =>
        apiRequest(
            "/auth/login",
            "POST",
            { email, password }
        ),
    me: () => apiRequest("/auth/me"),
};

export const progressAPI = {
    getProgress: () =>
        apiRequest(
            "/progress"
        ),
    saveLesson: (data) =>
        apiRequest(
            "/progress/lesson",
            "POST",
            data
        ),
    saveFlashcardProgress: (
        language,
        knownCards,
        learningCards
    ) =>
        apiRequest(
            "/progress/flashcard",
            "POST",
            { language, knownCards, learningCards }
        ),
    saveStoryCompletion: (storyId) =>
        apiRequest(
            "/progress/story",
            "POST",
            { storyId }
        ),
    savePracticeSession: (language, questionsAnswered, correctAnswers) =>
        apiRequest(
            "/progress/practice",
            "POST",
            { language, questionsAnswered, correctAnswers }
        ),
};

export const challengeAPI = {
    getDailyChallenge: () =>
        apiRequest(
            "/challenges/daily"
        ),
    submitDailyChallenge: (score, bonusPoints) =>
        apiRequest(
            "/challenges/daily",
            "POST",
            { score, bonusPoints }
        ),
};

export const userAPI = {
    completeOnboarding: () =>
        apiRequest(
            "/users/onboarding",
            "PUT"
        ),
    updateCurrentLanguage: (language) =>
        apiRequest(
            "/users/language",
            "PUT",
            { language }
        ),
    updateProfile: (data) =>
        apiRequest(
            "/users/profile",
            "PUT",
            data
        ),
};
