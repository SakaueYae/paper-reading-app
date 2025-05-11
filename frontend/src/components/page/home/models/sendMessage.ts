import { API_URL } from "@/config";
import axios from "axios";

export const sendMessage = async (
  message: string,
  session_id: string | null,
  accessToken: string,
  refreshToken: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/chat`,
      {
        message,
        session_id,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Refresh-Token": refreshToken,
        },
      }
    );

    return response.data.session_id;
  } catch (e) {
    console.log("メッセージ取得エラー:", e);
  }
};
