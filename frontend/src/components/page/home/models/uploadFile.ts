import { API_URL } from "@/config";
import axios, { isAxiosError } from "axios";

export const uploadFile = async (
  file: File,
  accessToken: string,
  refreshToken: string
) => {
  try {
    const formData = new FormData();
    formData.append(file.name, file);
    const res = await axios.post(`${API_URL}/api/pdf`, formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    const sessionId = res.data.session_id;

    return { sessionId };
  } catch (e) {
    if (isAxiosError(e)) return e.message;
    else return "エラーが発生しました。";
  }
};
