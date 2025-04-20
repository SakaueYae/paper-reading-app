import axios from "axios";

export const getChatSessions = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    const response = await axios.get("/api/sessions", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    if (response.data.status === "success") {
      return response.data.sessions;
    }
  } catch (error) {
    console.error("セッション取得エラー:", error);
  }
};
