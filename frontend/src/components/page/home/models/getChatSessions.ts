import axios from "axios";
import { ChatSession } from "../Home";

export const getChatSessions = async (
  accessToken: string,
  refreshToken: string
): Promise<ChatSession[] | null> => {
  try {
    const response = await axios.get("/api/sessions", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    if (response.data.status === "success") {
      const data = response.data.sessions.map((value: ChatSession) => ({
        ...value,
        // sv-SEロケールはYYYY-MM-DD形式の日付文字列を戻す
        created_at: new Date(value.created_at).toLocaleDateString("sv-SE"),
      }));
      return data;
    } else return null;
  } catch (error) {
    console.error("セッション取得エラー:", error);
    return null;
  }
};
