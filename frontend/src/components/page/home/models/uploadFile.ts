import axios, { isAxiosError } from "axios";
import { FileMessageList } from "@/components/layout/Chat/FileChatContent";

export const uploadFile = async (
  file: File,
  accessToken: string,
  refreshToken: string
) => {
  try {
    const formData = new FormData();
    formData.append(file.name, file);
    const res = await axios.post("/api/pdf", formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    const fileMessageList: FileMessageList = {
      sentMessage: {
        id: "file",
        file: {
          name: file.name,
        },
      },
      contents: {
        id: "upload",
        file: {
          name: res.data.file_name,
          link: res.data.download_url,
        },
      },
    };

    const sessionId = res.data.session_id;

    return { fileMessageList, sessionId };
  } catch (e) {
    if (isAxiosError(e)) return e.message;
    else return "エラーが発生しました。";
  }
};
