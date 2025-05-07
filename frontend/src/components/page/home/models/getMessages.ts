import { Message } from "@/components/layout/Chat/ChatContent";
import axios, { isAxiosError } from "axios";

export const getMessages = async (
  sessionId: string,
  accessToken: string,
  refreshToken: string
): Promise<Message | string> => {
  try {
    const response = await axios.get(`/api/sessions/${sessionId}/messages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    const fileData = response.data.file_data;

    return {
      messagesHistory: response.data.messages,
      file: {
        uploadedFile: {
          name: fileData.uploaded_file_name,
        },
        translatedFile: {
          name: fileData.translated_file_name,
          link: fileData.file_url,
        },
      },
    };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("メッセージ取得エラー:", error);
      return error.message;
    }
  }

  return "エラーが発生しました。";
};
