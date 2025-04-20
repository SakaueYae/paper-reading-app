import axios from "axios";

export const getMessages = async (
  sessionId: string,
  accessToken: string,
  refreshToken: string
) => {
  try {
    const response = await axios.get(`/api/sessions/${sessionId}/messages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    if (response.data.status === "success") {
      return response.data.messages;
    }
  } catch (error) {
    console.error("メッセージ取得エラー:", error);
  }
};
